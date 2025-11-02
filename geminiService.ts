import { GoogleGenAI, Modality, Type } from '@google/genai';
import { DetectedItem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function recognizeClothing(base64ImageData: string, mimeType: string): Promise<DetectedItem[] | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze the image and identify the main clothing items and accessories worn by the person. Pay close attention to accessories like watches, bracelets, and rings, categorizing them as 'Accessory'. Respond with only a JSON array where each object has a 'category' and a 'description'. Valid categories are: 'Top', 'Bottom', 'Shoes', 'Accessory', 'Outerwear', 'Full Body'. Be specific in the description. Example: [{'category': 'Accessory', 'description': 'silver watch'}]",
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: "The category of the clothing item. Valid values: 'Top', 'Bottom', 'Shoes', 'Accessory' (e.g., watch, bracelet, ring), 'Outerwear', 'Full Body'."
              },
              description: {
                type: Type.STRING,
                description: 'A brief description of the clothing item, e.g., "blue t-shirt".'
              }
            }
          }
        }
      }
    });

    const jsonString = response.text.trim();
     if (!jsonString) {
        return null;
    }
    const detectedItems = JSON.parse(jsonString);
    return detectedItems;

  } catch (error) {
    console.error("Error calling Gemini API for clothing recognition:", error);
    return null;
  }
}

export async function extractClothingItem(base64ImageData: string, mimeType: string, clothingType: string): Promise<string | null> {
  try {
    const prompt = `From the person in the image, accurately isolate their ${clothingType}. The output should be only the ${clothingType} with a plain white background. Do not include any body parts or other clothing. The item should be centered in the output image.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    } else {
      const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
      if (textPart && textPart.text) {
          throw new Error(`AI model responded with text: "${textPart.text}" instead of an image.`);
      }
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API for clothing extraction:", error);
    throw new Error("Failed to extract clothing item with AI. Please check the console for more details.");
  }
}

export async function editImageWithPrompt(base64ImageData: string, mimeType: string, prompt: string, extraImageBase64?: string): Promise<string | null> {
  try {
    const parts: ({ text: string } | { inlineData: { data: string; mimeType: string; } })[] = [
      {
        inlineData: {
          data: base64ImageData,
          mimeType: mimeType,
        },
      },
    ];

    if (extraImageBase64) {
      parts.push({
        inlineData: {
          data: extraImageBase64,
          mimeType: 'image/png', // Assume extracted items are PNGs with transparency
        },
      });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    } else {
      const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
      if (textPart && textPart.text) {
          throw new Error(`AI model responded with text: "${textPart.text}" instead of an image.`);
      }
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to edit image with AI. Please check the console for more details.");
  }
}

export async function generateModelImage(
  modelImg: { data: string, mimeType: string },
  clothingImg: { data: string, mimeType: string },
  backgroundImg: { data: string, mimeType: string },
  prompt: string,
  aspectRatio: string
): Promise<string | null> {
    try {
        const fullPrompt = `Create a photorealistic, high-resolution 4K image with a ${aspectRatio} aspect ratio. 
        The person in the final image must look exactly like the person in the first input image (the model reference). 
        This person must be wearing the exact clothing from the second input image (the clothing reference), preserving all details, patterns, and colors. 
        The background of the final image must be the one from the third input image (the background reference). 
        The scene should also follow these instructions: ${prompt}.`;

        const parts = [
            { inlineData: { data: modelImg.data, mimeType: modelImg.mimeType } },
            { inlineData: { data: clothingImg.data, mimeType: clothingImg.mimeType } },
            { inlineData: { data: backgroundImg.data, mimeType: backgroundImg.mimeType } },
            { text: fullPrompt },
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        } else {
            const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
            if (textPart && textPart.text) {
                throw new Error(`AI model responded with text: "${textPart.text}" instead of an image.`);
            }
            return null;
        }
    } catch (error) {
        console.error("Error calling Gemini API for model generation:", error);
        throw new Error("Failed to generate model image with AI. Please check the console for more details.");
    }
}

export async function generateDifferentPerspectiveImage(
    clothingImg: { data: string, mimeType: string },
    prompt: string,
    aspectRatio: string,
    count: number
): Promise<string[]> {
    try {
        const fullPrompt = `Create ${count} photorealistic, high-resolution 4K image(s) with a ${aspectRatio} aspect ratio. The image(s) must feature the exact clothing item from the reference image, preserving all details, patterns, and colors. The clothing should be presented according to these instructions: ${prompt}. For example: 'worn by a model from a back angle', 'folded neatly on a wooden table', or 'hanging on a rack in a boutique'.`;
        
        const generationPromises = Array(count).fill(0).map(async () => {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: clothingImg.data, mimeType: clothingImg.mimeType } },
                        { text: fullPrompt },
                    ]
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));
            if (imagePart && imagePart.inlineData) {
                return imagePart.inlineData.data;
            }
            return null;
        });

        const results = await Promise.all(generationPromises);
        const validResults = results.filter((r): r is string => r !== null);

        if (validResults.length === 0) {
           throw new Error("AI model did not return any images.");
        }
        
        return validResults;
    } catch (error) {
        console.error("Error calling Gemini API for perspective generation:", error);
        throw new Error("Failed to generate new perspectives with AI. Please check the console for more details.");
    }
}


export async function removeBackground(base64ImageData: string, mimeType: string): Promise<string | null> {
  try {
    const prompt = "Isolate the main subject of the image and make the background transparent. The output should be a PNG with a transparent background.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    } else {
      const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
      if (textPart && textPart.text) {
          throw new Error(`AI model responded with text: "${textPart.text}" instead of an image.`);
      }
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API for background removal:", error);
    throw new Error("Failed to remove background with AI. Please check the console for more details.");
  }
}