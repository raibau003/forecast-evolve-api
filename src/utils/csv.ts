/**
 * Convertir array de objetos a CSV
 */
export function jsonToCSV(data: any[], fields?: string[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Usar campos proporcionados o extraer del primer objeto
  const columns = fields || Object.keys(data[0]);

  // Crear headers
  const headers = columns.join(',');

  // Crear rows
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col];

      if (value === null || value === undefined) {
        return '';
      }

      // Escapar valores con comas o comillas
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
}
