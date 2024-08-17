import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Loading({ message }: { message: string }) {
    return (
        <div className="flex flex-col gap-3 items-center justify-center my-6 opacity-80">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin-slow text-4xl" />
            <span className="text-sm font-bold">{message}</span>
        </div>
    )
}

export default Loading