import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext(null);
export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  useEffect(() => {
    const savedUser = localStorage.getItem('scoutUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  const saveUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem('scoutUser', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('scoutToken', token);
    }
  };
  const updatePlayerState = async updatedData => {
    try {
      setUser(prevUser => {
        let newUser;
        if (!prevUser.player && updatedData.userEmail) {
          newUser = {
            ...prevUser,
            player: updatedData,
            role: 'user'
          };
        } else {
          const updatedPlayer = prevUser.player ? {
            ...prevUser.player,
            ...updatedData
          } : null;
          const newStatus = updatedPlayer?.status || prevUser.player?.status;
          const isApprovedPlayer = newStatus === 'approved' || newStatus === 'final_accepted';
          newUser = {
            ...prevUser,
            player: updatedPlayer,
            role: isApprovedPlayer ? 'player' : 'user',
            image: updatedData.image || prevUser.image
          };
        }
        localStorage.setItem('scoutUser', JSON.stringify(newUser));
        return newUser;
      });
    } catch (err) {
      console.error('Error syncing user data:', err);
    }
  };
  const login = async (email, password) => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const adminRes = await fetch(`${API_URL}/admins/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password
        })
      });
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        const fullAdmin = {
          ...adminData.admin,
          role: adminData.admin.role
        };
        saveUser(fullAdmin, adminData.token);
        navigate('/dashboard');
        return {
          success: true,
          role: fullAdmin.role
        };
      }
      const userRes = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password
        })
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        const account = userData.user;
        const playerRes = await fetch(`${API_URL}/players?userEmail=${encodeURIComponent(account.email)}`);
        const players = playerRes.ok ? await playerRes.json() : [];
        const playerInfo = players[0] || null;
        const playerStatus = playerInfo?.status;
        const isApprovedPlayer = playerStatus === 'approved' || playerStatus === 'final_accepted';
        const fullUser = {
          ...account,
          role: isApprovedPlayer ? 'player' : 'user',
          player: playerInfo
        };
        saveUser(fullUser, userData.token);
        navigate(isApprovedPlayer ? '/profile' : '/');
        return {
          success: true,
          role: fullUser.role
        };
      }
      return {
        success: false,
        message: 'بيانات الدخول غير صحيحة'
      };
    } catch (err) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالسيرفر'
      };
    }
  };
  const register = async (userData, isPlayer) => {
    try {
      const normalizedEmail = userData.email.toLowerCase().trim();
      const sharedImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`;
      const userRes = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userData.username,
          email: normalizedEmail,
          password: userData.password,
          phone: userData.phone,
          image: sharedImage
        })
      });
      const result = await userRes.json();
      if (!userRes.ok) {
        return {
          success: false,
          message: result.message || 'خطأ أثناء إنشاء الحساب'
        };
      }
      if (isPlayer) {
        await fetch(`${API_URL}/players`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userEmail: normalizedEmail,
            name: userData.fullName,
            nationalId: userData.nationalId,
            position: userData.position,
            age: userData.age,
            location: userData.location,
            height: '175',
            weight: '70',
            preferredFoot: userData.preferredFoot,
            currentClub: 'لاعب حر',
            videoUrl: userData.videoUrl || '',
            rating: '0.0',
            status: 'pending',
            tags: [],
            image: sharedImage,
            skills: {
              pace: 0,
              shooting: 0,
              passing: 0,
              dribbling: 0,
              defending: 0,
              physical: 0
            }
          })
        });
      }
      await login(normalizedEmail, userData.password);
      return {
        success: true
      };
    } catch (err) {
      return {
        success: false,
        message: 'خطأ أثناء إنشاء الحساب'
      };
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('scoutUser');
    localStorage.removeItem('scoutToken');
    navigate('/login');
  };
  return <AuthContext.Provider value={{
    user,
    currentUser: user,
    login,
    register,
    logout,
    loading,
    updatePlayerState
  }}>
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
