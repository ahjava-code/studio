
'use server';
/**
 * @fileOverview Generates a random paragraph for typing tests.
 *
 * - generateParagraph - A function that generates a paragraph of a specified length.
 * - ParagraphInput - The input type for the generateParagraph function.
 * - ParagraphOutput - The return type for the generateParagraph function.
 */

import { ai } from '../genkit';
import { z } from 'zod';

const ParagraphInputSchema = z.object({
  length: z.enum(['50', '100', '200', '300']).describe("The approximate number of words for the paragraph.")
});
export type ParagraphInput = z.infer<typeof ParagraphInputSchema>;

const ParagraphOutputSchema = z.string().describe("The generated paragraph.");
export type ParagraphOutput = z.infer<typeof ParagraphOutputSchema>;

const _generateParagraphInternalFlow = ai.defineFlow(
  {
    name: 'generateParagraphInternalFlow',
    inputSchema: ParagraphInputSchema,
    outputSchema: ParagraphOutputSchema,
  },
  async (input) => {
    const wordCount = parseInt(input.length, 10);
    const promptText = `Generate a random English paragraph of approximately ${wordCount} words suitable for a typing test. The paragraph should contain a mix of common words, some punctuation (periods, commas, apostrophes, question marks, exclamation marks), and varying sentence lengths. Do not include any special characters beyond standard English punctuation. Do not add any preamble like "Here is a paragraph:". Just output the paragraph itself. Ensure the paragraph is engaging and makes sense.`;

    try {
      const llmResponse = await ai.generate({
        prompt: promptText,
        config: {
          temperature: 0.7,
          maxOutputTokens: wordCount * 10, 
        },
      });
      return llmResponse.text || `Error: Empty response from AI. Default paragraph: The quick brown fox jumps over the lazy dog.`;
    } catch (error) {
      console.error('Error generating paragraph with AI:', error);
      return `The quick brown fox jumps over the lazy dog. This is a default paragraph due to an error generating a new one. A quick brown fox is a common phrase used for testing typewriters and keyboards. The quick brown fox has all letters of the alphabet. ${'The quick brown fox. '.repeat(Math.max(0, (wordCount - 50) / 5))}`;
    }
  }
);

export async function generateParagraph(input: ParagraphInput): Promise<ParagraphOutput> {
  return _generateParagraphInternalFlow(input);
}
