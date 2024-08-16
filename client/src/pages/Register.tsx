import { Link } from "react-router-dom"

function Register() {
    return (
        <>
            <form className="m-4 p-4 w-1/2 flex flex-col rounded-lg justify-center items-center border-2">
                <h1 className="text-3xl font-bold pb-2">Register</h1>

                <div className="m-4 px-6 grid grid-cols-4 gap-2">
                    <label htmlFor="">First Name</label>
                    <input type="text" className="border-2 rounded col-span-3" />

                    <label htmlFor="">Last Name</label>
                    <input type="text" className="border-2 rounded col-span-3" />

                    <label htmlFor="">Username</label>
                    <input type="text" className="border-2 rounded col-span-3" />

                    <label htmlFor="">Password</label>
                    <input type="text" className="border-2 rounded col-span-3" />
                </div>

                <div className="w-full flex justify-between">
                    <span className="text-sm mt-auto">Already have an account?
                        <Link to="/login"> Login</Link>
                    </span>
                    <button className="border-2 rounded px-4 py-1">Submit</button>
                </div>
            </form>
        </>
    )
}

export default Register