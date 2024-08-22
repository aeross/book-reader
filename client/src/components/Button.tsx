export default function Button({ text, onClick }: { text: string, onClick?: React.MouseEventHandler }) {
    return (
        <button
            className="text-sm text-black font-semibold text-opacity-85 rounded-xl bg-orange-250 hover:bg-orange-300 hover:text-opacity-95 w-24 px-2 py-1 shadow mr-2"
            onClick={onClick}
        >{text}</button>
    )
}