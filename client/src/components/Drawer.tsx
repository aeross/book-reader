import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "../store/configureStore";

const Drawer = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = useAppSelector(state => state.user);

    return (
        <div
            className={`fixed inset-0 z-20 ${isOpen ? 'translate-x-0 bg-gray-800 bg-opacity-75 transform transition-colors duration-300 ease-in-out' : '-translate-x-full'}
                flex`
            }
        >
            <div className="w-96 h-full z-40 bg-orange-50 shadow-md">
                <div className="p-6 flex flex-col">

                    <h2 className="text-2xl font-semibold">{user?.username}</h2>
                    <div className="mt-4">
                        <p>Your drawer content goes here.</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-full" onClick={() => setIsOpen(false)} />
        </div>
    );
};


export default Drawer;