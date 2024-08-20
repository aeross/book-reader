import { useAppDispatch, useAppSelector } from "../store/configureStore";
import React, { useState } from "react";
import agent from "../API/axios";
import { setUser } from "../store/userSlice";
import imageCompression from "browser-image-compression";
import Button from "../components/Button";
import Image from "../components/Image";

function UserEdit() {
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

        const formData = new FormData();
        if (file) formData.append("file", file);
        await agent.post("file/user", formData);

        dispatch(setUser({ ...user, userLoaded: false }));
    }

    async function handleDelete(event: React.FormEvent) {
        event.preventDefault();
        await agent.delete("file/user");

        dispatch(setUser({ ...user, userLoaded: false }));
    }

    return (
        <>
            <div className="outer container">
                <div>
                    <h1 className="text-2xl font-semibold">{user?.username}</h1>
                    <p className="text-lg">{user?.firstName}</p>
                    <p className="text-lg">{user?.lastName}</p>
                    <Image base64={user?.profilePicBase64} />

                    {file && <section>
                        File details:
                        <ul>
                            <li>Name: {file.name}</li>
                            <li>Type: {file.type}</li>
                            <li>Size: {file.size} bytes</li>
                        </ul>
                    </section>}
                </div>

                <form className="flex flex-col my-2 gap-2">
                    <label>Upload File</label>
                    <input type="file" onChange={handleSelectFile} />

                    {(progress && progress != 100) && <p>uploading... {progress}%</p>}
                    <div>
                        {(progress == 100) &&
                            <Button text={"upload"} onClick={(e) => handleUpload(e)} />
                        }
                        {user?.profilePicBase64 && <Button text={"delete"} onClick={(e) => handleDelete(e)} />}
                    </div>
                </form>
            </div>
        </>
    )
}

export default UserEdit;

