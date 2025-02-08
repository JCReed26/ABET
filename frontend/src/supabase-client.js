import { createClient } from '@supabase/supabase-js'

const supabaseURL = "https://biwblmeoezcyzuvvpqbb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpd2JsbWVvZXpjeXp1dnZwcWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NjY5ODIsImV4cCI6MjA1NDU0Mjk4Mn0.XfWepnggEljKGJry0virQioU9C10dyomTwQDuMyk07Q";


const supabase = createClient(supabaseURL, supabaseKey);

export default supabase;
            