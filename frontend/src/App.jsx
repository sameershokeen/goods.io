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
import { UserProvider } from "./contexts/UserContexts";
import Docs from './pages/Docs'
import Api from './pages/Api'
import Blog from './pages/Blog'
import HelpCenter from './pages/HelpCenter'

const App = () => {
  return (
    <div>
      <UserProvider>
        <Navbar />
        <Sidebar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/api" element={<Api />} />
          <Route path="/p2p" element={<P2P />} />
          <Route path="/marketplace/nft" element={<NFTMarketplace />} />
          <Route path="/launchpad/nftlaunchpad" element={<NFTLaunchpad />} />
          <Route path="/marketplace/coin" element={<CoinMarketplace />} />
          <Route path="/launchpad/coinlaunchpad" element={<CoinLaunchpad />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App