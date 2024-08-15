import { useEffect, useState } from 'react'
import { Book } from './API/types';
import agent from './API/requests';


function App() {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    async function fetchBooksRandom() {
      try {
        const res = await agent.get("book/random");
        setBooks(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBooksRandom();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Books</h1>
      <div>
        <ul>
          {
            books.map((book) => {
              return <li key={book.id}>{book.title} ({book.genre})</li>
            })
          }
        </ul>
      </div>
    </>
  )
}

export default App
