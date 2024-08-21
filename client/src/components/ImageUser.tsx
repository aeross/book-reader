import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ImageUser({ base64, alt, size }: { base64?: string, alt?: string, size?: string }) {

    let sizeStr;
    switch (size) {
        case "icon":
            sizeStr = "w-11 h-11"; break;
        case "xs":
            sizeStr = "w-14 h-14"; break;
        case "s":
            sizeStr = "w-20 h-20"; break;
        case "m":
            sizeStr = "w-28 h-28"; break;
        case "l":
            sizeStr = "w-36 h-36"; break;
        default:
            sizeStr = "w-28 h-28"; break;
    }

    return (
        <>
            {base64
                ? <img
                    src={`data:image/png;base64,${base64}`}
                    alt={alt ? alt : "Image"}
                    className={`${sizeStr} rounded-full border-2 border-slate-300 object-cover object-center"`}
                />
                : <div className={`${sizeStr} bg-slate-200 rounded-full border-2 border-slate-300 flex justify-center items-center overflow-hidden`}>
                    <FontAwesomeIcon icon={faUser} className="pt-[15%] opacity-35 w-full h-full" />
                </div>
            }
        </>
    )
}