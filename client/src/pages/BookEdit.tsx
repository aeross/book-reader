import { useEffect, useState } from "react";
import ImageBook from "../components/ImageBook";
import imageCompression from "browser-image-compression";
import Button from "../components/Button";
import agent from "../API/axios";
import { APIResponse, Book } from "../API/types";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";

function BookEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [book, setBook] = useState<Book | null>();

    async function fetchBook() {
        try {
            const res = await agent.get<APIResponse<Book>>(`book/${id}`);
            const data = res.data.data;
            if (data) {
                setBook(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        (async () => {
            if (!loading) await fetchBook();
            setLoading(false);
        })();
    }, [loading])

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
        setSubmitting(true);

        await agent.put("book/" + id, { ...book, coverImgBase64: null, coverImgFileId: null });

        const formData = new FormData();
        if (file) {
            formData.append("file", file);
            await agent.post("file/book/" + id, formData);
        }

        setFile(null);
        navigate("/book/" + id);
    }

    async function handleDelete(event: React.FormEvent) {
        event.preventDefault();
        await agent.delete("file/book/" + id);
        setLoading(true);
    }

    if (loading) return <Loading message="Loading..." />

    if (submitting) return <Loading message="Submitting..." />

    return (
        <>
            <div className="outer container">
                <div className="grid grid-cols-3 px-[10%] gap-4 mb-2 bg-orange-50 py-6 rounded-lg shadow">
                    <div className="flex flex-col items-center">
                        <ImageBook base64={book?.coverImgBase64} size="full" />
                    </div>
                    <div className="pl-4 flex flex-col justify-between col-span-2">
                        <form>
                            <div className="text-3xl font-bold mb-1">
                                <input
                                    type="text" id="title" className="border-2 rounded w-full p-[2px]"
                                    value={book?.title}
                                    onChange={(e) => { setBook({ ...book!, title: e.target.value }) }}
                                />
                            </div>
                            <div className="text-md font-semibold mb-6">
                                <input
                                    type="text" id="tagline" className="border-2 rounded italic w-full p-[2px]"
                                    value={book?.tagline}
                                    onChange={(e) => { setBook({ ...book!, tagline: e.target.value }) }}
                                />
                            </div>
                            <div className="h-[97%]">
                                <textarea
                                    id="desc" className="border-2 rounded resize-none h-full w-full p-[2px]"
                                    value={book?.description}
                                    onChange={(e) => { setBook({ ...book!, description: e.target.value }) }}
                                />
                            </div>
                            {/* <h2 className="text-3xl font-bold mb-1">{book?.title}</h2>
                            <div className="text-md font-semibold italic mb-6">{book?.tagline}</div>

                            <p className="whitespace-pre-line">{book?.description}</p> */}
                        </form>


                        <div>
                            <div>
                                {file && <section className="text-xs">
                                    <ul>
                                        <li>Name: {file.name}</li>
                                        <li>Size: {file.size} bytes</li>
                                    </ul>
                                </section>}
                                {(progress && progress != 100) && <p>Uploading... {progress}%</p>}
                            </div>
                            <div className="flex justify-between">
                                <form className="flex mt-2 gap-2">
                                    <input id="file-input" type="file" className="opacity-0 absolute -z-10 w-0 h-0" onChange={handleSelectFile} />
                                    <label htmlFor="file-input" className="hover:cursor-pointer text-center text-sm text-black font-semibold text-opacity-85 rounded-xl bg-orange-250 hover:bg-orange-300 hover:text-opacity-95 w-24 px-2 py-1 shadow mr-2">
                                        Choose File
                                    </label>
                                    <div>
                                        {book?.coverImgBase64 && <Button text={"Delete File"} onClick={(e) => handleDelete(e)} />}
                                    </div>
                                </form>
                                <span className="flex items-end w-20">
                                    {(progress == 100 || !progress) &&
                                        <Button text={"Save"} onClick={(e) => handleUpload(e)} />
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookEdit
