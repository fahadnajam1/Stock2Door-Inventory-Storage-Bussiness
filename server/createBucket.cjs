require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = 'shipping-labels'; // changed name

(async () => {
  try {
    // check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;
    
    const exists = buckets.some((b) => b.name === BUCKET);
    if (exists) {
      console.log(`Bucket "${BUCKET}" already exists.`);
      process.exit(0);
    }

    // create bucket
    const { data, error } = await supabase.storage.createBucket(BUCKET, { public: false });
    if (error) throw error;
    console.log('Bucket created:', data);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();