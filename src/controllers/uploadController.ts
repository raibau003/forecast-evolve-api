import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { createResponse } from '../utils/helpers';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

/**
 * Subir archivo a Supabase Storage
 * POST /api/upload
 */
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json(
        createResponse(false, undefined, 'No se proporcionó ningún archivo')
      );
    }

    const file = req.file;
    const bucket = req.body.bucket || 'proposal-hub'; // Bucket por defecto
    const folder = req.body.folder || '';

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.originalname}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Leer el archivo
    const fileBuffer = fs.readFileSync(file.path);

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: file.mimetype,
        upsert: false
      });

    // Eliminar archivo temporal
    fs.unlinkSync(file.path);

    if (error) {
      console.error('Error al subir archivo a Supabase:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al subir archivo')
      );
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return res.json(
      createResponse(
        true,
        {
          filename: fileName,
          path: filePath,
          url: urlData.publicUrl,
          size: file.size,
          mimetype: file.mimetype
        },
        undefined,
        'Archivo subido exitosamente'
      )
    );
  } catch (error: any) {
    console.error('Error en uploadFile:', error);

    // Limpiar archivo temporal si existe
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // Ignorar error de limpieza
      }
    }

    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Procesar archivo Word (.docx) y extraer texto
 * POST /api/upload/parse-docx
 */
export const parseDocx = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json(
        createResponse(false, undefined, 'No se proporcionó ningún archivo')
      );
    }

    const file = req.file;

    if (!file.originalname.endsWith('.docx')) {
      fs.unlinkSync(file.path);
      return res.status(400).json(
        createResponse(false, undefined, 'El archivo debe ser un documento .docx')
      );
    }

    // Leer y procesar el archivo con mammoth
    const result = await mammoth.extractRawText({ path: file.path });
    const text = result.value;

    // Eliminar archivo temporal
    fs.unlinkSync(file.path);

    return res.json(
      createResponse(
        true,
        {
          text,
          filename: file.originalname,
          size: file.size
        },
        undefined,
        'Archivo procesado exitosamente'
      )
    );
  } catch (error: any) {
    console.error('Error en parseDocx:', error);

    // Limpiar archivo temporal
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // Ignorar
      }
    }

    return res.status(500).json(
      createResponse(false, undefined, 'Error al procesar archivo')
    );
  }
};

/**
 * Eliminar archivo de Supabase Storage
 * DELETE /api/upload/:bucket/:path
 */
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { bucket, path: filePath } = req.params;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error al eliminar archivo:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al eliminar archivo')
      );
    }

    return res.json(
      createResponse(true, undefined, undefined, 'Archivo eliminado exitosamente')
    );
  } catch (error: any) {
    console.error('Error en deleteFile:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Listar archivos de un bucket
 * GET /api/upload/:bucket/list
 */
export const listFiles = async (req: Request, res: Response) => {
  try {
    const { bucket } = req.params;
    const folder = req.query.folder as string || '';

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) {
      console.error('Error al listar archivos:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al listar archivos')
      );
    }

    return res.json(createResponse(true, data));
  } catch (error: any) {
    console.error('Error en listFiles:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};
