function Card() {
    return (
        <div className="m-2 p-2 border rounded">
            <h2>Title</h2>
            <img src="" alt="image"></img>
            <div>
                <p>Content 1</p>
                <p>Content 2</p>
                <p>Content 3</p>
            </div>
            <div className="flex justify-between">
                <button>Button 1</button>
                <button>Button 2</button>
            </div>
        </div>
    )
}

export default Card