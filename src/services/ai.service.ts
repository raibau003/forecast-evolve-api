import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export class AIService {
  async generateSpeech(
    contactName: string,
    company: string,
    position: string,
    style: 'normal' | 'short' | 'consultative' | 'direct'
  ): Promise<string> {
    const stylePrompts = {
      normal: 'Crea un speech de ventas de 20-30 segundos, amigable y profesional.',
      short: 'Crea un speech muy breve de 10-15 segundos, directo al punto.',
      consultative: 'Crea un speech consultivo enfocado en hacer preguntas y descubrir necesidades.',
      direct: 'Crea un speech muy directo para agendar una reunión rápidamente.'
    };

    const prompt = `${stylePrompts[style]}

Contacto: ${contactName}
Empresa: ${company}
Cargo: ${position}

El speech debe:
- Mencionar el nombre del contacto
- Ser relevante para su cargo y empresa
- Ser natural y conversacional
- Incluir un call-to-action claro`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Eres un experto en ventas B2B.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 300
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<string> {
    const systemContext = `Eres un asistente experto en ventas para Forecast Evolve, un CRM y plataforma de ventas.
Tienes conocimiento completo sobre:
- Gestión de pipeline de ventas
- Prospección de clientes
- Técnicas de cierre
- Seguimiento de oportunidades
- Best practices de ventas B2B

Proporciona respuestas útiles, accionables y específicas para el contexto de ventas.`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemContext },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 800
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`Failed to chat: ${error.message}`);
    }
  }
}

export default new AIService();
