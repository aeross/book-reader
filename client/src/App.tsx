import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [books, setBooks] = useState<any>([]);
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
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Books!</h1>
      <div className="card">
        <ul>
          {
            books.map((book: any) => {
              return <li key={book.id}>{book.title}</li>
            })
          }
        </ul>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
