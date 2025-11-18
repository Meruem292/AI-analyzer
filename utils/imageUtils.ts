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

export const imageUrlToBase64 = (url: string): Promise<{ base64: string; mimeType: string }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => {
                const result = reader.result as string;
                const mimeType = result.split(';')[0].split(':')[1];
                const base64 = result.split(',')[1];
                resolve({ base64, mimeType });
            };
            reader.onerror = error => reject(error);
        } catch (error) {
            reject(error);
        }
    });
};
