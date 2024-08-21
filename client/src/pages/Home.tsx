import { useEffect, useState } from 'react'
import { APIResponse, Book } from '../API/types';
import agent from '../API/axios';
import Card from '../components/Card';
import { useAppSelector } from '../store/configureStore';
import Loading from '../components/Loading';

function Home() {
  const { user } = useAppSelector(state => state.user);

  const [loading, setLoading] = useState(false);

  const [booksRand, setBooksRand] = useState<Book[]>([]);
  const [booksLiked, setBooksLiked] = useState<Book[]>([]);

  async function fetchBooksRandom() {
    try {
      const res = await agent.get<APIResponse<Book[]>>("book/random");
      const data = res.data.data;
      if (data) setBooksRand(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchBooksLikedByUser() {
    try {
      if (!user) return;
      const res = await agent.get<APIResponse<Book[]>>(`user/${user.username}/likes`);
      const data = res.data.data;
      if (data) setBooksLiked(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchBooksRandom();
      await fetchBooksLikedByUser();
      setLoading(false);
    })();
  }, [user]);

  return (
    <>
      {loading &&
        <Loading message='Loading...' />
      }

      {!loading &&
        <div className="outer container">
          <h2 className="text-3xl font-bold mb-4">Jump back in</h2>
          <div className="grid grid-cols-5 gap-5">
            {
              booksLiked.map(book => {
                return <Card key={book.id} book={book} />
              })
            }
          </div>

          <h2 className="text-3xl font-bold mb-4 mt-6">Your readlists</h2>
          <div className="grid grid-cols-5 gap-5">
            {
              booksRand.map(book => {
                return <Card key={book.id} book={book} />
              })
            }
          </div>

          <h2 className="text-3xl font-bold mb-4 mt-6">Random books picked for you</h2>
          <div className="grid grid-cols-5 gap-5">
            {
              booksRand.map(book => {
                return <Card key={book.id} book={book} />
              })
            }
          </div>
        </div>
      }
    </>
  )
}

export default Home
