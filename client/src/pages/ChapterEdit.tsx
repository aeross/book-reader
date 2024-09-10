import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore"
import { useEffect, useState } from "react";
import { APIResponse, Chapter, User } from "../API/types";
import agent from "../API/axios";
import { setChapters } from "../store/chapterSlice";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faCode, faInfo, faItalic, faListNumeric, faListUl, faRedo, faStrikethrough, faSubscript, faSuperscript, faUnderline, faUndo } from "@fortawesome/free-solid-svg-icons";
import { checkIfUserIsAnAuthor, getWordCountFromPlainText } from "../API/helper";
import ChapterView from "../components/ChapterView";
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw, DraftStyleMap } from 'draft-js';
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

    // handle preview mode
    const [preview, setPreview] = useState(false);

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

    // text styling
    const toggleRichTextStyle = (event: React.FormEvent) => {
        event.preventDefault();
        let style = event.currentTarget.getAttribute('data-style');
        if (style) {
            setEditorState(RichUtils.toggleInlineStyle(editorState, style));
        }

        let block = event.currentTarget.getAttribute('data-block');
        if (block)
            setEditorState(RichUtils.toggleBlockType(editorState, block));
    };

    const customStyles: DraftStyleMap = {
        'SUBSCRIPT': {
            fontSize: '0.75em',
            verticalAlign: 'sub',
        },
        'SUPERSCRIPT': {
            fontSize: '0.75em',
            verticalAlign: 'super',
        },
    }

    // check if styling is active
    const renderInlineStyle = (style: string) => {
        const currentInlineStyle = editorState.getCurrentInlineStyle();
        let active = "";
        if (currentInlineStyle.has(style)) {
            active = "text-orange-700";
        }
        return active;
    }

    const renderBlockStyle = (block: string) => {
        const currentBlockType = RichUtils.getCurrentBlockType(editorState);
        let active = '';
        if (currentBlockType === block) {
            active = 'text-orange-700';
        }
        return active;
    }

    // helpers
    const getCharCount = () => editorState.getCurrentContent().getPlainText().length;
    const getWordCount = () => getWordCountFromPlainText(editorState.getCurrentContent().getPlainText());


    if (!chaptersLoaded) return <Loading message="Loading..." />

    if (!checkIfUserIsAnAuthor(authors, user)) return <div>Oops... we could not find what you are looking for.</div>

    return (
        <div className="bg-gray-200 outer container min-h-screen">
            <div className="grid grid-cols-[2fr_5fr_2fr]">

                {preview
                    ?
                    <>
                        <div></div>
                        <ChapterView chapterTitle={chapter?.title} editorState={editorState} setEditorState={setEditorState} />
                        <div className="sticky top-[108px] bg-white rounded-lg p-4 ml-2 flex flex-col justify-between gap-2 h-32">

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
                    </>
                    :
                    <>
                        <div className="sticky top-[108px] h-[calc(100dvh-4rem-78px)] bg-white rounded-lg p-4 mr-2 flex flex-col justify-between gap-2 text-sm" onMouseDown={(e) => { e.preventDefault() }}>
                            <form className="flex flex-col justify-between h-full">
                                <div className="flex flex-col gap-4">
                                    <section>
                                        <label htmlFor="type">Type</label>
                                        <select id="type" className="ml-8 pl-[2px] border-b text-black text-opacity-60 pr-2 py-[1px] active:outline-none focus:outline-none cursor-pointer">
                                            <option value="Text">Text</option>
                                            <option value="Markdown">Markdown</option>
                                        </select>
                                    </section>





                                    <section className="grid grid-cols-5 gap-1 ml-1 mr-4 mt-2">
                                        <FontAwesomeIcon
                                            className={`${renderInlineStyle("BOLD")} ml-[3px] hover:cursor-pointer`} icon={faBold}
                                            data-style="BOLD"
                                            onMouseDown={toggleRichTextStyle}
                                        />
                                        <FontAwesomeIcon
                                            className={`${renderInlineStyle("ITALIC")} ml-[2px] hover:cursor-pointer`} icon={faItalic}
                                            data-style="ITALIC"
                                            onMouseDown={toggleRichTextStyle}
                                        />
                                        <FontAwesomeIcon
                                            className={`${renderInlineStyle("UNDERLINE")} ml-[2px] hover:cursor-pointer`} icon={faUnderline}
                                            data-style="UNDERLINE"
                                            onMouseDown={toggleRichTextStyle}
                                        />
                                        <FontAwesomeIcon
                                            className={`${renderInlineStyle("STRIKETHROUGH")} hover:cursor-pointer`} icon={faStrikethrough}
                                            data-style="STRIKETHROUGH"
                                            onMouseDown={toggleRichTextStyle}
                                        />


                                        <FontAwesomeIcon
                                            className={`${renderInlineStyle("CODE")} hover:cursor-pointer row-start-5`} icon={faCode}
                                            data-style="CODE"
                                            onMouseDown={toggleRichTextStyle}
                                        />


                                        <FontAwesomeIcon
                                            className={`${renderBlockStyle("unordered-list-item")} hover:cursor-pointer row-start-9`} icon={faListUl}
                                            data-block="unordered-list-item"
                                            onMouseDown={toggleRichTextStyle}
                                        />
                                        <FontAwesomeIcon
                                            className={`${renderBlockStyle("ordered-list-item")} hover:cursor-pointer row-start-9`} icon={faListNumeric}
                                            data-block="ordered-list-item"
                                            onMouseDown={toggleRichTextStyle}
                                        />

                                        <FontAwesomeIcon className={`hover:cursor-pointer row-start-13`} icon={faUndo}
                                            onMouseDown={() => setEditorState(EditorState.undo(editorState))}
                                        />
                                        <FontAwesomeIcon className={`${renderBlockStyle("header-two")} hover:cursor-pointer row-start-13`} icon={faRedo}
                                            onMouseDown={() => setEditorState(EditorState.redo(editorState))}
                                        />
                                        <FontAwesomeIcon className={`${renderInlineStyle("SUBSCRIPT")} hover:cursor-pointer row-start-13`} icon={faSubscript}
                                            data-style="SUBSCRIPT"
                                            onMouseDown={toggleRichTextStyle}
                                        />
                                        <FontAwesomeIcon className={`${renderInlineStyle("SUPERSCRIPT")} hover:cursor-pointer row-start-13`} icon={faSuperscript}
                                            data-style="SUPERSCRIPT"
                                            onMouseDown={toggleRichTextStyle}
                                        />

                                        <div className="row-start-[17] col-span-[1/-2]">{getCharCount()}</div>
                                        <div className="row-start-[17]">characters</div>
                                        <div className="row-start-[18] col-span-[1/-2]">{getWordCount()}</div>
                                        <div className="row-start-[18]">words</div>
                                        <div className="row-start-[19] col-span-[1/-2]">{getCharCount()}</div>
                                        <div className="row-start-[19]">characters</div>
                                    </section>

                                </div>

                                <button onClick={saveDraft} className="hover:underline text-sm">Save</button>
                            </form>
                        </div>

                        <form className="text-justify bg-white rounded-lg p-4 pt-6">
                            <div className="flex justify-center items-center">
                                <input
                                    type="text" onChange={(e) => { setChapter({ ...chapter!, title: e.target.value }) }}
                                    className="w-full mb-6 text-center font-semibold text-2xl rounded-lg focus:outline-none" value={chapter ? chapter.title : ""} />
                            </div>
                            <Editor
                                customStyleMap={customStyles}
                                editorState={editorState}
                                onChange={setEditorState}
                                textAlignment="left"
                            />
                        </form>

                        <div className="sticky top-[108px] bg-white rounded-lg p-4 ml-2 flex flex-col justify-between gap-2 h-32">
                            <div className="flex gap-3 items-center">
                                <div className="w-7 h-7 bg-gray-300 rounded-full flex justify-center items-center translate-y-1">
                                    <FontAwesomeIcon icon={faInfo} className="w-2/3 h-2/3 font-bold text-black text-opacity-75" />
                                </div>
                                <p className="mt-2 text-sm">You are in edit mode.</p>
                            </div>
                            <div className="flex justify-between">
                                <Link to={`/book/${bookId}`} className="hover:underline text-sm">Exit</Link>
                                <div className="flex justify-center">
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        setPreview(true)
                                    }} className="hover:underline text-sm">Preview</button>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div >
        </div >
    )
}