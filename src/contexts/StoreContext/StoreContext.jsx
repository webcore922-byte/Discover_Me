import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext/AuthContext';
import { authJsonHeader } from '../../utils/authHeader';
import Swal from '../../utils/swalAlert';
const Context = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
export const StoreProvider = ({
  children
}) => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
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
  const handleError = msg => {
    setError(msg);
    setLoad(false);
  };
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: "GET",
        headers: authJsonHeader()
      });
      if (!res.ok) return;
      const data = await res.json();
      setCart(Array.isArray(data.items) ? data.items : []);
    } catch {}
  }, [user]);
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  const getproduct = async () => {
    try {
      const req = await fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const res = await req.json();
      setProducts(Array.isArray(res) ? res : []);
      setLoad(false);
    } catch (e) {
      setError("حدث خطأ في تحميل البيانات، يرجى المحاولة لاحقاً");
      setLoad(false);
    }
  };
  useEffect(() => {
    getproduct();
  }, []);
  useEffect(() => {
    const revalidate = () => {
      if (document.visibilityState === "visible") {
        getproduct();
      }
    };
    window.addEventListener("focus", revalidate);
    document.addEventListener("visibilitychange", revalidate);
    return () => {
      window.removeEventListener("focus", revalidate);
      document.removeEventListener("visibilitychange", revalidate);
    };
  }, []);
  const handleSetCategory = category => {
    setSelectcategory(category);
    if (category) {
      localStorage.setItem("selectedCategory", category);
    } else {
      localStorage.removeItem("selectedCategory");
    }
  };
  const addToCart = product => {
    if (!user) {
      Swal.fire({
        title: 'يجب تسجيل الدخول',
        text: 'سجّل دخولك أولاً عشان تقدر تضيف منتجات للسلة وتكمل عملية الشراء',
        icon: 'warning',
        confirmButtonColor: '#D4AF37',
        confirmButtonText: 'تسجيل الدخول',
        showCancelButton: true,
        cancelButtonText: 'إلغاء'
      }).then(result => {
        if (result.isConfirmed) navigate('/login');
      });
      return;
    }
    setCart(prevCart => {
      const isExist = prevCart.find(item => item.id == product.id);
      if (isExist) {
        return prevCart.map(item => item.id == product.id ? {
          ...item,
          count: item.count + 1
        } : item);
      }
      return [...prevCart, {
        ...product,
        count: 1
      }];
    });
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
    (async () => {
      try {
        const res = await fetch(`${API_URL}/cart/items`, {
          method: "POST",
          headers: authJsonHeader(),
          body: JSON.stringify({
            productId: product.id,
            count: 1
          })
        });
        if (res.ok) {
          const data = await res.json();
          setCart(Array.isArray(data.items) ? data.items : []);
        } else {
          fetchCart();
        }
      } catch {
        fetchCart();
      }
    })();
  };
  const updateItemCount = async (id, newCount) => {
    try {
      const res = await fetch(`${API_URL}/cart/items/${id}`, {
        method: "PUT",
        headers: authJsonHeader(),
        body: JSON.stringify({
          count: newCount
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCart(Array.isArray(data.items) ? data.items : []);
      } else {
        fetchCart();
      }
    } catch {
      fetchCart();
    }
  };
  const increment = id => {
    const current = cart.find(item => item.id == id);
    const newCount = (current?.count || 0) + 1;
    setCart(prevCart => prevCart.map(item => item.id == id ? {
      ...item,
      count: newCount
    } : item));
    updateItemCount(id, newCount);
  };
  const decrement = id => {
    const current = cart.find(item => item.id == id);
    if (!current || current.count <= 1) return;
    const newCount = current.count - 1;
    setCart(prevCart => prevCart.map(item => item.id == id ? {
      ...item,
      count: newCount
    } : item));
    updateItemCount(id, newCount);
  };
  const updateQuantity = (id, newCount) => {
    const safeCount = newCount > 0 ? newCount : 1;
    setCart(prevCart => prevCart.map(item => item.id === id ? {
      ...item,
      count: safeCount
    } : item));
    updateItemCount(id, safeCount);
  };
  const del = async id => {
    setCart(prevCart => prevCart.filter(item => item.id != id));
    try {
      const res = await fetch(`${API_URL}/cart/items/${id}`, {
        method: "DELETE",
        headers: authJsonHeader()
      });
      if (res.ok) {
        const data = await res.json();
        setCart(Array.isArray(data.items) ? data.items : []);
      } else {
        fetchCart();
      }
    } catch {
      fetchCart();
    }
  };
  const reset = () => {
    setCart(prevCart => prevCart.map(item => ({
      ...item,
      count: 1
    })));
    cart.forEach(item => updateItemCount(item.id, 1));
  };
  const empty = async () => {
    setCart([]);
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: "DELETE",
        headers: authJsonHeader()
      });
      if (res.ok) {
        const data = await res.json();
        setCart(Array.isArray(data.items) ? data.items : []);
      }
    } catch {}
  };
  let total = 0;
  cart.forEach(({
    price,
    count
  }) => total += price * count);
  return <Context.Provider value={{
    products,
    setProducts,
    getproduct,
    cart,
    setCart,
    addToCart,
    increment,
    decrement,
    del,
    reset,
    empty,
    total,
    selectcategory,
    setSelectcategory: handleSetCategory,
    search,
    setSearch,
    load,
    setLoad,
    addedProductId,
    setAddedProductId,
    updateQuantity,
    showAll,
    setShowAll,
    handleError,
    error,
    setError
  }}>
      {children}
    </Context.Provider>;
};
export const useStore = () => {
  const context = useContext(Context);
  return context;
};
