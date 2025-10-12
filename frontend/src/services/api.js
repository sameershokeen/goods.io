const API_URL = "http://localhost:5173"; // <-- or your backend port

export const getUser = async (walletAddress) => {
  const res = await fetch(`${API_URL}/api/users/${walletAddress}`);
  return res.json();
};

export const registerUser = async (walletAddress) => {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet_address: walletAddress }),
  });
  return res.json();
};
