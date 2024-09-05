import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore"
import { useEffect, useRef, useState } from "react";
import { APIResponse, Chapter, User } from "../API/types";
import agent from "../API/axios";
import { setChapters } from "../store/chapterSlice";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { checkIfUserIsAnAuthor } from "../API/helper";
import ChapterView from "../components/ChapterView";
import { ContentState, Editor, EditorState } from 'draft-js';
import { convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

export default function ChapterEdit() {
    const { bookId, chapterId } = useParams();
    let chapterNum: number = 0;
    if (chapterId) {
        chapterNum = parseInt(chapterId);
    }

    const dispatch = useAppDispatch();
    const { chapters, chaptersLoaded } = useAppSelector(state => state.chapter);
    const { user } = useAppSelector(state => state.user);
    const [authors, setAuthors] = useState<User[]>();
    const [chapter, setChapter] = useState<Chapter | null>();


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
                if (data.content) {
                    setEditorState(() =>
                        EditorState.createWithContent(
                            convertFromRaw(JSON.parse(data.content!))
                        ));
                }
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

    useEffect(() => {
        fetchBookAuthors();
    }, [])

    useEffect(() => {
        if (!chaptersLoaded) fetchChapters();
        if (chaptersLoaded) fetchChapter();
    }, [chaptersLoaded])


    // rich text editor
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty(),
    );

    async function saveDraft() {
        try {
            if (chapter) {
                const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
                const updatedChapter = { ...chapter, content }
                console.log(updatedChapter);

                await agent.put(`chapter/${chapter.id}`, updatedChapter);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // handle preview mode
    const [preview, setPreview] = useState(false);

    if (!checkIfUserIsAnAuthor(authors, user)) return <div>Oops... we could not find what you are looking for.</div>

    if (!chaptersLoaded) return <Loading message="Loading..." />

    return (
        <div className="bg-gray-200 outer container min-h-screen">
            <div className="grid grid-cols-[2fr_5fr_2fr]">

                {preview
                    ?
                    <>
                        <div></div>
                        <ChapterView chapterTitle={chapter?.title} chapterContent={chapter?.content} />
                    </>
                    :
                    <>
                        <div className="bg-white rounded-lg p-4 mr-2 flex flex-col justify-between gap-2 h-32">
                            <form className="flex flex-col justify-between h-full">
                                <div>
                                    <label htmlFor="type">Type</label>
                                    <select id="type" className="ml-8 pl-[2px] border-b text-black text-opacity-60 pr-2 py-[1px] text-sm active:outline-none focus:outline-none cursor-pointer">
                                        <option value="Text">Text</option>
                                        <option value="Markdown">Markdown</option>
                                    </select>
                                </div>

                                <div className="flex justify-center">
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        setPreview(true)
                                    }} className="hover:underline text-sm">Preview</button>
                                </div>
                            </form>
                        </div>
                        <form className="text-justify bg-white rounded-lg p-4 pt-6">
                            <div className="flex justify-center items-center">
                                <input
                                    type="text" onChange={(e) => { setChapter({ ...chapter!, title: e.target.value }) }}
                                    className="w-full mb-6 text-center font-semibold text-2xl rounded-lg focus:outline-none" value={chapter ? chapter.title : ""} />
                            </div>
                            <Editor
                                editorState={editorState}
                                onChange={setEditorState}
                            />
                        </form>
                    </>
                }

                {preview
                    ?
                    <div className="bg-white rounded-lg p-4 ml-2 flex flex-col justify-between gap-2 h-32">
                        <div className="flex gap-3 items-center">
                            <div className="w-7 h-7 bg-gray-300 rounded-full flex justify-center items-center translate-y-1">
                                <FontAwesomeIcon icon={faInfo} className="w-2/3 h-2/3 font-bold text-black text-opacity-75" />
                            </div>
                            <p className="mt-2 text-sm">You are in preview mode.</p>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setPreview(false)} className="hover:underline text-sm">Edit</button>
                            <button className="hover:underline text-sm">Publish</button>
                        </div>
                    </div>
                    :
                    <div className="bg-white rounded-lg p-4 ml-2 flex flex-col justify-between gap-2 h-32">
                        <div className="flex gap-3 items-center">
                            <div className="w-7 h-7 bg-gray-300 rounded-full flex justify-center items-center translate-y-1">
                                <FontAwesomeIcon icon={faInfo} className="w-2/3 h-2/3 font-bold text-black text-opacity-75" />
                            </div>
                            <p className="mt-2 text-sm">You are in edit mode.</p>
                        </div>
                        <div className="flex justify-between">
                            <Link to={`/book/${bookId}`} className="hover:underline text-sm">Exit</Link>
                            <button onClick={saveDraft} className="hover:underline text-sm">Save</button>
                        </div>
                    </div>
                }


            </div>
        </div>
    )
}