import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import App from "../App";
import BookPage from "./BookPage";
import UserProfile from "./UserProfile";
import UserEdit from "./UserEdit";
import BookEdit from "./BookEdit";
import ChapterPage from "./ChapterPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '/user', element: <UserEdit /> },
            { path: '/user/:username', element: <UserProfile /> },
            { path: '/user/edit/:username', element: <UserEdit /> },
            { path: '/book/:id', element: <BookPage /> },
            { path: '/book/edit/:id', element: <BookEdit /> },
            { path: '/book/:bookId/chapter/:chapterId', element: <ChapterPage /> }
        ]
    },
])