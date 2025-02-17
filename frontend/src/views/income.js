import { useState, useEffect } from 'react';
import supabase from '../supabase-client';
import '../styles/income.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

function Incomes() {

  const [income_data, setIncomeData] = useState([]);
  const [income_name, setIncomeName] = useState(''); 
  const [income_amount, setIncomeAmount] = useState('0');
  const [income_type, setIncomeType] = useState('');
  
  useEffect(() => {
    getIncome();
  }, []);
  
  async function getIncome() {
    try {
      const { data, error } = await supabase
        .from('income')
        .select('*');
      
      if (error) throw error; 
  
      console.log('data:', data); 
      setIncomeData(data || []);
    } catch (error) {
      console.error('Error:', error.message); 
    }
  }
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!income_name || !income_amount || !income_type) {
        alert('Please fill out all fields');
        return;
      }

      const { data, error } = await supabase 
        .from('income')
        .insert([{
          name: income_name,
          amount: income_amount, 
          type: income_type
        }]);
      
      if (error) throw error; 

      //refresh 
      getIncome(data || []);

      //clear form 
      setIncomeName('');
      setIncomeAmount('');
      setIncomeType(''); 

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error adding income');
    }
  }

  const handleDelete = async (id) => {
    try {
      const { data, error } = await supabase 
        .from('income')
        .delete()
        .eq('id', id);

      if (error) throw error; 

      getIncome(data || []);

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error deleting income');
    }
  }



  return (
    <div>
        <div>
          <h1>Incomes</h1>
          <form onSubmit={handleSubmit}>
            <label> 
              Name: 
              <input 
                type='text'
                value={income_name}
                onChange={(e) => setIncomeName(e.target.value)}
              />
            </label>
            <label> 
              Amount: 
              <input 
                type='text'
                value={income_amount}
                onChange={(e) => setIncomeAmount(e.target.value)}
              />
            </label>
            <label> 
              Type: 
              <input 
                type='text'
                value={income_type}
                onChange={(e) => setIncomeType(e.target.value)}
              />
            </label>
            <input type='submit' value="Submit" />
          </form>
        </div>
        <div>
          <h2>Income Data</h2>
          <ul>
            {income_data.length === 0 ? (
              <li>No income data</li>
            ) : (
              income_data.map((data, index) => (
                <li key={index}>
                  {data.type} - {data.name} - ${data.amount}
                  <div className='action-button'>
                    <button className='icon-button edit-button'>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button className='icon-button delete-button' onClick={() => handleDelete(data.id)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
    </div>
  );
}

export default Incomes;