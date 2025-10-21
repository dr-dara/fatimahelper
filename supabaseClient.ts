import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://fnlxdcaurxjumqzcyxeu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubHhkY2F1cnhqdW1xemN5eGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTM3MTMsImV4cCI6MjA3NjU2OTcxM30.5-iJE4z71JBGyK_GTm7BSv-Zw8eXNn-3AtYMckkKMMc'
);
