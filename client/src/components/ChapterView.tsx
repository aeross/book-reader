import { faCircleLeft, faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface Props {
    bookId?: string | number;
    bookTitle?: string;
    chapterNum?: string | number;
    chapterTitle?: string;
    chapterContent?: string;
    getPrevChapterNum?: () => number | null;
    getNextChapterNum?: () => number | null;
    handleChapterChange?: () => void;
}

export default function ChapterView({
    bookId,
    bookTitle,
    chapterNum,
    chapterTitle,
    chapterContent,
    getPrevChapterNum,
    getNextChapterNum,
    handleChapterChange,
}: Props) {
    return (
        <div className="text-justify bg-white rounded-lg px-4 pb-4">
            {bookId && bookTitle && chapterNum &&
                <div className="border-b pb-2 pt-4 flex justify-between text-sm italic text-black text-opacity-50">
                    <Link to={`/book/${bookId}`} className="hover:underline">{bookTitle}</Link>
                    <Link to={`/book/${bookId}`} className="hover:underline">Chapter {chapterNum}</Link>
                </div>
            }

            <h1 className="mt-6 mb-6 text-center font-semibold text-2xl">{chapterTitle}</h1>
            <p>{chapterContent}</p>

            {getPrevChapterNum && getNextChapterNum && handleChapterChange && chapterNum &&
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
            }
        </div>
    )
}