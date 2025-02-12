import React from "react";
import Sidebar from "./components/sidebar"; 
import {
  BrowserRouter as Router, 
  Routes, 
  Route,
} from "react-router-dom";

import Home from "./views/home.js";
import Users from "./views/users.js";
import Expenses from "./views/expense.js"; //this one
import Incomes from "./views/income.js"; //this one
import Insights from "./views/insights.js";
import ReceiptProcessor from "./views/receipt-processor.js";

function App() {


  const maincontentStyle = {
    marginLeft: '200px',
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#fff',
    position: 'relative'
  };

  return (
    <Router>
      <Sidebar />
      <div style={maincontentStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/incomes" element={<Incomes />} /> 
          <Route path="/insights" element={<Insights />} />
          <Route path="/receipt-processor" element={<ReceiptProcessor />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App;
