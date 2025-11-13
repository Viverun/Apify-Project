const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rubxxcptjfslfzqtubtr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Ynh4Y3B0amZzbGZ6cXR1YnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NTQ2ODEsImV4cCI6MjA3ODIzMDY4MX0.XX0BuXNJkzrgCQLrLbEsa75LCa5MRkQcF6Xjn_EBKD8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getUserInfo() {
  try {
    console.log('🔍 Fetching user sign-in information from Supabase...\n');

    // Query auth.users table (requires service role key, so this might not work with anon key)
    // Instead, let's check if there's a profiles or users table
    
    // Try to list tables first
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name');
    
    if (tablesError) {
      console.log('ℹ️ Cannot list tables with anon key (expected)');
      console.log('ℹ️ You need to access Supabase Dashboard for full user auth data\n');
      console.log('📊 Supabase Dashboard URL:');
      console.log('   https://supabase.com/dashboard/project/rubxxcptjfslfzqtubtr/auth/users\n');
      console.log('🔐 To get user data programmatically, you need:');
      console.log('   1. Service Role Key (found in Project Settings > API)');
      console.log('   2. Create a custom table to store user metadata');
      console.log('   3. Use Supabase Dashboard to view auth.users table\n');
      return;
    }

    console.log('Available tables:', tables);

    // Try to query profiles table if it exists
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.log('⚠️ No profiles table found');
    } else {
      console.log('👥 User Profiles:', profiles.length);
      profiles.forEach((profile, i) => {
        console.log(`\nUser ${i + 1}:`);
        console.log(JSON.stringify(profile, null, 2));
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getUserInfo();
