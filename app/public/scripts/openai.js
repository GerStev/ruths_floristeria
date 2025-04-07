import OpenAI from 'openai';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar OpenAI con la API key del entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generarImagen(descripcion) {
    if (!descripcion || typeof descripcion !== "string") {
        console.error("La descripción proporcionada no es válida.");
        return null;
    }

    // Verificar que la API key está configurada
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY no está configurada en las variables de entorno");
    }

    try {
        const optimizedPrompt = `Crea una imagen realista de un arreglo floral profesional basado en esta descripción: ${descripcion}. 
        La imagen debe ser de alta calidad (4K), con iluminación profesional, fondo neutro y aspecto de fotografía de producto. 
        Enfócate en detalles realistas de las flores y el envoltorio.`;

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: optimizedPrompt,
            n: 1,
            size: "1024x1024",
            quality: "hd",
            style: "natural"
        });

        if (response?.data?.[0]?.url) {
            return response.data[0].url;
        } else {
            console.error("Respuesta inesperada de OpenAI:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al generar imagen:", error.message || error);
        throw error;
    }
}