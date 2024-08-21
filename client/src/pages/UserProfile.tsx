import { useEffect, useState } from "react";
import agent from "../API/axios";
import ImageUser from "../components/ImageUser";
import { APIResponse, Book, User } from "../API/types";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

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
                <div className="flex justify-center gap-14 mb-2 bg-orange-50 py-6 rounded-lg shadow">
                    <div className="flex flex-col items-center ">
                        <ImageUser base64={user?.profilePicBase64} size="l" />
                        <h2 className="text-2xl font-semibold text-center">{user?.firstName} {user?.lastName}</h2>
                        <div className="text-md font-semibold text-center">@{user?.username}</div>
                    </div>
                    <div className="pl-4">
                        <FontAwesomeIcon icon={faCircleInfo} />
                        <p>121 Total Views</p>
                        <p>14 Total Likes</p>
                        <p>3 Books Authored</p>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-4 mt-6">Books</h2>
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

