export const detectMimeType = (b64: string): string | null => {
  const signatures: { [key: string]: string } = {
    '/9j/': 'image/jpeg',
    'iVBOR': 'image/png',
    'R0lGO': 'image/gif',
    'UklGR': 'image/webp',
    'PHN2Zw': 'image/svg+xml',
    'Qk0=': 'image/bmp'
  };
  for (const s in signatures) {
    if (b64.startsWith(s)) {
      return signatures[s];
    }
  }
  return null;
}

export const imageUrlToBase64 = async (url: string): Promise<{ base64: string; mimeType: string }> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        const mimeType = response.headers.get('content-type') || 'application/octet-stream';
        const arrayBuffer = await response.arrayBuffer();

        let base64: string;

        // This function needs to work in both Node.js (for the API route) and the browser.
        // In a Node.js environment, the global 'Buffer' class will be available.
        if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
            // Node.js environment: Use Buffer for efficient Base64 encoding.
            base64 = Buffer.from(arrayBuffer).toString('base64');
        } else {
            // Browser environment: Fallback to using btoa.
            const uint8Array = new Uint8Array(arrayBuffer);
            let binaryString = '';
            // Using for...of is cleaner than the classic for loop.
            for (const byte of uint8Array) {
                binaryString += String.fromCharCode(byte);
            }
            base64 = btoa(binaryString);
        }

        return { base64, mimeType };
    } catch (error) {
        console.error("Error in imageUrlToBase64:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to convert image to Base64: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while converting image to Base64.");
    }
};