import {useEffect, useState} from 'react'; 
import supabase from "../supabase-client";

function Users() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  useEffect(() => {
    getUsers(); 
  }, []);

  async function getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      console.log('data:', data); // Debug log
      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  const addUser = async (e) => {
    e.preventDefault();
    try {
      if (!newUserName || !newUserEmail) {
        alert('Please fill in all fields');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          name: newUserName, 
          email: newUserEmail 
        }]);
      
      if (error) throw error;

      // Refresh the users list
      getUsers(data || []);
      
      // Clear form
      setNewUserName('');
      setNewUserEmail('');
      
    } catch (error) {
      console.error('Error adding user:', error.message);
      alert('Error adding user');
    }
  }

  return (
    <div>
      <div>
        <h1>Users</h1>
      </div>
      <div>
        <h2>Add User</h2>
        <form onSubmit={addUser}>
          <label>
            Name:
            <input 
              type="text" 
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input 
              type="text" 
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
          </label>
          <input type="submit" value="Submit"/>
        </form>
      </div>
      <div>
        <h2>Users List</h2>
        <ul>
          {users.length === 0 ? (
            <li>No users found</li>
          ) : (
            users.map((user, index) => (
              <li key={index}>{user.name} - {user.email}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Users;
