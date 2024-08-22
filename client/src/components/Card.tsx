import { Link } from "react-router-dom"
import { Book } from "../API/types"
import ImageBook from "./ImageBook"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faInfo, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { formatLargeNumber } from "../API/helper"

function Card({ book }: { book: Book }) {
    return (
        <div className="border rounded-lg overflow-hidden shadow flex flex-col">
            <Link to={`book/${book.id}`}><ImageBook base64={book.coverImgBase64} size="full" /></Link>

            <div className="p-[6px] flex flex-col h-full justify-between">
                <div>
                    <Link to={`book/${book.id}`} className="font-semibold text-lg px-1 hover:underline">{book.title}</Link>

                    <div className="flex flex-wrap gap-1 my-[6px]">
                        {book.genre && book.genre.split(",").map((genre, i) => {
                            return <span key={i} className="bg-orange-50 text-xs font-semibold shadow text-black text-opacity-70 rounded-full px-2 py-1">{genre}</span>
                        })}
                    </div>

                    <div className="flex justify-between text-sm px-1">
                        <div className="flex gap-3">
                            <span>{formatLargeNumber(book.views)} <FontAwesomeIcon icon={faEye} className="opacity-60" /></span>
                            <span>{book.likes} <FontAwesomeIcon icon={faThumbsUp} className="opacity-60" /></span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between text-sm px-1">
                    <div></div>
                    <Link to={`book/${book.id}`} className="flex justify-center items-center shadow rounded-full bg-orange-50 p-2 w-7 h-7 hover:bg-orange-100 hover:opacity-85">
                        <FontAwesomeIcon icon={faInfo} className="opacity-60" />
                    </Link>
                </div>
            </div>
        </div >
    )
}

export default Card