import 'dotenv/config';

export default {
  expo: {
    name: "the-knowledge-cache",
    slug: "the-knowledge-cache",
    version: "1.0.0",
    extra: {
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_STORAGE_URL: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL
    },
    eas: {
      projectId: '57df02ae-0159-4a62-9cd0-51a0e5e02d38',
    },
    "android": {
      "package": "com.apaaja.theknowledgecache"
    }
  },
};
