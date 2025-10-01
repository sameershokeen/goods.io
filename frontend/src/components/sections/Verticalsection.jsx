import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CryptoList = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      const url =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=30&page=1";
      const options = {
        method: "GET",
        headers: { "x-cg-demo-api-key": "CG-9rkGCe7k2CjukH443SjLY9zz" },
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  if (loading)
    return <p className="text-center text-xl text-white">Loading...</p>;

  return (
    <div className="w-full h-full">
      <div className="w-full h-full overflow-x-auto rounded-lg shadow-lg border-2 border-gray-700">
        <table className="w-full text-sm">
          <thead className="text-white uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Coin</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                className="border-b last:border-none hover:bg-pink-400 cursor-pointer"
              >
                <td className="px-4 py-3 flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium">{coin.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">
                      ${coin.current_price.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoList;
