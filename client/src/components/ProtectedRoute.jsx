import AuthContext from "../contexts/AuthContext"
import LoginPage from "../pages/LoginPage"
import { useContext } from "react"

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext)
  return (
    <>
      <header></header>
      <main>
        {isLoggedIn ? children : <LoginPage />}
      </main>
    </>
  )
}

export default ProtectedRoute