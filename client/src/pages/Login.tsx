import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import agent from "../API/axios";
import { APIResponse } from "../API/types";
import { AxiosError } from "axios";
import { useAppDispatch } from "../store/configureStore";
import { setUser } from "../store/userSlice";

function Login() {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [error400, setError400] = useState({
        status: false,
        message: ""
    });

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            const res = await agent.post<APIResponse<string>>("user/login", { username, password });

            const token = res.data.data;
            if (token) {
                localStorage.setItem("token", token);
                dispatch(setUser({ userLoaded: false }));
                navigate("/");
            }
        } catch (error) {
            console.log(error);

            let status = 500;
            if (error instanceof AxiosError) {
                if (error.response) {
                    status = error.response.status;

                    const res: APIResponse<string> = error.response.data;
                    if (status == 400) {
                        setError400({
                            status: true,
                            message: res.data ?? ""
                        });
                    }
                }

            }

        }
    }

    return (
        <>
            <form className="m-4 p-4 w-1/2 flex flex-col rounded-lg justify-center items-center border-2">
                <h1 className="text-3xl font-bold pb-2">Login</h1>

                {error400.status && <p className="text-red-600">{error400.message}</p>}

                <div className="m-4 px-6 grid grid-cols-4 gap-4">
                    <label htmlFor="Username">Username</label>
                    <input
                        type="text"
                        className="border-2 rounded col-span-3"
                        onChange={(event) => { setUsername(event.target.value) }}
                    />

                    <label htmlFor="Password">Password</label>
                    <input
                        type="password"
                        className="border-2 rounded col-span-3"
                        onChange={(event) => { setPassword(event.target.value) }}
                    />
                </div>

                <div className="w-full flex justify-between">
                    <div className="text-sm mt-auto">Don't have an account?
                        <Link to="/register"> Register</Link>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="border-2 rounded px-4 py-1"
                    >Submit</button>
                </div>
            </form>
        </>
    )
}

export default Login