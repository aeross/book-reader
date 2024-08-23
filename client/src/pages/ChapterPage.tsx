import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore"
import { useEffect, useState } from "react";
import { APIResponse, Chapter } from "../API/types";
import agent from "../API/axios";
import { setChapters } from "../store/chapterSlice";

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

    useEffect(() => {
        if (!chaptersLoaded) fetchChapters();
        if (chaptersLoaded) fetchChapter();
    }, [chaptersLoaded])

    return (
        <div className="outer container">
            <div className="grid grid-cols-[2fr_5fr_2fr]">
                <div></div>
                <div className="text-justify">
                    <h1 className="mb-6 text-center font-semibold text-2xl">{chapter?.title}</h1>
                    <p>{chapter?.content}</p>
                </div>
                <div></div>

            </div>
        </div>
    )
}