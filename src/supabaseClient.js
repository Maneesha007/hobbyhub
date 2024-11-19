
import { createClient } from '@supabase/supabase-js';

const URL = 'https://ahysvzqtimjrezfeagge.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoeXN2enF0aW1qcmV6ZmVhZ2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5ODIxODQsImV4cCI6MjA0NzU1ODE4NH0.YFqThftfsjEi8wVOJ2ceH_X_jGbPBqE7YiJmhZeAS2M';
export const supabase = createClient(URL, API_KEY);
