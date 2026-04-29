import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const savedUser = localStorage.getItem('scoutUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('scoutUser', JSON.stringify(userData));
  };

  const updatePlayerState = (updatedPlayerData) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, player: updatedPlayerData };
      localStorage.setItem('scoutUser', JSON.stringify(newUser));
      return newUser;
    });
  };

  const login = async (email, password) => {
    try {
      const adminRes = await fetch(`${API_URL}/admins?email=${email}&password=${password}`);
      const admins = await adminRes.json();
      
      if (admins.length > 0) {
        const adminData = { ...admins[0], role: 'admin' };
        saveUser(adminData);
        navigate('/dashboard');
        return { success: true, role: 'admin' };
      }

      const userRes = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
      const users = await userRes.json();
      
      if (users.length > 0) {
        const userData = users[0];
        const playerRes = await fetch(`${API_URL}/players?userEmail=${userData.email}`);
        const players = await playerRes.json();
        const playerInfo = players[0] || null;

        const isApproved = playerInfo && playerInfo.status === 'approved';
        
        const fullUser = { 
          ...userData, 
          role: isApproved ? 'player' : 'user', 
          player: playerInfo 
        };
        
        saveUser(fullUser);
        navigate(isApproved ? '/profile' : '/');
        return { success: true, role: fullUser.role };
      }
      
      return { success: false, message: 'بيانات الدخول غير صحيحة' };
    } catch (err) { 
      return { success: false, message: 'خطأ في الاتصال بالسيرفر' }; 
    }
  };

  const register = async (userData, isPlayer) => {
    try {
      const cleanPhone = String(userData.phone).trim();
      const allUsersRes = await fetch(`${API_URL}/users`);
      const allUsers = await allUsersRes.json();

      if (allUsers.some(u => u.username === userData.username)) return { success: false, message: 'اسم المستخدم مكرر' };
      if (allUsers.some(u => u.email === userData.email)) return { success: false, message: 'الإيميل مكرر' };
      if (allUsers.some(u => u.phone === cleanPhone)) return { success: false, message: 'الموبايل مكرر' };

      const userRes = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          phone: cleanPhone,
          createdAt: new Date().toISOString()
        })
      });

      const newUser = await userRes.json();

      if (isPlayer && userRes.ok) {
        await fetch(`${API_URL}/players`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: newUser.email,
            name: userData.fullName,
            nationalId: userData.nationalId,
            position: userData.position,
            age: userData.age,
            location: userData.location,
            height: "175", 
            weight: "70",
            preferredFoot: userData.preferredFoot,
            currentClub: "لاعب حر",
            videoUrl: userData.videoUrl || "",
            rating: "0.0",
            status: "pending",
            tags: [],
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`
          })
        });
      }

      await login(userData.email, userData.password);
      return { success: true };
    } catch (err) { 
      return { success: false, message: 'خطأ أثناء إنشاء الحساب' }; 
    }
  };

  const logout = () => { 
    setUser(null); 
    localStorage.removeItem('scoutUser'); 
    navigate('/login'); 
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      currentUser: user, 
      login, 
      register, 
      logout, 
      loading, 
      updatePlayerState 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);