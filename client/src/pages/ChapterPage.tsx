import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore"
import { useEffect, useState } from "react";
import { APIResponse, Chapter } from "../API/types";
import agent from "../API/axios";
import { setChapters } from "../store/chapterSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft, faCircleRight } from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/Loading";

export default function ChapterPage() {
    const { bookId, chapterId } = useParams();
    let chapterNum: number = 0;
    if (chapterId) {
        chapterNum = parseInt(chapterId);
    }

    const dispatch = useAppDispatch();
    const { chapters, chaptersLoaded } = useAppSelector(state => state.chapter);
    const [chapter, setChapter] = useState<Chapter | null>();

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
        if (!chaptersLoaded) fetchChapters();
        if (chaptersLoaded) fetchChapter();
    }, [chaptersLoaded])

    if (chapters && chapters[chapterNum - 1] &&
        chapters[chapterNum - 1].status === 'Draft') return <div>Oops... we could not find what you are looking for.</div>

    if (!chaptersLoaded) return <Loading message="Loading..." />

    return (
        <div className="grid grid-cols-[2fr_5fr_2fr] outer container bg-gray-200">
            <div className="w-full h-full"></div>
            <div className="text-justify bg-white rounded-lg p-4">
                <h1 className="mt-2 mb-6 text-center font-semibold text-2xl">{chapter?.title}</h1>
                <p>{chapter?.content}</p>

                <div className="flex justify-between items-center mt-8">
                    {getPrevChapterNum()
                        ?
                        <Link to={`/book/${bookId}/chapter/${getPrevChapterNum()}`} onClick={handleChapterChange}>
                            <FontAwesomeIcon className="opacity-60 hover:opacity-85 text-xl" icon={faCircleLeft} />
                        </Link>
                        :
                        <FontAwesomeIcon className="opacity-0 text-xl" icon={faCircleLeft} />
                    }

                    <Link to={`/book/${bookId}`} className="font-semibold opacity-80 mb-[2px] hover:opacity-100">
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
            <div></div>

        </div>
    )
}