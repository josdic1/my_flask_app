import { useState, useEffect } from "react"
import UserContext from "../contexts/UserContext";
import api from "../api";

function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/users");
      setUsers(data || []);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addUser(userData) {
    setError(null);
    try {
      const { data } = await api.post("/users", userData);
      setUsers(prev => [...prev, data]);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  }

  async function updateUser(id, updatedFields) {
    setError(null);
    try {
      const { data } = await api.patch(`/users/${id}`, updatedFields);
      setUsers(prev => prev.map(u => u.id === id ? data : u));
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  }

  async function deleteUser(id) {
    setError(null);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  }

  return (
    <UserContext.Provider value={{
      users, loading, error,
      fetchUsers, addUser, updateUser, deleteUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;