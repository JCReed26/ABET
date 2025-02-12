import React from "react"; 
import { Link } from "react-router-dom";

function Sidebar() {
    const sidebarStyle = {
      width: '200px',
      background: '#f8f9fa',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      padding: '20px',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
    };

    const linkStyle = {
        display: 'block',
        padding: '10px',
        color: '#333',
        textDecoration: 'none',
        margin: '5px 0',
        borderRadius: '5px',
      };
    
      return (
        <div style={sidebarStyle}>
          <h2 style={{ marginBottom: '20px' }}>Navigation</h2>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/users" style={linkStyle}>Users</Link>
          <Link to="/expenses" style={linkStyle}>Expenses</Link>
          <Link to="/incomes" style={linkStyle}>Incomes</Link>
          <Link to="/insights" style={linkStyle}>Insights</Link>
        </div>
      );
}

export default Sidebar;