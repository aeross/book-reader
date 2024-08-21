export default function ImageBook({ base64, alt, size }: { base64?: string, alt?: string, size?: string }) {

    let sizeStr;
    switch (size) {
        case "half":
            sizeStr = "w-1/2"; break;
        case "full":
            sizeStr = "w-full"; break;
        default:
            sizeStr = "w-1/2";
    }


    return (
        <>
            {base64
                ? <img
                    src={`data:image/png;base64,${base64}`}
                    alt={alt ? alt : "Image"}
                    className={`${sizeStr} h-auto rounded object-cover object-center aspect-[5/6]`}
                />
                : <div className={`${sizeStr} h-auto bg-slate-200 rounded flex justify-center items-center overflow-hidden aspect-[5/6]`}></div>
            }
        </>
    )
}