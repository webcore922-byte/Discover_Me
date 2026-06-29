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

  // ✅ الدالة دي بتتعامل مع 3 حالات:
  // 1. تحديث بيانات لاعب موجود (edit profile)
  // 2. تسجيل يوزر كلاعب جديد (upgrade) → player object جديد خالص
  // 3. تحديث صورة فقط
  const updatePlayerState = async (updatedData) => {
    try {
      setUser(prevUser => {
        let newUser;

        // الحالة دي: اليوزر مكنش عنده player وبيسجل كلاعب دلوقتي
        // updatedData هيكون player object جديد فيه userEmail
        if (!prevUser.player && updatedData.userEmail) {
          newUser = {
            ...prevUser,
            player: updatedData,
            // role بيفضل 'user' لأن الـ status لسه pending
            role: 'user',
          };
        } else {
          // الحالة دي: تحديث بيانات لاعب موجود
          const updatedPlayer = prevUser.player
            ? { ...prevUser.player, ...updatedData }
            : null;

          // تحديد الـ role بناءً على الـ status الجديد
          const newStatus = updatedPlayer?.status || prevUser.player?.status;
          const isApprovedPlayer =
            newStatus === 'approved' || newStatus === 'final_accepted';

          newUser = {
            ...prevUser,
            player: updatedPlayer,
            role: isApprovedPlayer ? 'player' : 'user',
            // لو الـ updatedData فيه image (تحديث صورة)
            image: updatedData.image || prevUser.image,
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
      const normalizedEmail = email.toLowerCase();

      // 1. البحث في جدول الأدمنز
      const adminRes = await fetch(`${API_URL}/admins?email=${normalizedEmail}&password=${password}`);
      const admins = await adminRes.json();

      if (admins.length > 0) {
        const adminData = admins[0];
        saveUser(adminData);
        navigate('/dashboard');
        return { success: true, role: adminData.role };
      }

      // 2. البحث في جدول المستخدمين
      const userRes = await fetch(`${API_URL}/users?email=${normalizedEmail}&password=${password}`);
      const users = await userRes.json();

      if (users.length > 0) {
        const userData = users[0];
        const playerRes = await fetch(`${API_URL}/players?userEmail=${userData.email}`);
        const players = await playerRes.json();
        const playerInfo = players[0] || null;

        const playerStatus = playerInfo?.status;
        const isApprovedPlayer =
          playerStatus === 'approved' || playerStatus === 'final_accepted';

        const fullUser = {
          ...userData,
          role: isApprovedPlayer ? 'player' : 'user',
          player: playerInfo,
        };

        saveUser(fullUser);
        navigate(isApprovedPlayer ? '/profile' : '/');
        return { success: true, role: fullUser.role };
      }

      return { success: false, message: 'بيانات الدخول غير صحيحة' };
    } catch (err) {
      return { success: false, message: 'خطأ في الاتصال بالسيرفر' };
    }
  };

  const register = async (userData, isPlayer) => {
    try {
      const normalizedEmail = userData.email.toLowerCase();

      const allUsersRes = await fetch(`${API_URL}/users`);
      const allUsers = await allUsersRes.json();

      // ✅ المقارنة بـ toLowerCase عشان منتقبلش إيميل مكرر بكابيتال مختلف
      if (allUsers.some(u => u.email.toLowerCase() === normalizedEmail))
        return { success: false, message: 'الإيميل مكرر' };

      const sharedImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`;

      const userRes = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          email: normalizedEmail,
          password: userData.password,
          phone: userData.phone,
          image: sharedImage,
          createdAt: new Date().toISOString(),
        }),
      });

      const newUser = await userRes.json();

      if (isPlayer && userRes.ok) {
        await fetch(`${API_URL}/players`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            skills: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 },
          }),
        });
      }

      // ✅ بنبعت الإيميل بـ toLowerCase عشان يتطابق مع اللي اتخزن في الـ DB
      await login(normalizedEmail, userData.password);
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
    <AuthContext.Provider
      value={{ user, currentUser: user, login, register, logout, loading, updatePlayerState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);