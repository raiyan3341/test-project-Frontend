import { createBrowserRouter } from "react-router";
import Root from '../pages/Root/Root';


import ErrorPage from '../pages/ErrorPage/ErrorPage';
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Lobbies from "../pages/Lobbies";

// Protthom e ekta simple password check kora jay


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
        { path: "/", element: <Home /> },
        { 
            path: "/admin", 
            element: <Admin />
        },
        {
    path: "/lobbies",
    element: <Lobbies /> // Oboshshoi Lobbies page-ta import kora thakte hobe
}
    ]
  },
]);