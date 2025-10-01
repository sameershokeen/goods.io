import React from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/navbar/Sidebar'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import { Route, Routes } from 'react-router-dom'



const App = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App