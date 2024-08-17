import { useEffect, useState } from 'react'
import { APIResponse, Book } from '../API/types';
import agent from '../API/axios';
import Card from '../components/Card';

function Home() {

  const [books, setBooks] = useState<Book[]>([]);

  async function fetchBooksRandom() {
    try {
      const res = await agent.get<APIResponse<Book[]>>("book/random");
      const data = res.data.data;
      if (data) setBooks(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchBooksRandom();
  }, []);

  return (
    <>

      <div className="outer container">
        <h2 className="text-3xl font-bold mb-4 mt-6">Your books</h2>
        <div className="grid grid-cols-5 gap-2">
          {
            books.map(book => {
              return <Card key={book.id} book={book} />
            })
          }
        </div>

        <h2 className="text-3xl font-bold mb-4 mt-6">Your readlists</h2>
        <div className="grid grid-cols-5 gap-2">
          {
            books.map(book => {
              return <Card key={book.id} book={book} />
            })
          }
        </div>

        <h2 className="text-3xl font-bold mb-4 mt-6">Random books picked for you</h2>
        <div className="grid grid-cols-5 gap-2">
          {
            books.map(book => {
              return <Card key={book.id} book={book} />
            })
          }
        </div>
      </div>
    </>
  )
}

export default Home
