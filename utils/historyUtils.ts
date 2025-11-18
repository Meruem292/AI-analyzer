const HISTORY_KEY = 'base64ImageHistory';
const MAX_HISTORY_SIZE = 12; // Show the last 12 images

/**
 * Retrieves the image history from local storage.
 * @returns {string[]} An array of image data URLs.
 */
export const getHistory = (): string[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage:", error);
    return [];
  }
};

/**
 * Adds a new image URL to the beginning of the history.
 * If the history exceeds the maximum size, the oldest entry is removed.
 * @param {string} imageUrl The image data URL to add.
 */
export const addToHistory = (imageUrl: string) => {
  try {
    const currentHistory = getHistory();
    // Prevent duplicates by removing the item if it already exists
    const filteredHistory = currentHistory.filter(item => item !== imageUrl);
    const newHistory = [imageUrl, ...filteredHistory].slice(0, MAX_HISTORY_SIZE);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to add item to localStorage history:", error);
  }
};

/**
 * Clears the entire image history from local storage.
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage history:", error);
  }
};
