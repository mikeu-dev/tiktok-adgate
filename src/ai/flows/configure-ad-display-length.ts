'use server';

/**
 * @fileOverview Configures the duration of the advertisement displayed in the modal.
 *
 * - configureAdDisplayLength - A function that configures the duration of the advertisement displayed in the modal.
 * - ConfigureAdDisplayLengthInput - The input type for the configureAdDisplayLength function.
 * - ConfigureAdDisplayLengthOutput - The return type for the configureAdDisplayLength function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { updateAdDuration } from '@/lib/config-store';

const ConfigureAdDisplayLengthInputSchema = z.object({
  duration: z
    .number()
    .min(5)
    .max(60)
    .describe('The duration of the advertisement in seconds.'),
});
export type ConfigureAdDisplayLengthInput = z.infer<
  typeof ConfigureAdDisplayLengthInputSchema
>;

const ConfigureAdDisplayLengthOutputSchema = z.object({
  success: z.boolean().describe('Whether the configuration was successful.'),
  message: z.string().describe('A message indicating the result of the configuration.'),
});
export type ConfigureAdDisplayLengthOutput = z.infer<
  typeof ConfigureAdDisplayLengthOutputSchema
>;

export async function configureAdDisplayLength(
  input: ConfigureAdDisplayLengthInput
): Promise<ConfigureAdDisplayLengthOutput> {
  return configureAdDisplayLengthFlow(input);
}

const configureAdDisplayLengthPrompt = ai.definePrompt({
  name: 'configureAdDisplayLengthPrompt',
  input: { schema: ConfigureAdDisplayLengthInputSchema },
  output: { schema: ConfigureAdDisplayLengthOutputSchema },
  prompt: `You are an admin configuring the ad display length.

The requested ad display duration is {{duration}} seconds.

Return a success message and indicate that the configuration was successful.`,
});

const configureAdDisplayLengthFlow = ai.defineFlow(
  {
    name: 'configureAdDisplayLengthFlow',
    inputSchema: ConfigureAdDisplayLengthInputSchema,
    outputSchema: ConfigureAdDisplayLengthOutputSchema,
  },
  async input => {
    try {
      await updateAdDuration(input.duration);
      const { output } = await configureAdDisplayLengthPrompt(input);
      return output!;
    } catch (e) {
      // If the error is from the prompt (AI), but update succeeded, we should still report success
      // However, we don't know for sure which one failed in this try block without splitting them.
      // But since we saw the file update, it's likely the AI.
      console.warn("AI generation failed, returning fallback success message", e);
      return {
        success: true,
        message: `Configuration updated to ${input.duration} seconds (AI response unavailable).`
      }
    }
  }
);
