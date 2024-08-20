import { Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faBook, faGear, faHouse, faIdCard, faList, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { setUser } from "../store/userSlice";

const Drawer = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    function handleLogout() {
        localStorage.removeItem("token");
        dispatch(setUser({ userLoaded: false }));
        setIsOpen(false);
    }

    if (user)
        return (
            <div
                className={`fixed inset-0 z-20 ${isOpen ? 'translate-x-0 bg-gray-800 bg-opacity-75 transform transition-colors duration-300 ease-in-out' : '-translate-x-full'}
                flex`
                }
            >
                <div className="w-full h-full" onClick={() => setIsOpen(false)} />
                <div className="w-96 h-full z-40 bg-orange-50 shadow-md flex flex-col justify-between">
                    <div className="p-6 flex flex-col">
                        <div className="flex flex-row gap-4 items-center justify-start">
                            <Image base64={user?.profilePicBase64} size="xs" />
                            <div>
                                <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                                <Link to="/user" onClick={() => setIsOpen(false)} className="text-md font-semibold">@{user?.username}</Link>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p>Your drawer content goes here.</p>
                        </div>

                        <span className="border border-gray-400 opacity-70 my-4"></span>

                        <div className="grid grid-cols-[1fr_7fr]">
                            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center justify-center"><FontAwesomeIcon icon={faHouse} className="opacity-45" /></Link>
                            <Link to="/" onClick={() => setIsOpen(false)} className="px-1 my-1">Home</Link>

                            <Link to="/user" onClick={() => setIsOpen(false)} className="flex items-center justify-center"><FontAwesomeIcon icon={faIdCard} className="opacity-45" /></Link>
                            <Link to="/user" onClick={() => setIsOpen(false)} className="px-1 my-1">Profile</Link>

                            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center justify-center"><FontAwesomeIcon icon={faThumbsUp} className="opacity-45" /></Link>
                            <Link to="/" onClick={() => setIsOpen(false)} className="px-1 my-1">Liked</Link>

                            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center justify-center"><FontAwesomeIcon icon={faList} className="opacity-45" /></Link>
                            <Link to="/" onClick={() => setIsOpen(false)} className="px-1 my-1">Readlists</Link>

                            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center justify-center"><FontAwesomeIcon icon={faBook} className="opacity-45" /></Link>
                            <Link to="/" onClick={() => setIsOpen(false)} className="px-1 my-1">Books</Link>
                        </div>

                    </div>
                    <div className="p-6 grid grid-cols-[1fr_7fr]">
                        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center justify-center"><FontAwesomeIcon icon={faGear} className="opacity-45" /></Link>
                        <Link to="/" onClick={() => setIsOpen(false)} className="px-1 my-1">Settings</Link>

                        <Link to="/" onClick={handleLogout} className="flex items-center justify-center"><FontAwesomeIcon icon={faArrowRightToBracket} className="opacity-45" /></Link>
                        <Link to="/" onClick={handleLogout} className="px-1 my-1">Logout</Link>
                    </div>
                </div>
            </div>
        );
};


export default Drawer;