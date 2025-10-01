import App from "./App"
import Error from "./pages/Error"
import LoginPage from "./pages/LoginPage"
import Track from "./pages/Track"
import TracksPage from "./pages/TracksPage"
import TrackFormNew from "./components/TrackFormNew"
import TrackFormEdit from "./components/TrackFormEdit"
import UsersPage from "./pages/UsersPage"
import ProtectedRoute from "./components/ProtectedRoute"


const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,            
        element: <ProtectedRoute />
      },
      {
        path: "/users/login",
        element: <LoginPage />
      },
            {
        path: "/users",
        element: <UsersPage />
      },
      {
        path: "error",
        element: <Error />
      },
            {
        path: "tracks",
        element: <TracksPage />
      },
                 {
        path: "/tracks/:id",
        element: <Track />
      },
           {
        path: "/tracks/new",
        element: <TrackFormNew />
      },
      {
        path: "/tracks/:id/edit",
        element: <TrackFormEdit />
      }
    ]
  }
]

export default routes