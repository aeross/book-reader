import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore"
import { useEffect, useState } from "react";
import { APIResponse, Book, Chapter } from "../API/types";
import agent from "../API/axios";
import { setChapters } from "../store/chapterSlice";
import Loading from "../components/Loading";
import ChapterView from "../components/ChapterView";

export default function ChapterPage() {
    const { bookId, chapterId } = useParams();
    let chapterNum: number = 0;
    if (chapterId) {
        chapterNum = parseInt(chapterId);
    }

    const dispatch = useAppDispatch();
    const { chapters, chaptersLoaded } = useAppSelector(state => state.chapter);

    const [chapter, setChapter] = useState<Chapter | null>();
    const [book, setBook] = useState<Book | null>();

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

            <ChapterView
                bookId={bookId} bookTitle={book?.title} chapterNum={chapterNum}
                chapterTitle={chapter?.title} chapterContent={chapter?.content}
                getPrevChapterNum={getPrevChapterNum} getNextChapterNum={getNextChapterNum}
                handleChapterChange={handleChapterChange}
            />

        </div>
    )
}