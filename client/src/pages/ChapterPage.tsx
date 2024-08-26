import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore"
import { useEffect, useState } from "react";
import { APIResponse, Book, Chapter, User } from "../API/types";
import agent from "../API/axios";
import { setChapters } from "../store/chapterSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft, faCircleRight, faInfo } from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/Loading";
import { checkIfUserIsAnAuthor } from "../API/helper";

export default function ChapterPage() {
    const { bookId, chapterId } = useParams();
    let chapterNum: number = 0;
    if (chapterId) {
        chapterNum = parseInt(chapterId);
    }

    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.user);
    const { chapters, chaptersLoaded } = useAppSelector(state => state.chapter);

    const [chapter, setChapter] = useState<Chapter | null>();
    const [book, setBook] = useState<Book | null>();
    const [authors, setAuthors] = useState<User[]>();

    async function fetchChapters() {
        try {
            const res = await agent.get<APIResponse<Chapter[]>>(`chapter/book/${bookId}`);
            const data = res.data.data;
            if (data) {
                dispatch(setChapters({ chapters: data, chaptersLoaded: true }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchChapter() {
        try {
            const res = await agent.get<APIResponse<Chapter>>("chapter/" + chapters[chapterNum - 1].id);
            const data = res.data.data;
            if (data) {
                setChapter(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchBook() {
        try {
            const res = await agent.get<APIResponse<Book>>(`book/${bookId}`);
            const data = res.data.data;
            if (data) {
                setBook(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchBookAuthors() {
        try {
            const res = await agent.get<APIResponse<User[]>>(`book/get-authors/${bookId}`);
            const data = res.data.data;
            if (data) {
                setAuthors(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function getPrevChapterNum() {
        if (chapters) {
            for (let i = chapterNum - 1; i > 0; i--) {
                const prevChapter = chapters[i];

                if (prevChapter && prevChapter.status === 'Published') {
                    return i;
                }
            }
        }
        return null;
    }

    function getNextChapterNum() {
        if (chapters) {
            for (let i = chapterNum; i < chapters.length; i++) {
                const nextChapter = chapters[i];

                if (nextChapter && nextChapter.status === 'Published') {
                    return i + 1;
                }
            }
        }
        return null;
    }

    function handleChapterChange() {
        dispatch(setChapters({ chaptersLoaded: false }));
    }

    useEffect(() => {
        fetchBook();
        fetchBookAuthors();
    }, [])

    useEffect(() => {
        if (!chaptersLoaded) fetchChapters();
        if (chaptersLoaded) fetchChapter();
    }, [chaptersLoaded])

    if (chapters && chapters[chapterNum - 1] &&
        chapters[chapterNum - 1].status === 'Draft') return <div>Oops... we could not find what you are looking for.</div>

    if (!chaptersLoaded) return <Loading message="Loading..." />

    return (
        <div className="grid grid-cols-[2fr_5fr_2fr] outer container bg-gray-200">
            <div></div>
            <div className="text-justify bg-white rounded-lg p-4">
                <div className="border-b pb-2 flex justify-between text-sm italic text-black text-opacity-50">
                    <Link to={`/book/${bookId}`} className="hover:underline">{book?.title}</Link>
                    <Link to={`/book/${bookId}`} className="hover:underline">Chapter {chapterNum}</Link>
                </div>

                <h1 className="mt-6 mb-6 text-center font-semibold text-2xl">{chapter?.title}</h1>
                <p>{chapter?.content}</p>

                <div className="flex justify-between items-center mt-6 border-t pt-2">
                    {getPrevChapterNum()
                        ?
                        <Link to={`/book/${bookId}/chapter/${getPrevChapterNum()}`} onClick={handleChapterChange}>
                            <FontAwesomeIcon className="opacity-60 hover:opacity-85 text-xl" icon={faCircleLeft} />
                        </Link>
                        :
                        <FontAwesomeIcon className="opacity-0 text-xl" icon={faCircleLeft} />
                    }

                    <Link to={`/book/${bookId}`} className="hover:underline font-semibold opacity-80 mb-[2px] hover:opacity-100">
                        Chapter {chapterNum}
                    </Link>

                    {getNextChapterNum()
                        ?
                        <Link to={`/book/${bookId}/chapter/${getNextChapterNum()}`} onClick={handleChapterChange}>
                            <FontAwesomeIcon className="opacity-60 hover:opacity-85 text-xl" icon={faCircleRight} />
                        </Link>
                        :
                        <FontAwesomeIcon className="opacity-0 text-xl" icon={faCircleRight} />
                    }
                </div>
            </div>


            <div className="bg-white rounded-lg p-4 ml-2 flex flex-col justify-between gap-2 h-32">
                {checkIfUserIsAnAuthor(authors, user) &&
                    (<>
                        <div className="flex gap-3 items-center">
                            <div className="w-7 h-7 bg-gray-300 rounded-full flex justify-center items-center translate-y-1">
                                <FontAwesomeIcon icon={faInfo} className="w-2/3 h-2/3 font-bold text-black text-opacity-75" />
                            </div>
                            <p className="mt-2">You are in read mode.</p>
                        </div>
                        <div className="flex justify-center">
                            <Link to={`/book/${bookId}/chapter/edit/${chapterNum}`} className="hover:underline text-sm">Edit</Link>
                        </div>
                    </>)
                }
            </div>

        </div>
    )
}