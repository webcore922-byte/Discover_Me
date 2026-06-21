import { createContext, useContext, useState, useEffect } from "react";
const Context = createContext();
export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("myStoreCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
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
    localStorage.setItem("myStoreCart", JSON.stringify(cart));
  }, [cart]);
  const getproduct = async () => {
    try {
      const url = import.meta.env.VITE_API_URL;
      const req = await fetch(`${url}/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const res = await req.json();
      setProducts(res);
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
          item.id == product.id ? { ...item, count: item.count + 1 } : item,
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
  };const updateQuantity = (id, newCount) => {
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
        products,
        setProducts,getproduct,
        cart,setCart,addToCart,increment,decrement,del,reset,empty,total,
        selectcategory,setSelectcategory:handleSetCategory,search,setSearch,
        load,setLoad,
        addedProductId,setAddedProductId,
        updateQuantity,showAll, setShowAll,handleError,error,setError
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
