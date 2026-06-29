import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from '../AuthContext/AuthContext'; 

const Context = createContext();

const markBestSellers = async (products) => {
  if (!products.length) return products;

  const sorted = [...products].sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));
  const top20PercentCount = Math.max(1, Math.ceil(sorted.length * 0.2));
  const threshold = sorted[top20PercentCount - 1].salesCount ?? 0;

  const url = import.meta.env.VITE_API_URL;

  await Promise.all(
    products.map((product) =>
      fetch(`${url}/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isBestSeller: (product.salesCount ?? 0) >= threshold,
        }),
      })
    )
  );

  return products.map((product) => ({
    ...product,
    isBestSeller: (product.salesCount ?? 0) >= threshold,
  }));
};

export const StoreProvider = ({ children }) => {
  const { user } = useAuth();
  const cartKey = user?.id ? `myStoreCart_${user.id}` : null;

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectcategory, setSelectcategory] = useState(() => {
    return localStorage.getItem("selectedCategory") || null;
  });
  const [search, setSearch] = useState("");
  const [addedProductId, setAddedProductId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(null);

  const handleError = (msg) => {
    setError(msg);
    setLoad(false);
  };

  useEffect(() => {
    if (cartKey) {
      const savedCart = localStorage.getItem(cartKey);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setCart([]); 
    }
  }, [cartKey]);

 
  useEffect(() => {
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, cartKey]);

  const getproduct = async () => {
    try {
      const url = import.meta.env.VITE_API_URL;
      const req = await fetch(`${url}/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const res = await req.json();
      const updated = await markBestSellers(res);
      setProducts(updated);
      setLoad(false);
    } catch (e) {
      setError("حدث خطأ في تحميل البيانات، يرجى المحاولة لاحقاً");
      setLoad(false);
    }
  };

  useEffect(() => {
    getproduct();
  }, []);

  const handleSetCategory = (category) => {
    setSelectcategory(category);
    if (category) {
      localStorage.setItem("selectedCategory", category);
    } else {
      localStorage.removeItem("selectedCategory");
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const isExist = prevCart.find((item) => item.id == product.id);
      if (isExist) {
        return prevCart.map((item) =>
          item.id == product.id ? { ...item, count: item.count + 1 } : item
        );
      }
      return [...prevCart, { ...product, count: 1 }];
    });
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  const increment = (id) => {
    const newCart = cart.map((item) => {
      if (item.id == id) {
        return { ...item, count: item.count + 1 };
      }
      return item;
    });
    setCart(newCart);
  };

  const decrement = (id) => {
    const newCart = cart.map((item) => {
      if (item.id == id && item.count > 1) {
        return { ...item, count: item.count - 1 };
      }
      return item;
    });
    setCart(newCart);
  };

  const updateQuantity = (id, newCount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, count: newCount > 0 ? newCount : 1 }
          : item
      )
    );
  };

  const del = (id) => {
    const newCart = cart.filter((item) => item.id != id);
    setCart(newCart);
  };

  const reset = () => {
    const newReset = cart.map((item) => {
      return { ...item, count: 1 };
    });
    setCart(newReset);
  };

  const empty = () => {
    setCart([]);
  };

  let total = 0;
  cart.forEach(({ price, count }) => (total += price * count));

  return (
    <Context.Provider
      value={{
        products, setProducts, getproduct,
        cart, setCart, addToCart, increment, decrement, del, reset, empty, total,
        selectcategory, setSelectcategory: handleSetCategory,
        search, setSearch,
        load, setLoad,
        addedProductId, setAddedProductId,
        updateQuantity,
        showAll, setShowAll,
        handleError, error, setError,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStore = () => {
  const context = useContext(Context);
  return context;
};
