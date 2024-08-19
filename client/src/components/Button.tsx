export default function Button({ text, onClick }: { text: string, onClick?: React.MouseEventHandler }) {
    return (
        <button
            className="rounded-lg bg-blue-200 w-24 px-3 py-1 border border-blue-300 shadow mr-2"
            onClick={onClick}
        >{text}</button>
    )
}