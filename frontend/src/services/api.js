const API_BASE = "http://localhost:5000/api"; // Backend server URL

export const getUser = async (walletAddress) => {
  const res = await fetch(`${API_BASE}/users/${walletAddress}`);
  if (!res.ok) return null;
  return res.json();
};

export const registerUser = async (walletAddress) => {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet_address: walletAddress }),
  });
  return res.json();
};

export const updateUserProfile = async (walletAddress, data) => {
  const res = await fetch(`${API_BASE}/users/${walletAddress}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Auth API functions
export const walletLogin = async (walletData) => {
  const res = await fetch(`${API_BASE}/auth/wallet-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(walletData),
  });
  return res.json();
};

export const updateProfile = async (profileData) => {
  const res = await fetch(`${API_BASE}/auth/update-profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  return res.json();
};

// Offers API functions
export const createOffer = async (offerData) => {
  const res = await fetch(`${API_BASE}/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offerData),
  });
  return res.json();
};

export const getOffers = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/offers?${queryParams}`);
  return res.json();
};

export const getOfferById = async (offerId) => {
  const res = await fetch(`${API_BASE}/offers/${offerId}`);
  return res.json();
};

// Trades API functions
export const createTrade = async (tradeData) => {
  const res = await fetch(`${API_BASE}/trades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tradeData),
  });
  return res.json();
};

export const getUserTrades = async (walletAddress) => {
  const res = await fetch(`${API_BASE}/trades/${walletAddress}`);
  return res.json();
};

export const updateTradeStatus = async (tradeId, statusData) => {
  const res = await fetch(`${API_BASE}/trades/${tradeId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statusData),
  });
  return res.json();
};
