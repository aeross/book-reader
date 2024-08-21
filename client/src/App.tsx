import { useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import agent from './API/axios';
import { APIResponse, User } from './API/types';
import Nav from './components/Nav';
import { useAppDispatch, useAppSelector } from './store/configureStore';
import { setUser } from './store/userSlice';
import Loading from './components/Loading';

function App() {
    const { userLoaded } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    async function fetchCurrentUser() {
        try {
            // refresh axios instance's token
            agent.defaults.headers['Authorization'] = "Bearer " + localStorage.getItem("token");

            const res = await agent.get<APIResponse<User>>("user");
            const data = res.data.data;
            dispatch(setUser({ user: data, userLoaded: true }));
        } catch (error) {
            console.log(error);
            dispatch(setUser({ user: null, userLoaded: true }));
        }
    }

    useEffect(() => {
        if (!userLoaded) fetchCurrentUser();
    }, [userLoaded, dispatch])

    return (
        <>
            <Nav />

            {userLoaded && <Outlet />}
            {!userLoaded && <Loading message="Loading user..." />}
        </>
    )
}

export default App
