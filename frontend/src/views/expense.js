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

  const handleNewExpClick = () => {
    setCreateData({
      name: '',
      amount: 0.0, 
      category: ''
    });
    setIsCreatePopUpOpen(true);
  };

  const handleNewExpense = async (e) => {
    e.preventDefault();
    try {
      if (!create_data.name || !create_data.amount || !create_data.category) {
        alert('Please fill out all fields');
        return;
      }

      const { error } = await supabase 
        .from('expenses')
        .insert([{
          name: create_data.name,
          amount: create_data.amount, 
          category: create_data.category
        }]);
      
      if (error) throw error; 

      //refresh 
      getExpenses();

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

  const handleUpdateClick = (data) => {
    setUpdateData({
      id: data.id,
      name: data.name || '',
      amount: data.amount || 0.0, 
      category: data.category || ''
    });
    setIsUpdatePopUpOpen(true);
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
      
      setIsUpdatePopUpOpen(false);
      getExpenses();
    } catch (error) {
      console.error('Error:', error.message);
      alert('error updating item');
    }
  };

//start html

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
                    <button className='icon-button edit-button' onClick={() => handleUpdateClick(data)}>
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
        <button className='add-income-button' onClick={handleNewExpClick}>
          <span>Add New Expense</span>
          <FontAwesomeIcon icon={faPlus} /> 
        </button>
      </div>

      <div>
        {IsCreatePopUpOpen && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Add Expense</h2>
              <form onSubmit={handleNewExpense}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={create_data.name}
                    onChange={(e) => setCreateData({...create_data, name: e.target.value})}
                  />
                </label>
                <label>
                  Amount:
                  <input
                    type="text"
                    value={create_data.amount}
                    onChange={(e) => setCreateData({...create_data, amount: e.target.value})}
                  />
                </label>
                <label>
                  Category:
                  <input
                    type="text"
                    value={create_data.category}
                    onChange={(e) => setCreateData({...create_data, category: e.target.value})}
                  />
                </label>
                <div className="popup-buttons">
                  <button type="submit">Add</button>
                  <button type="button" onClick={() => setIsCreatePopUpOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div>
        {IsUpdatePopUpOpen && (
          <div className='popup-overlay'>
            <div className='popup'>
              <form onSubmit={handleUpdateExpense}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={update_data.name}
                    onChange={(e) => setUpdateData({...update_data, name: e.target.value})}
                  />
                </label>
                <label>
                  Amount: $
                  <input
                    type="text"
                    value={update_data.amount}
                    onChange={(e) => setUpdateData({...update_data, amount: e.target.value})}
                  />
                </label>
                <label>
                  category:
                  <input
                    type="text"
                    value={update_data.category}
                    onChange={(e) => setUpdateData({...update_data, category: e.target.value})}
                  />
                </label>
                <div className="popup-buttons">
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setIsUpdatePopUpOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>


    </div>
);
}

export default Expenses;