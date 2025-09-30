import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="w-full bg-[#0F0F10] text-white py-3 px-6 flex items-center justify-between shadow-lg fixed top-0 left-0 z-50 border-b border-gray-700"
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="text-2xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
          DeMarket
        </div>

        {/* Search Box */}
        <div className="hidden md:flex">
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#1A1B1E] text-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {/* Connect Wallet Button */}
        <button className="bg-purple-600 hover:bg-purple-500 transition px-4 py-2 rounded-lg font-medium text-white">
          Connect Wallet
        </button>

        {/* Profile Icon */}
        <div className="w-10 h-10 bg-[#1A1B1E] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#26272B] transition">
          <span className="text-lg">👤</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
