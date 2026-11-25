import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jvlsfyaesxtdtpjfpnrs.supabase.co";

// 👉 TEMPELKAN KUNCI BARU YANG DIAWALI 'eyJ...' DI SINI 👈
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bHNmeWFlc3h0ZHRwamZwbnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3OTc4MTcsImV4cCI6MjEwOTM3MzgxN30.5W-jbdAaMntnIM6Zy7ah41GYW4qCHbLCQDjf1t35mFY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);