import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import UserProvider from "./providers/UserProvider"; 
import { TrackProvider } from "./providers/TrackProvider";
import AuthProvider from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <TrackProvider>
          <header><NavBar /></header>
          <main><Outlet /></main>
        </TrackProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;