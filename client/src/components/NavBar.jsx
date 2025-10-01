import { NavLink } from "react-router-dom"

function NavBar() {

return (
<>
<nav>
<NavLink to='/'> Home </NavLink>
<NavLink to='tracks'> Tracks </NavLink>
<NavLink to='users'> Users </NavLink>

</nav>
</>
)}

export default NavBar
