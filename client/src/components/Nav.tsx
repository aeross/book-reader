
import { faArrowRightToBracket, faBars, faSearch, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { setUser } from "../store/userSlice";


function Nav() {
    const navigate = useNavigate();

    const { user } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    async function handleLogout() {
        localStorage.removeItem("token");
        dispatch(setUser(null));
    }

    return (
        <>
            <nav className="sticky top-0 z-10 p-3 bg-orange-50 shadow flex justify-between">
                <div className="flex justify-start gap-6 px-5 pb-2">
                    <button className="flex items-center"><FontAwesomeIcon icon={faBars} className="text-3xl opacity-65" /></button>
                    <div>
                        <div className="text-4xl font-bold flex items-center hover:cursor-pointer" onClick={() => { navigate("/") }}>
                            <span className="text-yellow-500">B</span>
                            <span className="text-yellow-575">O</span>
                            <span className="text-yellow-625">O</span>
                            <span className="text-yellow-700">K</span>
                            <span className="text-yellow-500">R</span>
                            <span className="text-yellow-525">E</span>
                            <span className="text-yellow-575">A</span>
                            <span className="text-yellow-625">D</span>
                            <span className="text-yellow-650">E</span>
                            <span className="text-yellow-700">R</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-start relative w-[42%]">
                    <input type="text" className="rounded-2xl border border-slate-300 h-full w-full 
                    pr-3 pl-12 focus:outline-none focus:ring focus:ring-yellow-500" />
                    <button className="ml-3 absolute"><FontAwesomeIcon icon={faSearch} className="text-2xl opacity-70" /></button>
                </div>
                {user &&
                    <div className="flex justify-end gap-6 px-6">
                        <button onClick={handleLogout} className="flex flex-col items-center justify-end gap-1 opacity-70">
                            <FontAwesomeIcon icon={faArrowRightToBracket} className="text-2xl" />
                            <span className="text-xs">Logout</span>
                        </button>
                    </div>
                }
                {!user &&
                    <div className="flex justify-end gap-6 px-6">
                        <Link to="/login" className="flex flex-col items-center justify-end gap-1 opacity-70">
                            <FontAwesomeIcon icon={faArrowRightToBracket} className="text-2xl" />
                            <span className="text-xs">Login</span>
                        </Link>
                        <Link to="Register" className="flex flex-col items-center justify-end gap-1 opacity-70">
                            <FontAwesomeIcon icon={faUser} className="text-2xl" />
                            <span className="text-xs">Register</span>
                        </Link>
                    </div>
                }
            </nav>
        </>
    )
}

export default Nav