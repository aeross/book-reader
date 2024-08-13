import { useEffect, useState } from 'react'
import { Book } from './types/book';


function App() {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    async function fetchBooksRandom() {
      try {
        const data = await fetch("http://localhost:5030/book/random");
        if (data.ok) {
          const jsonData = await data.json();
          setBooks(jsonData.data);
        }
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
