import config from '@/config';
import { GeminiResponse } from '@/types';
import logger from '@/utils/logger';

export class GeminiService {
  static async analyzeWithAI(jobDescription: string, cv: string): Promise<string> {
    const prompt = `
      You are an expert HR analyst and career counselor. Analyze the following job description and CV to provide comprehensive insights.

      JOB DESCRIPTION:
      ${jobDescription}

      CANDIDATE CV:
      ${cv}

      Please provide a detailed analysis covering:

      ## Overall Match Assessment
      Rate the overall alignment between the candidate and job requirements (1-10 scale) and provide reasoning.

      ## Candidate Strengths
      List the candidate's key strengths that align well with the job requirements.

      ## Areas for Improvement
      Identify gaps or weaknesses in the candidate's profile relative to the job requirements.

      ## Specific Skill Analysis
      - Technical skills match
      - Soft skills alignment
      - Experience relevance

      ## Recommendations
      - For the candidate: How to improve their application or skills
      - For the employer: Key questions to ask during interview

      ## Red Flags (if any)
      Any concerning aspects that need attention.

      Please be specific, constructive, and professional in your analysis.
    `;

    try {
      logger.info('Starting Gemini AI analysis', {
        jobDescriptionLength: jobDescription.length,
        cvLength: cv.length,
      });

      const response = await fetch(config.geminiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${config.authToken}`,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          systemInstruction:
            'You are a professional HR analyst providing objective, constructive feedback on candidate-job alignment.',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Gemini AI API Error', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`AI analysis failed: ${response.status} ${response.statusText}`);
      }

      const result = (await response.json()) as GeminiResponse;

      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const analysisText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        logger.info('Gemini AI analysis completed', {
          responseLength: analysisText?.length,
        });

        return analysisText;
      } else {
        logger.error('Unexpected AI response format', { result });
        throw new Error('Unexpected AI response format');
      }
    } catch (error) {
      logger.error('AI Analysis Error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new Error('Failed to analyze documents with AI');
    }
  }
}
