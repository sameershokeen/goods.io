import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Store,
  CreditCard,
  Rocket,
  Layers,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { gsap } from "gsap";

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const textRefs = useRef([]);
  const itemRefs = useRef([]);

  const menuItems = [
    { name: "Home", icon: <Home size={22} />, path: "/" },
    {
      name: "NFT Marketplace",
      icon: <Store size={22} />,
      path: "/marketplace/nft",
    },
    {
      name: "Coin Marketplace",
      icon: <CreditCard size={22} />,
      path: "/marketplace/coin",
    },
    {
      name: "Coin Launchpad",
      icon: <Rocket size={22} />,
      path: "/launchpad/coinlaunchpad",
    },
    {
      name: "NFT Launchpad",
      icon: <Layers size={22} />,
      path: "/launchpad/nftlaunchpad",
    },
    { name: "P2P Place", icon: <Store size={22} />, path: "/p2p" },
    { name: "Wallet", icon: <CreditCard size={22} />, path: "/wallet" },
    { name: "Profile", icon: <User size={22} />, path: "/profile" },
    { name: "Settings", icon: <Settings size={22} />, path: "/settings" },
    { name: "Logout", icon: <LogOut size={22} />, path: "/logout" },
  ];

  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

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
    gsap.to(textRefs.current, { opacity: 0, duration: 0.2, stagger: 0.05 });
  };

  const handleItemHover = (index) => {
    gsap.to(itemRefs.current[index], {
      scale: 1.08,
      x: 5,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleItemLeave = (index) => {
    gsap.to(itemRefs.current[index], {
      scale: 1,
      x: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-screen bg-[#0F0F10] text-white fixed top-0 left-0 z-50 shadow-lg flex flex-col py-6 px-3 overflow-hidden border-r border-gray-500"
      style={{ width: "70px", transition: "width 0.3s ease" }}
    >
      <ul className="space-y-6">
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              ref={(el) => (itemRefs.current[index] = el)}
              onMouseEnter={() => handleItemHover(index)}
              onMouseLeave={() => handleItemLeave(index)}
              className={({ isActive }) =>
                `flex items-center gap-4 p-2 rounded-md cursor-pointer hover:bg-gray-700 transition ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              <span>{item.icon}</span>
              <span
                ref={(el) => (textRefs.current[index] = el)}
                className="opacity-0 whitespace-nowrap text-sm bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent"
              >
                {item.name}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
