
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MedicalQuerySchema = z.object({
  query: z.string().describe('The medical question from the user.'),
});
export type MedicalQuery = z.infer<typeof MedicalQuerySchema>;


const MedicalContextSchema = z.object({
  query: z.string(),
});

const MedicalResponseSchema = z.object({
  answer: z.string().describe('The detailed answer to the medical question, formatted with markdown.'),
});
export type MedicalResponse = z.infer<typeof MedicalResponseSchema>;


const guidancePrompt = ai.definePrompt({
  name: 'medicalGuidancePrompt',
  input: { schema: MedicalContextSchema },
  output: { schema: MedicalResponseSchema },
  prompt: `You are an AI medical assistant for ship crews. Your purpose is to provide clear, concise, and safe medical guidance. Your primary source of information should be the context provided from official medical handbooks.

  IMPORTANT:
  - You are not a doctor. Your advice is for informational purposes only.
  - Always preface your advice with a clear warning: "This is not a substitute for professional medical advice. In a serious emergency, contact a shore-based medical service immediately."
  - If the provided context does not contain the answer, state that you cannot find the information in the available documents. Then, you may provide general guidance based on your training, but you must state that this information is general and does not come from the ship's official documents.
  - Structure your answers for maximum clarity. Use paragraphs to separate ideas and use markdown bullet points (using * or -) for lists or step-by-step instructions.
  - Keep the language simple and easy for a non-medical professional to understand.

  User's Question:
  {{{query}}}

  Answer based on the provided documents or your general knowledge if necessary:`,
});

const guidanceFlow = ai.defineFlow(
  {
    name: 'guidanceFlow',
    inputSchema: MedicalQuerySchema,
    outputSchema: MedicalResponseSchema,
  },
  async (input) => {
    const context: z.infer<typeof MedicalContextSchema> = {
      query: input.query,
    };

    const { output } = await guidancePrompt(context);
    return output!;
  }
);


export async function medicalGuidanceFlow(input: MedicalQuery): Promise<MedicalResponse> {
    // In a future step, this is where we would use a retriever to find
    // relevant context from uploaded medical documents.
    // For now, we are just passing the query directly.
    return await guidanceFlow(input);
}
