import { Book } from "../API/types"

function Card({ book }: { book: Book }) {
    return (
        <div className="p-2 border rounded">
            <h2>{book.title}</h2>
            <img src="" alt="image"></img>
            <div>
                <p>{book.tagline}</p>
                <p>{book.genre}</p>
                <p>{book.views}</p>
                <p>{book.likes}</p>
            </div>
            <div className="flex justify-between">
                <button>Button 1</button>
                <button>Button 2</button>
            </div>
        </div>
    )
}

export default Card