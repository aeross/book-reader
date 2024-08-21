import { useEffect, useState } from "react";
import agent from "../API/axios";
import Image from "../components/Image";
import { APIResponse, Book, User } from "../API/types";
import { useParams } from "react-router-dom";

function UserProfile() {
    const { username } = useParams();

    const [user, setUser] = useState<User | null>();
    const [booksUser, setBooksUser] = useState<Book[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await agent.get<APIResponse<Book[]>>(`user/${username}/books`);
                const data = res.data.data;
                if (data) setBooksUser(data);
            } catch (error) {
                console.log(error);
            }
        })();

        (async () => {
            try {
                const res = await agent.get<APIResponse<User>>(`user/${username}`);
                const data = res.data.data;
                if (data) setUser(data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [])

    return (
        <>
            <div className="outer container">
                <div className="grid grid-cols-[1fr_2fr] mb-2 rounded shadow">
                    <div className="flex flex-col items-center bg-orange-50 py-6 border-r-[0.5px] border-slate-100 rounded">
                        <Image base64={user?.profilePicBase64} size="l" />
                        <h2 className="text-2xl font-semibold text-center">{user?.firstName} {user?.lastName}</h2>
                        <div className="text-md font-semibold text-center">@{user?.username}</div>
                    </div>
                    <div className="bg-slate-50">
                        <h3>stats/info</h3>
                        <p>121 Total Views</p>
                        <p>14 Total Likes</p>
                        <p>3 Books Authored</p>
                        <p>Member for 6y3m</p>
                    </div>
                </div>

                <div className="pt-4 grid grid-cols-[1fr_2fr] rounded">
                    <div>
                        {booksUser.map(book => {
                            return <div>{book.title}</div>
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile;

