import { useEffect, useState } from "react"
import { APIResponse, Book, Chapter, User } from "../API/types";
import agent from "../API/axios";
import { Link, useParams } from "react-router-dom";
import ImageBook from "../components/ImageBook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatLargeNumber } from "../API/helper";
import Loading from "../components/Loading";
import ImageUser from "../components/ImageUser";
import { useAppSelector } from "../store/configureStore";

export default function BookPage() {
    const { id } = useParams();

    const { user } = useAppSelector(state => state.user);
    const [book, setBook] = useState<Book | null>();

    const [loading, setLoading] = useState(true);

    // const [book, setBook] = useState<Book | null>();
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

    function checkIfUserIsAnAuthor() {
        if (!authors) return false;
        if (!user) return false;

        let output = false;
        for (let i = 0; i < authors.length; i++) {
            let author = authors[i];
            if (author.username === user.username) {
                output = true;
                break;
            }
        }
        return output;
    }

    function getWordCount() {
        if (!chapters) return 0;

        let wordCount = 0;
        chapters.forEach(c => {
            if (c.status === "Published")
                wordCount += c.numOfWords ?? 0;
        })
        return wordCount;
    }

    function getPublishedDate() {
        // find the latest updatedAt with status = 'Published'
        let published = false;
        let mostRecentDate: Date = new Date(1970, 0, 1);
        chapters.forEach(c => {
            if (c.status === 'Published') {
                if (!published) published = true;
                if (new Date(c.updatedAt) > mostRecentDate) mostRecentDate = c.updatedAt;
            }
        });

        if (published) {
            return new Date(mostRecentDate).toLocaleDateString('en-EN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
        return "Not published";
    }

    // in minutes.
    function getEstimatedReadTime() {
        if (!chapters) return 0;

        let ert = Math.round(getWordCount() / 200);

        let output = "";
        if (ert > 150) {
            ert = Math.round(ert / 60);
            output = ert.toString() + " hours";
        } else {
            output = ert.toString() + " minutes";
        }

        return output;
    }

    useEffect(() => {
        if (loading) {
            (async () => {
                await fetchBook();
                await fetchChapters();
                await fetchBookAuthors();
                await incrementViews();
                setLoading(false);
            })();
        }
    }, [loading])

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

                            <p className="whitespace-pre-line">{book?.description}</p>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <p className="mb-1 text-sm">
                                    Authored by: {authors?.map((author, i) => {
                                        if (author.username) {
                                            return ((i + 1) == authors.length)
                                                ? <Link to={`/user/${author.username}`} key={i} className="hover:underline">@{author.username}</Link>
                                                : <Link to={`/user/${author.username}`} key={i} className="hover:underline">@{author.username}, </Link>
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
                            <span className="flex items-end">
                                {checkIfUserIsAnAuthor() &&
                                    <Link to={`/book/edit/${id}`}><FontAwesomeIcon icon={faEdit} className="opacity-60 text-2xl hover:opacity-85" /></Link>
                                }
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 mt-8 gap-10">
                    <div className="col-span-2">
                        <h2 className="text-3xl font-bold pb-4 px-2 border-b">Chapters</h2>
                        {chapters.map(c => {
                            if (c.status === "Draft")
                                return (
                                    <div key={c.id}>
                                        <div className={`text-lg border-b border-b-red-800 p-2 flex justify-between ${checkIfUserIsAnAuthor() ? "[&>div#date]:hover:hidden" : ""} [&>div#links]:hover:flex text-black text-opacity-35 bg-red-800 bg-opacity-25 hover:cursor-not-allowed`}>
                                            <span>{c.title}</span>
                                            <div id="date" className="flex gap-4 text-sm items-center italic">Not published</div>
                                            {checkIfUserIsAnAuthor() &&
                                                <div id="links" className="hidden gap-4">
                                                    <span>
                                                        <Link to={`/book/edit/${id}`}><FontAwesomeIcon icon={faEdit} className="text-slate-600 hover:text-slate-900" /></Link>
                                                    </span>
                                                    <span>
                                                        <Link to={`/book/edit/${id}`}><FontAwesomeIcon icon={faTrash} className="text-slate-600 hover:text-slate-900" /></Link>
                                                    </span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )
                            if (c.status === "Published")
                                return (
                                    <Link to="/" key={c.id}>
                                        <div className={`text-lg border-b p-2 flex justify-between ${checkIfUserIsAnAuthor() ? "[&>div#date]:hover:hidden" : ""} [&>div#links]:hover:flex hover:bg-slate-100`}>
                                            <span>{c.title}</span>
                                            <div id="date" className="flex gap-4 text-sm items-center">{new Date(c.updatedAt).toLocaleDateString('en-EN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}</div>
                                            {checkIfUserIsAnAuthor() &&
                                                <div id="links" className="hidden gap-4">
                                                    <span>
                                                        <Link to={`/book/edit/${id}`}><FontAwesomeIcon icon={faEdit} className="opacity-60 hover:opacity-85" /></Link>
                                                    </span>
                                                    <span>
                                                        <Link to={`/book/edit/${id}`}><FontAwesomeIcon icon={faTrash} className="opacity-60 hover:opacity-85" /></Link>
                                                    </span>
                                                </div>
                                            }
                                        </div>
                                    </Link>
                                )
                        })}
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-4">Details</h2>
                        <div className="mb-10 flex flex-col gap-1 [&>*]:flex [&>*]:justify-between">
                            <div>
                                <span className="font-semibold">Genre</span>
                                <span className="flex flex-wrap gap-1">{
                                    book?.genre && book?.genre.split(",").map((genre, i) => {
                                        return <span key={i} className="bg-orange-50 text-xs font-semibold shadow text-black text-opacity-85 rounded-full px-2 py-1">
                                            {genre}
                                        </span>
                                    })}
                                </span>
                            </div>
                            <div><span className="font-semibold">Word Count</span><span>{getWordCount()}</span></div>
                            <div><span className="font-semibold">Estimated Read Time</span><span>{getEstimatedReadTime()}</span></div>
                            <div><span className="font-semibold">Views</span><span>{book?.views}</span></div>
                            <div><span className="font-semibold">Likes</span><span>{book?.likes}</span></div>
                            <div>
                                <span className="font-semibold">
                                    Published on</span>
                                <span>
                                    {getPublishedDate()}
                                </span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-4">Contributors</h2>
                        {authors?.map(author => {
                            return (
                                <div className="flex items-center gap-4" key={author.id}>
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