import Image from "./Image";
import { faArrowRightToBracket, faSearch, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate } from "react-router-dom"
import { useAppSelector } from "../store/configureStore";
import { useState } from "react";
import Drawer from "./Drawer";


function Nav() {
    const navigate = useNavigate();

    const { user, userLoaded } = useAppSelector(state => state.user);

    // drawer
    const [isOpen, setIsOpen] = useState(false);


    return (
        <>
            <nav className="sticky top-0 z-10 p-3 pt-4 bg-orange-50 shadow grid grid-cols-[3fr_3fr_2fr]">
                <div className="flex justify-start gap-6 px-5 pb-2">
                    <Drawer isOpen={isOpen} setIsOpen={setIsOpen} />

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
                <div className="flex items-center justify-start relative w-full">
                    <input type="text" className="rounded-2xl border border-slate-300 h-full w-full 
                    pr-3 pl-12 focus:outline-none focus:ring focus:ring-yellow-500" />
                    <button className="ml-3 absolute"><FontAwesomeIcon icon={faSearch} className="text-2xl opacity-70" /></button>
                </div>

                <div className="flex justify-end gap-6 px-6">
                    {userLoaded && user &&
                        <button className="flex items-center" onClick={() => setIsOpen(true)}>
                            <Image base64={user?.profilePicBase64} size="icon" />
                        </button>
                    }
                    {userLoaded && !user &&
                        <>
                            <Link to="/login" className="flex flex-col items-center justify-end gap-1 opacity-70">
                                <FontAwesomeIcon icon={faArrowRightToBracket} className="text-2xl" />
                                <span className="text-xs">Login</span>
                            </Link>
                            <Link to="/register" className="flex flex-col items-center justify-end gap-1 opacity-70">
                                <FontAwesomeIcon icon={faUser} className="text-2xl" />
                                <span className="text-xs">Register</span>
                            </Link>
                        </>
                    }
                </div>
            </nav>
        </>
    )
}

export default Nav