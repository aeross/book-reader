import { useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import agent from './API/axios';
import { APIResponse, User } from './API/types';
import Nav from './components/Nav';
import { useAppDispatch } from './store/configureStore';
import { setUser } from './store/userSlice';

function App() {
    const dispatch = useAppDispatch();

    async function fetchCurrentUser() {
        try {
            const res = await agent.get<APIResponse<User>>("user", {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            const data = res.data.data;
            dispatch(setUser(data));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCurrentUser();
    }, [dispatch])

    return (
        <>
            <Nav />

            <Outlet />
        </>
    )
}

export default App
