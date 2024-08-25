import { useAppDispatch, useAppSelector } from "../store/configureStore";
import React, { useState } from "react";
import agent from "../API/axios";
import { setUser } from "../store/userSlice";
import imageCompression from "browser-image-compression";
import Button from "../components/Button";
import ImageUser from "../components/ImageUser";
import { useNavigate } from "react-router-dom";

function UserEdit() {
    const navigate = useNavigate();

    const { user } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number | null>(null);

    async function handleSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const ogFile = event.target.files[0];
            const options = {
                maxSizeMB: 0.5,
                onProgress: (progress: number) => {
                    setProgress(progress);
                }
            };
            const compressedFile = await imageCompression(ogFile, options);
            setFile(compressedFile);
        } else {
            console.log("file not found");
        }
    }

    async function handleUpload(event: React.FormEvent) {
        event.preventDefault();

        await agent.put("user", { firstName, lastName });

        const formData = new FormData();
        if (file) {
            formData.append("file", file);
            await agent.post("file/user", formData);
        }

        setFile(null);
        dispatch(setUser({ ...user, userLoaded: false }));
        navigate("/user/" + user!.username);
    }

    async function handleDelete(event: React.FormEvent) {
        event.preventDefault();
        await agent.delete("file/user");

        dispatch(setUser({ ...user, userLoaded: false }));
    }

    const [firstName, setFirstName] = useState(user?.firstName);
    const [lastName, setLastName] = useState(user?.lastName);

    return (
        <>
            <div className="outer container">
                <div className="flex flex-col justify-center gap-88 mb-2 bg-orange-50 py-6 rounded-lg shadow">
                    <div className="flex flex-col gap-4 items-center">
                        <ImageUser base64={user?.profilePicBase64} size="l" />
                        <div>
                            <h2 className="text-2xl font-semibold text-center">{user?.firstName} {user?.lastName}</h2>
                            <div className="text-md font-semibold text-center">@{user?.username}</div>
                        </div>
                    </div>
                    <form className="py-4 px-[20%] grid grid-cols-2 gap-2">
                        <p className="font-semibold">Profile Picture</p>
                        <div className="flex w-full gap-1">
                            <div>
                                <input id="file-input" type="file" className="opacity-0 absolute -z-10 w-0 h-0" onChange={handleSelectFile} />
                                <label htmlFor="file-input" className="hover:cursor-pointer text-center text-sm text-black font-semibold text-opacity-85 rounded-xl bg-orange-250 hover:bg-orange-300 hover:text-opacity-95 w-24 px-3 py-[5px] shadow mr-2 whitespace-nowrap">
                                    Choose File
                                </label>
                            </div>

                            <div>
                                {user?.profilePicBase64 && <Button text="Delete File" onClick={(e) => handleDelete(e)} />}
                            </div>

                            {(progress && progress != 100) && <p>uploading... {progress}%</p>}
                            {(progress === 0 || progress === 100) && file && <section className="text-xs ml-1 overflow-visible whitespace-nowrap">
                                <ul>
                                    <li>Name: {file.name}</li>
                                    <li>Size: {file.size} bytes</li>
                                </ul>
                            </section>}
                        </div>

                        <label className="font-semibold" htmlFor="first-name">First Name</label>
                        <input type="text" id="first-name" onChange={(e) => setFirstName(e.target.value)} value={firstName}
                            className="border-2 rounded w-full min-w-56 px-1"
                        />

                        <label className="font-semibold" htmlFor="last-name">Last Name</label>
                        <input type="text" id="last-name" onChange={(e) => setLastName(e.target.value)} value={lastName}
                            className="border-2 rounded w-full min-w-56 px-1"
                        />

                        <div className="flex justify-end mt-6 col-start-2">
                            <span className="flex items-end w-20">
                                {(progress == 100 || !progress) &&
                                    <Button text={"Save"} onClick={(e) => handleUpload(e)} />
                                }
                            </span>
                        </div>
                    </form>

                </div>


            </div>
        </>
    )
}

export default UserEdit;

