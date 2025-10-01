import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../components/UserList";
import AuthContext from "../contexts/AuthContext";

function UserPage() {
  const { isLoggedIn } = useContext(AuthContext)

  const navigate = useNavigate()

  useEffect(() => {
    if(isLoggedIn) {
      console.log('You are logged in')
    } else {
      navigate('/users/login')
    }
  },[isLoggedIn])

  return (
    <section>
      <h1>User Page</h1>
      <UserList />
    </section>
  )
}

export default UserPage