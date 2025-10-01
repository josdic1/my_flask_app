import { useRouteError } from "react-router-dom"
import NavBar from "../components/NavBar"

function Error() {

    const error = useRouteError()

return (
<>
<header>
<NavBar />
</header>
<main>
    <h1>Error Message: {error.message}</h1>
    <h2>Error Status: {error.status}</h2>
</main>
</>
)}

export default Error
