import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TiTickOutline } from 'react-icons/ti';
import { AiFillDelete } from 'react-icons/ai';

function App() {
  const [month, setMonth] = useState("");
  const [addTask, setAddTask] = useState("");
  const [data, setData] = useState(null);
  const [reqmonthName, setReqmonthName] = useState(null)

  /////////////////////////////////////////////////////////////////////////////////////////////////////DataFetch

  useEffect(() => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[Number(month.split("-")[1]) - 1];
    if (monthName) {
      setReqmonthName(monthName)
      async function fetchData() {
        try {
          const req = { month: monthName };
          const response = await axios.post("http://localhost:8080/tasks", req);
          setData(response.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }
  }, [month]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////MonthName Functionality

  function monthChanger(e) {
    const { value } = e.target;
    setMonth(value);
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////Add Task Functionality
  function addTaskChangeHandler(e) {
    const { value } = e.target;
    setAddTask(value);
  }

  async function AddTaskSubmitHandler(key) {
    const req = { month: reqmonthName, day: `${key}`, task: addTask, id: `${Math.random()}`, action: "addTask" }
    try {
      if (req.task === "") {
        alert("Task Input can't be empty  ")
        return
      }
      await axios.post("http://localhost:8080/api/tasks", req)
      setAddTask("");
    } catch (error) {
      console.log(error);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////Delete functionality

  async function deleteTask(key, id) {
    const req = { month: reqmonthName, day: `${key}`, id: `${id}`, action: "deleteTask" }
    try {
      await axios.post("http://localhost:8080/api/tasks", req)
    } catch (error) {
      console.log(error);
    }

  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Mark Complete Functionality

  async function markComplete(key, id) {
    const req = { month: reqmonthName, day: `${key}`, id: `${id}`, action: "markComplete" }
    try {
      await axios.post("http://localhost:8080/api/tasks", req)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="flex flex-col items-center p-1 border shadow-md gap-2 bg-slate-900 h-screen">
      <p
        className='text-yellow-50 bg-slate-500 border shadow-md p-2 rounded-md font-semibold text-2xl '>
        AWESOME TO-DO APP
      </p>
      <div
        className='flex w-full justify-center items-center p-2 bg-blue-500 rounded-md border shadow-md gap-4 text-yellow-50 font-semibold text-2xl '>
        <p>
          SELECT MONTH
        </p>
        <input
          type='month'
          onChange={monthChanger}
          value={month}
          className='text-black' />
      </div>
      <div
        className='flex flex-row overflow-x-auto w-full shadow-md ' >
        {data && data.map((dayData) => {
          const dayKey = Object.keys(dayData)[0];
          const { dayName, tasks } = dayData[dayKey];
          return (
            <div
              key={dayKey}
              className='border p-2 mt-2 full flex flex-col  items-center gap-2 '>
              <h2
                className='flex flex-col p-2  bg-green-300 shadow-md rounded-md  justify-center items-center font-semibold '>
                <div>{dayName}</div>
                <div>{dayKey}</div>
              </h2>
              <ul
                className='flex flex-col justify-center w-80 items-center gap-3 ' >
                {tasks.map((task, index) => (
                  <li key={index}
                    className='bg-black text-white text-xl p-2  border border-white rounded-lg gap-3 flex shadow-md'>
                    <button
                      onClick={() => markComplete(dayKey, task.taskid)}
                      className={task.status !== "pending" ? "text-green-500" : ""} >
                      <TiTickOutline />
                    </button>
                    {task.task}
                    <button
                      onClick={() => deleteTask(dayKey, task.taskid)} >
                      <AiFillDelete />
                    </button>
                  </li>
                ))}
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className='gap-2 w-full flex justify-center items-center' >
                  <input onChange={addTaskChangeHandler} value={addTask} />
                  <button
                    onClick={() => AddTaskSubmitHandler(dayKey)}
                    className='bg-yellow-400 border shadow-md border-black p-1 rounded-md font-semibold '  >
                    Add Task
                  </button>
                </form>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
