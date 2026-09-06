/**
 * إعدادات Supabase العامة.
 * الرابط والمفتاح العام (anon) ليسا سرّيين — يظهران في المتصفّح دائماً،
 * وحمايتهما تأتي من سياسات RLS لا من إخفائهما.
 * المفتاح السرّي service_role يبقى في متغيّر بيئة على الخادم فقط.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vpinaehjfflnrlpfxlko.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwaW5hZWhqZmZsbnJscGZ4bGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjA0NDgsImV4cCI6MjEwNDE5NjQ0OH0.gDc6IwqVzOuay0AveZG9nDQzbMHBq5fsLg9Ri4FP7yw';
