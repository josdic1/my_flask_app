import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"
import api from "../api"

function LoginPage() {

const { isLoggedIn, login, logout } = useContext(AuthContext)
const [ formData, setFormData ] = useState({
    name: "",
    password: ""
})

const navigate = useNavigate()

const onFormChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};


 async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", formData);
      // ✅ Axios already parses JSON for you
      login(res.data.user, res.data.access_token);
      navigate('/')
    } catch (error) {
      console.error(
        "❌ Caught error:",
        error.response?.data || error.message
      );
    }
  }

return (
<>
    <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="User name..." onChange={onFormChange} value={formData.name} />
        <input type="password" name="password" placeholder="Password..." onChange={onFormChange} value={formData.password} />
        <button type='submit'> {isLoggedIn ? 'Logout' : 'Login'} </button>
    </form>
</>
)}

export default LoginPage
