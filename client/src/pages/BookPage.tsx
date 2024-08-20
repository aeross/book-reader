import { useEffect, useState } from "react"
import { APIResponse, Book } from "../API/types";
import agent from "../API/axios";
import { useParams } from "react-router-dom";

export default function BookPage() {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>();

    async function fetchBook() {
        try {
            const res = await agent.get<APIResponse<Book>>(`book/${id}`);
            const data = res.data.data;
            if (data) {
                setBook(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBook();
    }, [])

    return (
        <>
            <div>book</div>
            <div>{book?.title}</div>
            <div>{book?.tagline}</div>
            <div>{book?.description}</div>
            <div>{book?.views}</div>
        </>
    )
}