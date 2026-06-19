const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
const bucket = process.env.SUPABASE_BUCKET || 'dermq';

console.log('URL:', url);
console.log('Key (masked):', key ? key.substring(0, 15) + '...' : 'undefined');
console.log('Bucket:', bucket);

if (!url || !key) {
  console.error('Missing URL or Key');
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  const dummyBuffer = Buffer.from('Hello, Supabase!');
  const fileName = `test-upload-${Date.now()}.txt`;
  
  console.log('Uploading dummy file...');
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, dummyBuffer, {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.error('Upload Error:', error);
    
    console.log('Attempting to list buckets to verify connectivity...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('List Buckets Error:', listError);
    } else {
      console.log('Available Buckets:', buckets);
    }
  } else {
    console.log('Upload Success!', data);
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(fileName);
    console.log('Public URL:', publicUrl.publicUrl);
    
    // Clean up
    await supabase.storage.from(bucket).remove([fileName]);
  }
}

test();
