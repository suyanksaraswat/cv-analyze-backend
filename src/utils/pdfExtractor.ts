import { PdfReader } from 'pdfreader';
import { base64ToBuffer } from './base64ToBuffer';
import logger from './logger';

export function extractTextFromPDF(base64PDF: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const buffer = base64ToBuffer(base64PDF);
      const reader = new PdfReader();
      let fullText = '';

      logger.info('Starting PDF text extraction', { bufferSize: buffer.length });

      reader.parseBuffer(buffer, (err: any, item) => {
        if (err) {
          logger.error('PDF parsing error', { error: err.message });
          return reject(new Error(`PDF parsing failed: ${err.message}`));
        }

        if (!item) {
          const extractedText = fullText.trim();
          logger.info('PDF text extraction completed', {
            textLength: extractedText.length,
          });
          return resolve(extractedText);
        }

        if ('text' in item && item.text) {
          fullText += item.text + ' ';
        }
      });
    } catch (error) {
      logger.error('PDF extraction error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      reject(new Error('Failed to process PDF'));
    }
  });
}
