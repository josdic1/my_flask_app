import AuthContext from "../contexts/AuthContext"
import LoginPage from "../pages/LoginPage"
import Home from "../pages/Home"
import { useContext } from "react"

function ProtectedRoute() {
    const { isLoggedIn } = useContext(AuthContext)
return (
<>
<header></header>
<main>
{ isLoggedIn ? <Home /> : <LoginPage /> }
</main>
</>
)}

export default ProtectedRoute
