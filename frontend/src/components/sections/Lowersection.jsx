import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AutoSlider = () => {
  const sliderRef = useRef(null);

  const cards = [
    { id: 1, title: "NFT Marketplace", desc: "Buy & sell digital assets" },
    { id: 2, title: "Token Swap", desc: "Instant crypto exchange" },
    { id: 3, title: "Staking", desc: "Earn passive income" },
    { id: 4, title: "Launchpad", desc: "Support new projects" },
    { id: 5, title: "DeFi Vaults", desc: "Smart yield strategies" },
    { id: 6, title: "Lending & Borrowing", desc: "Decentralized finance" },
    { id: 7, title: "DAOs", desc: "Governance & voting" },
    { id: 8, title: "Gaming Assets", desc: "Own in-game items" },
  ];

  useEffect(() => {
    const slider = sliderRef.current;

    gsap.to(slider, {
      x: "-100%",
      duration: 20,
      ease: "linear",
      repeat: -1,
    });
  }, []);

  return (
    <div className=" overflow-hidden bg-[#0F0F10] py-6 ">
      <h1 className="p-2 text-2xl text-gray-400">Offering by Us</h1>
      <div
        ref={sliderRef}
        className="flex gap-6 w-[200%]" // duplicated width for loop effect
      >
        {[...cards, ...cards].map((card, index) => (
          <div
            key={index}
            className="min-w-[250px] bg-[#1A1B1E] border border-gray-700 px-6 py-4 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
              {card.title}
            </h3>
            <p className="text-gray-400 text-sm mt-2">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;
