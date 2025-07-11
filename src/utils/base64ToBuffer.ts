export function base64ToBuffer(base64: string): Buffer {
    // Remove data URL prefix if present
    const base64Data = base64.replace(/^data:.*,/, '');
    return Buffer.from(base64Data, 'base64');
  }