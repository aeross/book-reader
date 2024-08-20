import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Image({ base64, alt }: { base64?: string, alt?: string }) {
    return (
        <>
            {base64
                ? <img
                    src={`data:image/png;base64,${base64}`}
                    alt={alt ? alt : "Image"}
                    className="w-64 h-64 rounded-full border-2 border-slate-300"
                />
                : <FontAwesomeIcon icon={faUser} className="w-64 h-64 bg-slate-200 opacity-60 rounded-full border-2 border-slate-300" />
            }
        </>
    )
}