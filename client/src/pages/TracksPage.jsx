import { useContext } from "react";
import TrackFormNew from "../components/TrackFormNew";
import TrackList from "../components/TrackList";
import AuthContext from "../contexts/AuthContext";


function TracksPage() {
  const { loggedInUser, isLoggedIn } = useContext(AuthContext)




  return (
    <>
    <header>
      {isLoggedIn ? `${loggedInUser.name} is logged in` : <p><a href="/users/login">Login</a></p> }
    </header>
    <main>
    <section>
      <h1>Track Page</h1>
      <TrackFormNew />
      <TrackList />
    </section>
    </main>
    </>
  )
}

export default TracksPage