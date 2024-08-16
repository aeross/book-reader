import { useEffect, useState } from 'react'
import { Book } from '../API/types';
import agent from '../API/axios';
import Card from '../components/Card';
import { useAppDispatch, useAppSelector } from '../store/configureStore';
import { decrement, increment } from '../store/counterSlice';


function Home() {
  const dispatch = useAppDispatch();
  const { data, title } = useAppSelector(state => state.counter);

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

      <Card></Card>

      <h3>{title}</h3>
      <div>Count: {data}</div>
      <div className="flex gap-4">
        <button onClick={() => dispatch(increment(1))}>{"+"}</button>
        <button onClick={() => dispatch(decrement(1))}>{"-"}</button>
        <button onClick={() => dispatch(increment(5))}>{"+5"}</button>
        <button onClick={() => dispatch(decrement(5))}>{"-5"}</button>
      </div>
    </>
  )
}

export default Home
