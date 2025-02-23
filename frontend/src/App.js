import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar"; 
import {
  HashRouter as Router, 
  Routes, 
  Route,
} from "react-router-dom";

import Auth from "./views/auth.js"
import Home from "./views/home.js";
import Expenses from "./views/expense.js"; //this one
import Incomes from "./views/income.js"; //this one
import Settings from "./views/settings.js";
import ReceiptProcessor from "./views/receipt-processor.js";
import supabase from "./supabase-client.js";

function App() {

  const [session, setSession] = useState(null)

    useEffect (() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        }) 

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])


  const maincontentStyle = {
    marginLeft: '200px',
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#fff',
    position: 'relative'
  };

  return (
    <div>
      { !session ? (
        <Auth />
      ) : (
        <Router basename="/ABET">
          <Sidebar />
          <div style={maincontentStyle}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/incomes" element={<Incomes />} /> 
              <Route path="/receipt-processor" element={<ReceiptProcessor />} />
              <Route path="/insights" element={<Settings />} />
            </Routes>
          </div>
        </Router>
      )}
    </div>
  );

}

export default App;
