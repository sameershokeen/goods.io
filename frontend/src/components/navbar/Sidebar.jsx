import React, { useRef } from "react";
import { Home, Store, Wallet, User, Settings, LogOut } from "lucide-react";
import { gsap } from "gsap";

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const textRefs = useRef([]);

  const menuItems = [
    { name: "Home", icon: <Home size={22} /> },
    { name: "Marketplace", icon: <Store size={22} /> },
    { name: "Wallet", icon: <Wallet size={22} /> },
    { name: "Profile", icon: <User size={22} /> },
    { name: "Settings", icon: <Settings size={22} /> },
    { name: "Logout", icon: <LogOut size={22} /> },
    { name: "Home", icon: <Home size={22} /> },
    { name: "Marketplace", icon: <Store size={22} /> },
    { name: "Wallet", icon: <Wallet size={22} /> },
    { name: "Profile", icon: <User size={22} /> },
    { name: "Settings", icon: <Settings size={22} /> },
    { name: "Logout", icon: <LogOut size={22} /> },
  ];

  const handleMouseEnter = () => {
    gsap.to(sidebarRef.current, {
      width: "220px",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(textRefs.current, {
      opacity: 1,
      duration: 0.2,
      stagger: 0.05,
      delay: 0.1,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(sidebarRef.current, {
      width: "70px",
      duration: 0.3,
      ease: "power2.inOut",
    });
    gsap.to(textRefs.current, {
      opacity: 0,
      duration: 0.2,
      stagger: 0.05,
    });
  };

  return (
    <div
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-screen bg-[#0F0F10] text-white fixed top-0 left-0 shadow-lg flex flex-col py-6 px-3 overflow-hidden border-r border-gray-700"
      style={{ width: "70px", transition: "width 0.3s ease" }}
    >
      <ul className="space-y-6">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-4 p-2 rounded-md hover:bg-[#1A1B1E] cursor-pointer"
          >
            <span>{item.icon}</span>
            <span
              ref={(el) => (textRefs.current[index] = el)}
              className="opacity-0 whitespace-nowrap text-sm bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent"
            >
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
