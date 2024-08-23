export default function ImageBook({ base64, alt, size }: { base64?: string, alt?: string, size?: string }) {

    let sizeStr;
    switch (size) {
        case "half":
            sizeStr = "rounded w-1/2"; break;
        case "full":
            sizeStr = "rounded-xl w-full"; break;
        default:
            sizeStr = "rounded w-1/2";
    }


    return (
        <>
            {base64
                ? <img
                    src={`data:image/png;base64,${base64}`}
                    alt={alt ? alt : "Image"}
                    className={`${sizeStr} h-auto object-cover object-center aspect-[5/6]`}
                />
                : <div className={`${sizeStr} h-auto bg-slate-200 flex justify-center items-center overflow-hidden aspect-[5/6]`}></div>
            }
        </>
    )
}