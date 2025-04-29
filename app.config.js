import 'dotenv/config';

export default {
  expo: {
    name: "your-app-name",
    slug: "your-app-name",
    version: "1.0.0",
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
