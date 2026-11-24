// Cloud sync settings (Supabase). Both values are designed to be public: the "anon" key only allows what
// the database's row-level security rules allow (each signed-in person can read/write only their own row).
// Leave them empty to turn sync off.
globalThis.PYMARKER_SYNC = {
  url: "",      // e.g. "https://abcdefghijklmno.supabase.co"
  anonKey: "",  // Project Settings → API → "anon public" key
};
