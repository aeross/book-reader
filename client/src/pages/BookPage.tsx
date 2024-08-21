import { useEffect, useState } from "react"
import { APIResponse, Book, Chapter, User } from "../API/types";
import agent from "../API/axios";
import { Link, useParams } from "react-router-dom";
import ImageBook from "../components/ImageBook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { formatLargeNumber } from "../API/helper";
import Loading from "../components/Loading";
import ImageUser from "../components/ImageUser";

export default function BookPage() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [book, setBook] = useState<Book | null>();
    const [authors, setAuthors] = useState<User[]>();
    const [chapters, setChapters] = useState<Chapter[]>([]);

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

    async function fetchChapters() {
        try {
            const res = await agent.get<APIResponse<Chapter[]>>(`chapter/book/${id}`);
            const data = res.data.data;
            if (data) {
                setChapters(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function incrementViews() {
        try {
            await agent.patch(`book/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchBookAuthors() {
        try {
            const res = await agent.get<APIResponse<User[]>>(`book/get-authors/${id}`);
            const data = res.data.data;
            if (data) {
                setAuthors(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        (async () => {
            await fetchBook();
            await fetchChapters();
            await fetchBookAuthors();
            await incrementViews();
            setLoading(false);
        })();
    }, [])

    if (loading) return <Loading message="Loading..." />

    return (
        <>
            <div className="outer container">
                <div className="grid grid-cols-3 px-[10%] gap-4 mb-2 bg-orange-50 py-6 rounded-lg shadow">
                    <div className="flex flex-col items-center">
                        <ImageBook base64={book?.coverImgBase64} size="full" />
                    </div>
                    <div className="pl-4 flex flex-col justify-between col-span-2">
                        <div>
                            <h2 className="text-3xl font-bold mb-1">{book?.title}</h2>
                            <div className="text-md font-semibold italic mb-6">{book?.tagline}</div>

                            <p>{book?.description}</p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm">
                                Authored by: {authors?.map((author, i) => {
                                    if (author.username) {
                                        return ((i + 1) == authors.length)
                                            ? <Link to={`/user/${author.username}`} className="hover:underline">@{author.username}</Link>
                                            : <Link to={`/user/${author.username}`} className="hover:underline">@{author.username}, </Link>
                                    }
                                })}
                            </p>
                            <div className="flex gap-3">
                                <span>
                                    {book ? formatLargeNumber(book.views) : undefined} <FontAwesomeIcon icon={faEye} className="opacity-60" />
                                </span>
                                <span>{book?.likes} <FontAwesomeIcon icon={faThumbsUp} className="opacity-60" /></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 mt-6 gap-8">
                    <div className="col-span-2">
                        <h2 className="text-3xl font-bold pb-4 px-2 border-b">Chapters</h2>
                        {chapters.map(c => {
                            return (
                                <Link to="/">
                                    <div className="text-lg border-b p-2 hover:bg-slate-100">
                                        {c.title}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-4">Contributors</h2>
                        {authors?.map(author => {
                            return (
                                <div className="flex items-center gap-4">
                                    <Link to={`/user/${author.username}`}>
                                        <ImageUser base64={author?.profilePicBase64} size="xs" />
                                    </Link>
                                    <div>
                                        <h2 className="text-xl">{author?.firstName} {author?.lastName}</h2>
                                        <Link to={`/user/${author.username}`} className="text-md hover:underline">
                                            @{author?.username}
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>


                </div>
            </div >

        </>
    )
}