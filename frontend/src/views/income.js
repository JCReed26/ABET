import { useState, useEffect } from 'react';
import supabase from '../supabase-client';
import '../styles/income.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons'

function Incomes() {

  const [income_data, setIncomeData] = useState([]);

  const [IsCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false);
  const [create_data, setCreateData] = useState({
    id: null,
    name: '', 
    amount: '',
    type: ''
  });

  const [IsUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState(false);
  const [update_data, setUpdateData] = useState({
    id: null,
    name: '', 
    amount: '',
    type: ''
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date()); 
  const [resetDay, setResetDay] = useState(1);

  const filterIncomeByMonth = () => {
    return income_data.filter(income => {
      const incomeData = new Date(income.created_at);
      const incomeMonth = new Date(incomeData.getFullYear(), incomeData.getMonth(), incomeData.getDate());

      const cycleStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), resetDay);
      const cycleEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, resetDay - 1);

      return incomeMonth >= cycleStart && incomeMonth <= cycleEnd;
    })
  }

  const gotoNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate); 
  };

  const goToPrevMonth = () => {
    const newDate = new Date(selectedMonth); 
    newDate.setMonth(newDate.getMonth() - 1); 
    setSelectedMonth(newDate); 
  };

  const initializeDate = (resetDay) => {
    const today = new Date(); 
    const userDay = new Date(today.getFullYear(), today.getMonth(), resetDay);
    setSelectedMonth(userDay)
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
        initializeDate(data.reset_day);
      }

    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getResetDay();
  }, []);



  //read functionality 
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
  
  const handleSubmitClick = () => {
    setCreateData({
      name: '',
      amount: '',
      type: ''
    });
    setIsCreatePopUpOpen(true);
  }

  //create functionality 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!create_data.name || !create_data.amount || !create_data.type) {
        alert('Please fill out all fields');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase 
        .from('income')
        .insert([{
          name: create_data.name,
          amount: create_data.amount, 
          type: create_data.type,
          user_id: user.id
        }]);
      
      if (error) throw error; 

      //refresh 
      getIncome();

      //clear form 
      setIsCreatePopUpOpen(false);
      setCreateData({
        name: '',
        amount: '',
        type: ''
      });

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error adding income');
    }
  }

  //delete functionality 
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

  //update functionalities 
  const handleUpdateClick = (data) => {
    setUpdateData({
      id: data.id,
      name: data.name, 
      amount: data.amount, 
      type: data.type
    });
    setIsUpdatePopUpOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const {error} = await supabase 
        .from('income')
        .update({
          name: update_data.name,
          amount: update_data.amount,
          type: update_data.type
        })
        .eq('id', update_data.id);

      if (error) throw error; 

      setIsUpdatePopUpOpen(false);
      getIncome();
    } catch (error) {
      console.error('Error:', error.message);
      alert('error updating item');
    }
  };


  return (
    <div>
      <div className='header'>
        <h1>Incomes</h1>
        <div className='month-navigation'>
          <button onClick={goToPrevMonth}>Previous</button>
          <span style={{ fontSize: '1.2 rem' }}>
            {selectedMonth.toDateString('en-US', { month: 'long', year: 'numeric'})} - {new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, resetDay - 1).toDateString('en-US', { month: 'long', year: 'numeric'})}
          </span>
          <button onClick={gotoNextMonth}>Next</button>
        </div>
      </div>
      <div>
          <h2>Income Data</h2>
          <ul>
            {income_data.length === 0 ? (
              <li>No income data</li>
            ) : (
              filterIncomeByMonth().map((data, index) => (
                <li key={index}>
                  {new Date(data.created_at).toLocaleDateString()} - {data.type} - {data.name} - ${data.amount}
                  <div className='action-button'>
                    <button className='icon-button edit-button' onClick={() => handleUpdateClick(data)}>
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
          <button className='add-income-button' onClick={handleSubmitClick}>
            <span>Add New Income</span>
            <FontAwesomeIcon icon={faPlus} />
          </button>
      </div>

      <div>
        {IsCreatePopUpOpen && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Add Income</h2>
              <form onSubmit={handleSubmit}>
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
                  Type:
                  <input
                    type="text"
                    value={create_data.type}
                    onChange={(e) => setCreateData({...create_data, type: e.target.value})}
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
        <div className="popup-overlay">
          <div className="popup">
            <h2>Update Income</h2>
            <form onSubmit={handleUpdate}>
              <label>
                Name:
                <input
                  type="text"
                  value={update_data.name}
                  onChange={(e) => setUpdateData({...update_data, name: e.target.value})}
                />
              </label>
              <label>
                Amount:
                <input
                  type="text"
                  value={update_data.amount}
                  onChange={(e) => setUpdateData({...update_data, amount: e.target.value})}
                />
              </label>
              <label>
                Type:
                <input
                  type="text"
                  value={update_data.type}
                  onChange={(e) => setUpdateData({...update_data, type: e.target.value})}
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

export default Incomes;