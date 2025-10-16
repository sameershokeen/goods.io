import React from 'react'
import Lowersection from "../components/sections/Lowersection";
import Uppersection from "../components/sections/Uppersection";
import Verticalsection from "../components/sections/Verticalsection";
const Home = () => {
  return (
    <div className="pl-18 pt-16  flex justify-between p-1">
      <div className='w-3/4 pr-2'>
        <Uppersection />
        <Lowersection />
      </div>
      <div className='w-1/4 pt-4'>
        <Verticalsection />
      </div>
    </div>
  );
}

export default Home
