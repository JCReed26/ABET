import { useState, useEffect } from 'react'
import supabase from '../supabase-client'
import '../styles/income.css'

function Settings() {

    const [resetDay, setResetDay] = useState(1);

    const saveResetDay = async (day) => {
        try {
          const { data: {user} } = await supabase.auth.getUser();
    
          const { error } = await supabase
            .from('user_settings')
            .update({ reset_day: day })
            .eq('user_id', user.id);
          
          if (error) throw error; 
    
        } catch (error) {
          console.error(error.message); 
        }
    }

    const getResetDay = async () => {
        try {
          const { data: {user} } = await supabase.auth.getUser(); 
          const { data, error } = await supabase
            .from('user_settings')
            .select('reset_day')
            .eq('user_id', user.id)
            .single();
    
          if (error) throw error;
    
          if (data?.reset_day) {
            setResetDay(data.reset_day);
          }
    
        } catch (error) {
          console.error(error.message);
        }
    }
    
    useEffect(() => {
        getResetDay();
    }, []);

    return (
        <div>
            <h1>Settings</h1>
            <label>
                Billing Cycle Reset Day: 
                <input 
                    type='number'
                    min='1'
                    max='28'
                    value={resetDay}
                    style={{ width: '50px', marginLeft: '0.5rem' }}
                    onChange={ (e) => {
                    const newDay = parseInt(e.target.value) || 1;
                    setResetDay(newDay);
                    saveResetDay(newDay);
                    }}
                />
            </label>
        </div>
    );
}

export default Settings;