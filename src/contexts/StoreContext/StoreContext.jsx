import React, { createContext, useState, useEffect, useContext } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const sportsData = [
    {
      id: 1,
      title: "حذاء كرة قدم مرلين للرجال من بلو بيرد",
      price: 349,
      image: "/download (1).webp",
    },
    {
      id: 2,
      title: "Adidas Al Nassr FC",
      price: 689,
      image: "/Adidas-Al-Nassr-FC-2526-Home-Yellow-Jersey-768x768.jpg",
    },
    {
      id: 3,
      title: "Al Hilal Kit - الهلال",
      price: 299,
      image: "/download.webp",
    },
    {
      id: 4,
      title: "World Ball",
      price: 149,
      image: "/World Ball.avif",
    },
    {
      id: 5,
      title: "Real Madrid World Ball",
      price: 349,
      image: "/M World Ball.avif",
    },
    {
      id: 6,
      title: "Nike Mercurial Boots",
      price: 749,
      image: "/download (2).webp",
    },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts(sportsData);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <StoreContext.Provider value={{ products, cart, loading, addToCart }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
