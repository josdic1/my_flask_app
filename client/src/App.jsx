import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import UserProvider from "./providers/UserProvider"; 
import TrackProvider from "./providers/TrackProvider";
import TrackLinkProvider from "./providers/TrackLinkProvider";
import AuthProvider from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <TrackProvider>
          <TrackLinkProvider>
            <header><NavBar /></header>
            <main><Outlet /></main>
          </TrackLinkProvider>
        </TrackProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;