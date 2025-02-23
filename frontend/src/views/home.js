import { useState, useEffect } from 'react';
import supabase from '../supabase-client';
import '../styles/home.css'


function Home() {

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]); 

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

  function calculateWomenSalary(base) {
    return base * 0.8;
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
    return expenses.reduce((sum, expenses) => sum + expenses.amount, 0);
  }

  const calcIncome = () => {
    return income.reduce((sum, income) => sum + income.amount, 0);
  }

  const calcBudget = () => {
    return calcIncome() - calcExpenses();
  }

  const getIncomeStreams = () => {
    const streams = {}; 
    income.forEach(income => {
      if (!streams[income.type]) {
        streams[income.type] = 0;
      }
      streams[income.type] += income.amount;
    });
    return streams;
  }

  return (
    <div>
      <div>
        <h1>Home</h1>
      </div>
      <div className="home-container">
        <h1 className="home-title">Financial Dashboard</h1>
        
        <div className="dashboard-content">
          <div className="summary-section">
            <div className="budget-overview">
              <div className="total-budget">
                <span>{calcBudget() >= 0 ? "+$" : "-$"}{calcBudget()}</span>
              </div>
              <div className="income-breakdown">
                Income Streams
                <span>
                  {
                    Object.entries(getIncomeStreams()).map(([type, amount]) => {
                      <div key={type}>
                        <span>{type}: ${amount}</span>
                      </div>
                    })
                  }
                </span>
              </div>
              <div className="chart-container">

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
                {expenses.map((expenses) => (
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
                {income.map((income) => (
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