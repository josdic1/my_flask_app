import { useState, useEffect } from "react"
import AuthContext from "../contexts/AuthContext"

function AuthProvider({ children }) {
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState(null);


    useEffect(() => {
        const access_token = localStorage.getItem("access_token")
        const user = localStorage.getItem("user")
        if (access_token && user) {
            setIsLoggedIn(true)
            setLoggedInUser(JSON.parse(user))
        }
    },[])

    const login = (user, access_token) => {
        localStorage.setItem("access_token", access_token)
        localStorage.setItem("user", JSON.stringify(user))
        setIsLoggedIn(true)
        setLoggedInUser(user)
    }

    const logout = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        setIsLoggedIn(false)
        setLoggedInUser(null)
    }

return (
<>
<AuthContext.Provider
    value={{ isLoggedIn, loggedInUser, login, logout }}
>
    {children}
</AuthContext.Provider>
</>
)}

export default AuthProvider
