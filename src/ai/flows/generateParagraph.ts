// src/ai/flows/generateParagraph.ts
'use server';
/**
 * @fileOverview Generates a random paragraph for typing tests.
 *
 * - generateParagraph - A function that generates a paragraph of a specified length.
 * - ParagraphInput - The input type for the generateParagraph function.
 * - ParagraphOutput - The return type for the generateParagraph function.
 */

import { ai } from '../genkit'; // Assuming genkit is correctly set up here
import { z } from 'zod';

const ParagraphInputSchema = z.object({
  length: z.enum(['50', '100', '200', '300']).describe("The approximate number of words for the paragraph."),
  includePunctuation: z.boolean().default(false).describe("Whether to include punctuation in the paragraph."), // New field
  includeNumbers: z.boolean().default(false).describe("Whether to include numbers in the paragraph.")     // New field
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
    let promptText = `Generate a random English paragraph of approximately ${wordCount} words suitable for a typing test.`;

    const features = [];
    if (input.includePunctuation) {
      features.push("a variety of punctuation (periods, commas, apostrophes, question marks, exclamation marks, colons, semicolons)");
    }
    if (input.includeNumbers) {
      features.push("common numbers (e.g., 1, 10, 1999, 2023)");
    }

    if (features.length > 0) {
      promptText += ` The paragraph should contain a mix of common words, including uppercase and lowercase letters, ${features.join(" and ")}.`;
    } else {
      promptText += ` The paragraph should contain a mix of common words, including uppercase and lowercase letters. Avoid numbers and complex punctuation; focus on basic word repetition and structure.`;
    }

    promptText += ` Vary sentence lengths. Do not include any preamble like "Here is a paragraph:". Just output the paragraph itself. Ensure the paragraph is engaging and makes sense.`;

    try {
      const llmResponse = await ai.generate({
        prompt: promptText,
        config: {
          temperature: 0.7,
          maxOutputTokens: wordCount * 10 + (input.includeNumbers ? 20 : 0) + (input.includePunctuation ? 20 : 0), // Adjust token buffer
        },
      });
      
      let generatedText = llmResponse.text || `Error: Empty response from AI. Default paragraph: The quick brown fox jumps over the lazy dog.`;

      // Post-processing to ensure adherence if AI fails
      const hasPunctuation = /[.,!?;:'"\-]/.test(generatedText);
      const hasNumbers = /\s\d+\s|\s\d{2,}\s/.test(generatedText);

      if (input.includePunctuation && !hasPunctuation) {
        generatedText += " For example: it's a wonderful day, isn't it?";
      }
      if (input.includeNumbers && !hasNumbers) {
        generatedText += " The count is 42.";
      }
      
      // If both are off, and AI produced something, try to clean it.
      if (!input.includePunctuation && !input.includeNumbers) {
        generatedText = generatedText.replace(/[\d.,!?;:'"\-\s]+/g, (match) => {
            if (/\s/.test(match)) return ' '; // Preserve spaces
            return ''; // Remove punctuation/numbers
        }).replace(/\s+/g, ' ').trim();
      } else if (!input.includePunctuation && hasPunctuation) { // Remove punctuation if not requested
          generatedText = generatedText.replace(/[,.!?;:'"\-]/g, '').replace(/\s+/g, ' ').trim();
      } else if (!input.includeNumbers && hasNumbers) { // Remove numbers if not requested
          generatedText = generatedText.replace(/\s+\d+\s+/g, ' ').replace(/\s+/g, ' ').trim();
      }


      // Ensure correct word count approximately
      const words = generatedText.split(/\s+/).filter(Boolean);
      if (words.length > wordCount + 20) { // Allow slight overage
         generatedText = words.slice(0, wordCount).join(' ');
      }
      
      return generatedText;
      
    } catch (error) {
      console.error('Error generating paragraph with AI:', error);
      // Provide a more robust fallback that includes the requested elements if possible
      let fallback = "The quick brown fox jumps over the lazy dog.";
      if (input.includePunctuation) {
          fallback += " It's a sunny day, isn't it?";
      }
      if (input.includeNumbers) {
          fallback += " We need 5 apples and 3 oranges for the recipe.";
      }
      return fallback;
    }
  }
);

export async function generateParagraph(input: ParagraphInput): Promise<ParagraphOutput> {
  return _generateParagraphInternalFlow(input);
}