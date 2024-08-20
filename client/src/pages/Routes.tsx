import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import App from "../App";
import BookPage from "./BookPage";
import UserProfile from "./UserProfile";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/user/:username',
                element: <UserProfile />
            },
            {
                path: '/book/:id',
                element: <BookPage />
            }
        ]
    },
])