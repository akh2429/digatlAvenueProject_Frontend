import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [month, setMonth] = useState("");
  const [data, setData] = useState(null);
  function monthChanger(e) {
    const { value } = e.target;
    setMonth(value)
  }

  useEffect(() => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[Number(month.split("-")[1] - 1)];
    if (monthName) {
      async function fetchData() {
        try {
          const req = { month: monthName };
          const response = await axios.post("http://localhost:8080/tasks", req);
          setData(response.data);
        }
        catch (error) {
          console.log(error)
        }
      }
      fetchData();
    }
  }, [monthChanger]);

  return (
    <div
      className="flex flex-col justify-center items-center  font-semibold text-2xl p-1 border shadow-md gap-2 bg-slate-400   ">
      <p
        className='text-yellow-50  bg-slate-500  border shadow-md p-2 rounded-md ' >
        AWESOME TO-DO APP
      </p>
      <div
        className='flex w-full  justify-center items-center p-2  bg-blue-500 rounded-md  border shadow-md gap-4 text-yellow-50  ' >
        <p>SELECT MONTH</p>
        <input type='month' onChange={monthChanger} value={month} className='text-black' />
      </div>
    </div>
  );
}

export default App;
