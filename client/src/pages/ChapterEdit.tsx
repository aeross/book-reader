import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore"
import { useEffect, useRef, useState } from "react";
import { APIResponse, Chapter } from "../API/types";
import agent from "../API/axios";
import { setChapters } from "../store/chapterSlice";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

export default function ChapterEdit() {
    const { bookId, chapterId } = useParams();
    let chapterNum: number = 0;
    if (chapterId) {
        chapterNum = parseInt(chapterId);
    }

    const dispatch = useAppDispatch();
    const { chapters, chaptersLoaded } = useAppSelector(state => state.chapter);
    const [chapter, setChapter] = useState<Chapter | null>();


    // auto resize textarea
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [contentVal, setContentVal] = useState("");

    useEffect(() => {
        const textarea = textareaRef.current;

        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto to get the correct scrollHeight
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scrollHeight
        }
    }, [contentVal]); // Re-run effect when value changes

    // fetches
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
                if (data.content) setContentVal(data.content);
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
        <div className="bg-gray-200 outer container">
            <div className="grid grid-cols-[2fr_5fr_2fr]">
                <div className="bg-white rounded-lg p-4 mr-2 flex flex-col justify-between gap-2 h-32">
                    <form className="flex flex-col justify-between h-full">
                        <div>
                            <label htmlFor="type">Type</label>
                            <select id="type" className="ml-8 pl-[2px] border-b text-black text-opacity-60 pr-2 py-[1px] text-sm active:outline-none focus:outline-none cursor-pointer">
                                <option value="Text">Text</option>
                                <option value="Markdown">Markdown</option>
                            </select>
                        </div>

                        <button className="hover:underline text-sm">Preview</button>
                    </form>
                </div>

                <form className="text-justify bg-white rounded-lg p-4 pt-6">
                    <div className="flex justify-center items-center">
                        <input
                            type="text" onChange={(e) => { setChapter({ ...chapter!, title: e.target.value }) }}
                            className="w-full mb-6 text-center font-semibold text-2xl rounded-lg focus:outline-none" value={chapter ? chapter.title : ""} />
                    </div>
                    <textarea
                        ref={textareaRef}
                        id="autoResizeTextarea"
                        onChange={(e) => {
                            setContentVal(e.target.value);
                            setChapter({ ...chapter!, content: e.target.value });
                        }}
                        value={chapter ? chapter.content : ""}
                        className="w-full resize-none overflow-hidden text-justify rounded-lg focus:outline-none"
                    />
                </form>

                <div className="bg-white rounded-lg p-4 ml-2 flex flex-col justify-between gap-2 h-32">
                    <div className="flex gap-3 items-center">
                        <div className="w-7 h-7 bg-gray-300 rounded-full flex justify-center items-center translate-y-1">
                            <FontAwesomeIcon icon={faInfo} className="w-2/3 h-2/3 font-bold text-black text-opacity-75" />
                        </div>
                        <p className="mt-2">You are in edit mode.</p>
                    </div>
                    <div className="flex justify-between">
                        <Link to={`/book/${bookId}/chapter/${chapterNum}`} className="hover:underline text-sm">Exit</Link>
                        <Link to="" className="hover:underline text-sm">Save</Link>
                    </div>
                </div>

            </div>
        </div>
    )
}