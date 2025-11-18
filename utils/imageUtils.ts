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

        // In Node.js, Buffer is available globally. In the browser, it is not.
        // We can check for Buffer's existence to determine the environment.
        let base64: string;
        // Fix: Cannot find name 'Buffer'.
        if (typeof (globalThis as any).Buffer !== 'undefined' && typeof (globalThis as any).Buffer.from === 'function') {
            // Node.js environment
            // Fix: Cannot find name 'Buffer'.
            base64 = (globalThis as any).Buffer.from(arrayBuffer).toString('base64');
        } else {
            // Browser environment (using btoa)
            const uint8Array = new Uint8Array(arrayBuffer);
            let binaryString = '';
            for (let i = 0; i < uint8Array.length; i++) {
                binaryString += String.fromCharCode(uint8Array[i]);
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