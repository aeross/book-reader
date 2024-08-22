import { useEffect, useState } from "react";
import agent from "../API/axios";
import ImageUser from "../components/ImageUser";
import { APIResponse, Book, User } from "../API/types";
import { useParams } from "react-router-dom";
import { formatLargeNumber } from "../API/helper";
import { useAppSelector } from "../store/configureStore";

function UserProfile() {
    const { username } = useParams();

    // const { user: currUser, userLoaded } = useAppSelector(state => state.user);

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

    function getTotalViews() {
        let views = 0;
        booksUser.forEach(book => {
            views += book.views;
        })
        return views;
    }

    function getTotalLikes() {
        let likes = 0;
        booksUser.forEach(book => {
            likes += book.likes
        })
        return likes;
    }

    return (
        <>
            <div className="outer container">
                <div className="flex justify-center gap-28 mb-2 bg-orange-50 py-6 rounded-lg shadow">
                    <div className="flex flex-col gap-4 items-center">
                        <ImageUser base64={user?.profilePicBase64} size="l" />
                        <div>
                            <h2 className="text-2xl font-semibold text-center">{user?.firstName} {user?.lastName}</h2>
                            <div className="text-md font-semibold text-center">@{user?.username}</div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between pt-2 w-1/3">
                        <div className="[&>p]:flex [&>p]:justify-between">
                            <p>
                                <span className="font-semibold">Total Views</span><span>{formatLargeNumber(getTotalViews())}</span>
                            </p>
                            <p>
                                <span className="font-semibold">Total Likes</span><span>{getTotalLikes()}</span>
                            </p>
                            <p>
                                <span className="font-semibold">Books Authored</span><span>{booksUser.length}</span>
                            </p>
                        </div>
                        <p className="flex justify-between">
                            <span className="font-semibold">Member Since</span><span>{user && new Date(user.updatedAt).toLocaleDateString('en-EN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</span></p>
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

