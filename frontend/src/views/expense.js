import { useState, useEffect } from 'react';
import supabase from '../supabase-client';
import '../styles/income.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt, faPlus, faMoneyBills } from '@fortawesome/free-solid-svg-icons'

function Expenses() {

  const [expenses, setExpenses] = useState([]);


  useEffect(() => {
    getExpenses();
  }, []);

  async function getExpenses() {
    try {
      const { data, error } = await supabase 
        .from('expenses')
        .select('*');

      if (error) throw error; 

      console.log('data:', data)
      setExpenses(data || []); 
    } catch (error) {
      console.error('Error:', error.message); 
    }
  }

  const handleDelete = async (id) => {
    try {

      const { data, error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      getExpenses(data || []);

    } catch (error) {
      console.error('error deleting expenses', error.message);
      alert('error deleting data')
    }
  }


  return (
    <div>
      <div>
        <h1>Expenses</h1>
      </div>
      <div>
        <h2>Expense Data</h2>
        <ul>
          {
            expenses.length === 0 ? (
              <li>No income data</li>
            ) : (
              expenses.map((data, index) => (
                <li key={index}>
                  <span><FontAwesomeIcon icon={faMoneyBills}/> {index} - {data.name} - ${data.amount} - {data.category}</span>
                  <div className='action-button'>
                    <button className='icon-button edit-button'>
                      <FontAwesomeIcon icon={faPencilAlt}/>
                    </button>
                    <button className='icon-button delete-button' onClick={() => handleDelete(data.id)}>
                      <FontAwesomeIcon icon={faTrashAlt}/>
                    </button>
                  </div>
                </li>
              ))
            )
          }
        </ul>
        <button className='add-income-button'>
          <span>Add New Expense</span>
          <FontAwesomeIcon icon={faPlus} /> 
        </button>
      </div>
    </div>
);
}

export default Expenses;