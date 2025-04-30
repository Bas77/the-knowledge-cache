import 'dotenv/config';

export default {
  
    
  
  
  expo: {
    name: "the-knowledge-cache",
    slug: "the-knowledge-cache",
    version: "1.0.0",
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      SUPABASE_STORAGE_URL: process.env.SUPABASE_STORAGE_URL
    },
    "android": {
      "package": "com.anonymous.theknowledgecache"
    }
  },
};
