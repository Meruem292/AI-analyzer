const SUPABASE_URL = 'https://gjfwrphhhgodjhtgwmum.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZndycGhoaGdvZGpodGd3bXVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg4OTIzMSwiZXhwIjoyMDcyNDY1MjMxfQ.5P4Q6aE1_O7CkTPTmOORJRObVhBNnqdBaNeuxhURMlY';
const BUCKET_NAME = 'polyBitePhoto';
const LIST_URL = `${SUPABASE_URL}/storage/v1/object/list/${BUCKET_NAME}`;
const PUBLIC_URL_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`;

interface SupabaseFile {
  name: string;
  created_at: string;
}

export async function getLatestPhotoUrl(): Promise<string> {
  try {
    const response = await fetch(LIST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        prefix: '', // List all files in the bucket
        limit: 2, // Fetch 2 in case the most recent is a placeholder file
        offset: 0,
        sortBy: {
          column: 'created_at',
          order: 'desc',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to fetch photo list: ${errorData.message || response.statusText}`);
    }

    const files: SupabaseFile[] = await response.json();

    if (!files || files.length === 0) {
      throw new Error('No photos found in the collection.');
    }

    let latestFile = files[0];
    
    // Check for Supabase's empty folder placeholder and use the next file if it exists
    if (latestFile.name === '.emptyFolderPlaceholder') {
      if (files.length > 1) {
        latestFile = files[1];
      } else {
        throw new Error('No photos found in the collection.');
      }
    }
    
    if (!latestFile || !latestFile.name) {
        throw new Error('Received invalid file data from Supabase.');
    }

    return `${PUBLIC_URL_PREFIX}${latestFile.name}`;
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while fetching the latest photo.');
  }
}