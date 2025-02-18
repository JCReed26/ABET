import { useState, useEffect } from 'react';
import supabase from '../supabase-client';
import '../styles/income.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt, faPlus, faMoneyBills } from '@fortawesome/free-solid-svg-icons'

function Expenses() {

  const [expenses, setExpenses] = useState([]);

  const [IsCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false); 
  const [create_data, setCreateData] = useState({
    id: null,
    name: '',
    amount: 0.0, 
    category: ''
  });

  const [IsUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState(false); 
  const [update_data, setUpdateData] = useState({
    id: null,
    name: '',
    amount: 0.0, 
    category: ''
  });


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

  const handleNewExpense = async (e) => {
    e.preventDefault();
    try {
      if (!create_data.name || !create_data.amount || !create_data.type) {
        alert('Please fill out all fields');
        return;
      }

      const { error } = await supabase 
        .from('expenses')
        .insert([{
          name: create_data.name,
          amount: create_data.amount, 
          type: create_data.type
        }]);
      
      if (error) throw error; 

      //refresh 
      getIncome();

      //clear form 
      setIsCreatePopUpOpen(false);
      setCreateData({
        name: '',
        amount: 0.0,
        category: ''
      });

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error adding expense');
    }
  };

  const handleNewExpClick = (data) => {
    setCreateData({
      name: '',
      amount: 0.0, 
      category: ''
    });
    setIsCreatePopUpOpen(true)
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    try {
      const {error} = await supabase 
        .from('expenses')
        .update({
          name: update_data.name,
          amount: update_data.amount,
          category: update_data.category
        })
        .eq('id', update_data.id);

      if (error) throw error; 
      getExpenses();
      setIsUpdatePopUpOpen(false);
      
    } catch (error) {
      console.error('Error:', error.message);
      alert('error updating item');
    }
  };

  const handleUpdateClick = (data) => {
    setUpdateData({
      id: data.id,
      name: data.name || '',
      amount: data.amount || 0.0, 
      category: data.category || ''
    });
    setIsUpdatePopUpOpen(true);
  }; 


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
                    <button className='icon-button edit-button' onClick={handleUpdateExpense}>
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
        <button className='add-income-button' onClick={handleNewExpense}>
          <span>Add New Expense</span>
          <FontAwesomeIcon icon={faPlus} /> 
        </button>
      </div>

        




    </div>
);
}

export default Expenses;