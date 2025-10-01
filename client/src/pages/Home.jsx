import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import AuthContext from "../contexts/AuthContext";

function Home() {

  const { isLoggedIn, loggedInUser, logout } = useContext(AuthContext)
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault()
    logout()
  }

  return (
    <>
    <section>
      <h1>Welcome Home</h1>
      <h2>{loggedInUser?.name || 'please log in'}</h2>
      <h3><button type='button' onClick={() => navigate("/users")}>Users</button></h3>
      <h3><button type='button' onClick={() => navigate("/tracks")}>Tracks</button></h3>
      {isLoggedIn ? <h3><button type='submit' onClick={onSubmit}>  Logout </button></h3> : ''}
    </section>
    </>
  )
}

export default Home