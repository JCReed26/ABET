import { useState, useEffect } from 'react';
import supabase from '../supabase-client';
import '../styles/home.css'
import { PieChart } from '@mui/x-charts/PieChart';


function Home() {

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]); 

  const [selectedMonth, setSelectedMonth] = useState(new Date()); 
  const [resetDay, setResetDay] = useState(1);

  useEffect(() => {
    getExpenses(); 
  }, []);

  async function getExpenses() {
    try {
      const { data, error } = await supabase 
        .from('expenses')
        .select('*');

      if (error) throw error; 

      console.log('data:', data); 
      //data else empty
      setExpenses(data || []);
    } catch (error) {
      console.error('Error: ', error.message);
    }
  };

  useEffect(() => {
    getIncome(); 
  }, []);

  async function getIncome() {
    try {
      const { data, error } = await supabase 
        .from('income')
        .select('*');

      if (error) throw error; 

      console.log('Data:', data);
      setIncome(data || []);
    } catch (error) {
      console.error('Error: ', error.message); 
    }
  }

  const calcExpenses = () => {
    return filterExpensesByMonth().reduce((sum, expenses) => sum + expenses.amount, 0);
  }

  const calcIncome = () => {
    return filterIncomeByMonth().reduce((sum, income) => sum + income.amount, 0);
  }

  const calcBudget = () => {
    return calcIncome() - calcExpenses();
  }

  const getExpenseByCat = () => {
    const categories = {};
    filterExpensesByMonth().forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });

    return Object.entries(categories).map(([category, amount]) => ({
      id: category,
      value: amount,
      label: category
    }));
  };

  const getIncomeStreams = () => {
    const streams = {}; 
    filterIncomeByMonth().forEach(income => {
      if (!streams[income.type]) {
        streams[income.type] = 0;
      }
      streams[income.type] += income.amount;
    });
    return streams;
  }

  const filterIncomeByMonth = () => {
    return income.filter(inc => {
      const incomeData = new Date(inc.created_at); 
      const incomeMonth = new Date(incomeData.getFullYear(), incomeData.getMonth(), incomeData.getDate());

      const cycleStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), resetDay);
      const cycleEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, resetDay - 1); 

      return incomeMonth >= cycleStart && incomeMonth <= cycleEnd;
    })
  }

  const filterExpensesByMonth = () => {
    return expenses.filter(expense => {
      const expenseData = new Date(expense.created_at); 
      const expenseMonth = new Date(expenseData.getFullYear(), expenseData.getMonth(), expenseData.getDate());

      const cycleStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), resetDay); 
      const cycleEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, resetDay - 1); 

      return expenseMonth >= cycleStart && expenseMonth <= cycleEnd;
    })
  }

  const gotoNextMonth = () => {
    const newDate = new Date(selectedMonth); 
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate);
  }

  const gotoPrevMonth = () => {
    const newDate = new Date(selectedMonth); 
    newDate.setMonth(newDate.getMonth() - 1); 
    setSelectedMonth(newDate);
  }

  const initializeDate = (resetDay) => {
    const today = new Date(); 
    const userDay = new Date(today.getFullYear(), today.getMonth(), resetDay); 
    setSelectedMonth(userDay)    
  }

  const getResetDay = async () => {
    try {
      const { data: { user }} = await supabase.auth.getUser(); 
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




  return (
    <div>
        <div className="home-container">
        <h1 className="home-title">Financial Dashboard</h1>
        
        <div className='month-navigation'>
          <button onClick={gotoPrevMonth}>Previous</button>
          <span style={{ fontSize: '1.2 rem' }}>
            {selectedMonth.toDateString('en-US', { month: 'long', year: 'numeric' })} - {new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, resetDay - 1).toDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={gotoNextMonth}>Next</button>
        </div>



        <div className="dashboard-content">
          <div className="summary-section">
            <div className="budget-overview">
              <div className="total-budget">
                <span>{calcBudget() >= 0 ? "+$" : "-$"}{calcBudget()}</span>
              </div>
              <div className="income-breakdown">
                <h3>Income Streams</h3>
                <div className="breakdown-list">
                    {
                      Object.entries(getIncomeStreams()).map(([type, amount]) => (
                        <div key={type} className="breakdown-item">
                          <span className="breakdown-category">{type}:</span>
                          <span className="breakdown-amount income">${amount.toFixed(2)}</span>
                        </div>
                      ))
                    }
                </div>
              </div>
              <div className="chart-container">
                <h3>Expense Visualizer</h3>
                <PieChart
                  series={[
                    {
                      data: getExpenseByCat(),
                      innerRadius: 86,
                      outerRadius: 96,
                      paddingAngle: 0,
                      cornerRadius: 15,
                      startAngle: -360,
                      endAngle: 360,
                      cx: 130,
                      cy: 115,
                    }
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="transactions-container">
            <div className="transactions-column">
              <div className="column-header">
                <h2>Recent Expenses</h2>
                <span className='total-amount expense'>
                  Total: -${calcExpenses().toFixed(2)}
                </span>
              </div>
              <div className="transactions-list">
                {filterExpensesByMonth().map((expenses) => (
                  <div key={expenses.id} className="transaction-item">
                    <span className="transaction-description">{expenses.category}</span>
                    <span className="transaction-amount expense">-${expenses.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="transactions-column">
              <div className='column-header'>
                <h2>Recent Income</h2>
                <span className='total-amount income'>
                  Total: +${calcIncome().toFixed(2)}
                </span>
              </div>
              <div className="transactions-list">
                {filterIncomeByMonth().map((income) => (
                  <div key={income.id} className="transaction-item">
                    <span className="transaction-description">{income.type}</span>
                    <span className="transaction-amount income">+${income.amount}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>


    </div>
  );
}

export default Home;