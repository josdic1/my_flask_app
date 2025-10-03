import App from "./App"
import Error from "./pages/Error"
import LoginPage from "./pages/LoginPage"
import Home from "./pages/Home"
import Track from "./pages/Track"
import TracksPage from "./pages/TracksPage"
import TrackFormNew from "./components/TrackFormNew"
import TrackFormEdit from "./components/TrackFormEdit"
import TrackLinkFormNew from "./components/TrackLinkFormNew"
import TrackLinkFormEdit from "./components/TrackLinkFormEdit"
import TrackLinkList from "./components/TrackLinkList"
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
        element: <ProtectedRoute> <Home/> </ProtectedRoute>
      },
      {
        path: "/users/login",
        element: <LoginPage />
      },
      {
        path: "/users",
        element: <ProtectedRoute> <UsersPage /> </ProtectedRoute>
      },
      {
        path: "error",
        element: <Error />
      },
      {
        path: "tracks",
        element: <ProtectedRoute> <TracksPage /> </ProtectedRoute>
      },
      {
        path: "/tracks/:id",
        element: <ProtectedRoute> <Track /> </ProtectedRoute>
      },
      {
        path: "/tracks/new",
        element: <ProtectedRoute> <TrackFormNew /> </ProtectedRoute>
      },
      {
        path: "/tracks/:id/edit",
        element: <ProtectedRoute> <TrackFormEdit /> </ProtectedRoute>
      },
      {
  path: "track_links/new/:trackId",
  element: (
    <ProtectedRoute>
      <TrackLinkFormNew />
    </ProtectedRoute>
  ),
},
      {
        path: "/track_links/:id/edit",
        element: <ProtectedRoute> <TrackLinkFormEdit /> </ProtectedRoute>
      }
    ]
  }
]

export default routes