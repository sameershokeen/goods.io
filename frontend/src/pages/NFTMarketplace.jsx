import  { useEffect, useState } from "react";
import HeroSlider from "../components/nfts/Heroslider";
import TrendingNFTs from "../components/nfts/TrendingNFTs";
import NewLaunches from "../components/nfts/NewLanunches";
import CategorySlider from "../components/nfts/CategorySlider";
import NFTDisplay from "../components/nfts/NFTDisplay";

const NFTMarketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const apiKey = "CG-9rkGCe7k2CjukH443SjLY9zz";
        const res = await fetch("https://api.coingecko.com/api/v3/nfts/list", {
          headers: { "x-cg-demo-api-key": apiKey },
        });
        const data = await res.json();
        const first12 = data.slice(0, 12);
        const mapped = first12.map((nft) => ({
          id: nft.id,
          name: nft.name || "Unknown NFT",
          image: `https://picsum.photos/300/300?random=${Math.floor(
            Math.random() * 1000
          )}`,
          price: (Math.random() * 5).toFixed(2),
          supply: Math.floor(Math.random() * 1000),
          hype: Math.floor(Math.random() * 100),
        }));
        setNfts(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  if (loading)
    return (
      <p className="text-center text-white text-xl mt-10">Loading NFTs...</p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto pl-22 pt-22">
      <HeroSlider />
      <TrendingNFTs nfts={nfts} />
      <NewLaunches nfts={nfts} />
      <CategorySlider />
      <NFTDisplay nfts={nfts} />
    </div>
  );
};

export default NFTMarketplace;
