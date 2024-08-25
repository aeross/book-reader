import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore"
import { useEffect, useState } from "react";
import { APIResponse, Chapter } from "../API/types";
import agent from "../API/axios";
import { setChapters } from "../store/chapterSlice";
import Loading from "../components/Loading";

export default function ChapterEdit() {
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

    if (chapters && chapters[chapterNum - 1] &&
        chapters[chapterNum - 1].status === 'Draft') return <div>Oops... we could not find what you are looking for.</div>

    if (!chaptersLoaded) return <Loading message="Loading..." />

    return (
        <div className="grid grid-cols-[2fr_5fr_2fr] outer container bg-gray-200">
            <div className="w-full h-full"></div>
            <form className="text-justify bg-white rounded-lg p-4">
                <div className="flex justify-center items-center">
                    <input
                        type="text" onChange={(e) => { setChapter({ ...chapter!, title: e.target.value }) }}
                        className="w-full mt-2 mb-6 text-center font-semibold text-2xl border-2 rounded-lg" value={chapter ? chapter.title : ""} />
                </div>
                <textarea
                    onChange={(e) => { setChapter({ ...chapter!, content: e.target.value }) }}
                    value={chapter ? chapter.content : ""}
                    className="w-full"
                />
            </form>
            <div></div>

        </div>
    )
}