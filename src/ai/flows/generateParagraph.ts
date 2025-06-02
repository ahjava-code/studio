// src/ai/flows/generateParagraph.ts
import { defineFlow } from 'genkit';
import { ai } from '../genkit'; // Assumes genkit instance is configured at src/ai/genkit.ts
import { z } from 'zod';

export const generateParagraphFlow = defineFlow(
  {
    name: 'generateParagraph',
    inputSchema: z.object({ length: z.enum(['50', '100', '200', '300']) }),
    outputSchema: z.string(),
  },
  async (input) => {
    const wordCount = parseInt(input.length, 10);
    const prompt = `Generate a random English paragraph of approximately ${wordCount} words suitable for a typing test. The paragraph should contain a mix of common words, some punctuation (periods, commas, apostrophes, question marks, exclamation marks), and varying sentence lengths. Do not include any special characters beyond standard English punctuation. Do not add any preamble like "Here is a paragraph:". Just output the paragraph itself. Ensure the paragraph is engaging and makes sense.`;

    try {
      const llmResponse = await ai.generate({
        prompt,
        // model: 'googleai/gemini-2.0-flash', // This should ideally come from ai.ts or be configurable
        config: {
          temperature: 0.7,
          maxOutputTokens: wordCount * 10, // Estimate max tokens based on word count
        },
      });
      return llmResponse.text() || `Error: Empty response from AI. Default paragraph: The quick brown fox jumps over the lazy dog.`;
    } catch (error) {
      console.error('Error generating paragraph with AI:', error);
      // Return a default paragraph in case of error
      return `The quick brown fox jumps over the lazy dog. This is a default paragraph due to an error generating a new one. A quick brown fox is a common phrase used for testing typewriters and keyboards. The quick brown fox has all letters of the alphabet. ${'The quick brown fox. '.repeat(Math.max(0, (wordCount-50)/5))}`;
    }
  }
);
