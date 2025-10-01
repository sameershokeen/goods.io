import React from "react";
import Uppersection from "../components/sections/Uppersection";
import Lowersection from "../components/sections/Lowersection";
import Verticalsection from "../components/sections/Verticalsection";

const Home = () => {
  return (
    <div className="w-full h-full pl-20 pt-16 rounded-lg shadow-lg flex pr-2 overflow-auto">
      {/* LEFT SECTION (75%) */}
      <div className="w-[75%] border-r border-gray-600 pr-4">
        <Uppersection />
        <Lowersection />
        <Lowersection />
      </div>

      {/* RIGHT SECTION (25%) */}
      <div className="w-[25%] pl-4 flex justify-end pt-4">
        <Verticalsection />
      </div>
    </div>
  );
};

export default Home;
