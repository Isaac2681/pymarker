// Cloud sync settings (Supabase). Both values are designed to be public: the "anon" key only allows what
// the database's row-level security rules allow (each signed-in person can read/write only their own row).
// Leave them empty to turn sync off.
globalThis.PYMARKER_SYNC = {
  url: "https://bfneqcbklxjdpofzjhuf.supabase.co",
  anonKey: "sb_publishable_hTWj_IbTR_abVBhDiaO7iQ_ZyAEV3pF",  // publishable (public) key: Project Settings → API Keys
};
