import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oasssivozhwlsqdoaydc.supabase.co';
// Frontend'de SADECE anon key kullanın - service_role key ASLA kullanmayın!
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc3NzaXZvemh3bHNxZG9heWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzM1MzMsImV4cCI6MjA2OTM0OTUzM30.fLYnM0-k-RjRG1TjEvTW3lyYA9KojsOIaBj81YG_vxQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin operasyonlar için ayrı client OLUŞTURMAYIN!
// Admin işlemler backend API üzerinden yapılmalı