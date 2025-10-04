import React from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/navbar/Sidebar'
import Home from './pages/Home'
import NFTMarketplace from './pages/NFTMarketplace'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import { Route, Routes } from 'react-router-dom'
import CoinMarketplace from './pages/CoinMarketplace'
import NFTLaunchpad from './pages/NFTLaunchpad'
import CoinLaunchpad from './pages/CoinLaunchpad'
import P2P from './pages/P2P'



const App = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p2p" element={<P2P />} />
        <Route path="/marketplace/nft" element={<NFTMarketplace />} />
        <Route path="/launchpad/nftlaunchpad" element={<NFTLaunchpad />} />
        <Route path="/marketplace/coin" element={<CoinMarketplace />} />
        <Route path="/launchpad/coinlaunchpad" element={<CoinLaunchpad />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App