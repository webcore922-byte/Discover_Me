import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext/AuthContext';
import Swal from 'sweetalert2';

const compressImage = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 400;
      const scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
      callback(dataUrl);
    };
  };
};

const useProfileData = () => {
  const { user, logout, updatePlayerState } = useAuth();
  const location = useLocation();
  const [showCongrats, setShowCongrats] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const [upgradeData, setUpgradeData] = useState({
    nationalId: '',
    position: '',
    age: '',
    location: '',
    preferredFoot: '',
    videoUrl: '',
  });

  const [editData, setEditData] = useState({
    currentClub: '',
    location: '',
    age: '',
    videoUrl: '',
    height: '',
    weight: '',
    preferredFoot: '',
    image: '',
  });

  const isAdmin =
    user?.role === 'admin' ||
    user?.role === 'Admin' ||
    user?.role === 'super_admin' ||
    user?.role === 'technical_coach' ||
    user?.role === 'camps_manager' ||
    user?.role === 'marketing_admin' ||
    user?.isAdmin === true ||
    user?.isAdmin === 'true' ||
    user?.username?.toLowerCase().includes('admin');

  const adminType = user?.role || (isAdmin ? 'Admin' : '');
  const status = user?.player ? user.player.status : null;

  const isPlayer =
    !isAdmin &&
    (user?.role === 'player' ||
      (user?.player &&
        (user.player.status === 'approved' ||
          user.player.status === 'final_accepted')));

  const isPendingOrRejectedPlayer =
    !isAdmin &&
    user?.player &&
    (user.player.status === 'pending' ||
      user.player.status === 'rejected' ||
      user.player.status === 'final_rejected');

  const isUser = !isAdmin && !isPlayer && !isPendingOrRejectedPlayer;

  useEffect(() => {
    if (location.state?.openUpgradeForm && !isAdmin) {
      setIsUpgrading(true);
    }

    if (isAdmin) {
      setEditData({
        currentClub: adminType,
        location: user?.location || 'الفرع الرئيسي',
        age: user?.age || '',
        videoUrl: '',
        height: user?.height || '',
        weight: user?.weight || '',
        preferredFoot: user?.preferredFoot || 'القدمين',
        image: user?.image || '',
      });
    } else if (user?.player) {
      setEditData({
        currentClub: user.player.currentClub || '',
        location: user.player.location || '',
        age: user.player.age || '',
        videoUrl: user.player.videoUrl || '',
        height: user.player.height || '',
        weight: user.player.weight || '',
        preferredFoot: user.player.preferredFoot || '',
        image: user.player.image || user.image || '',
      });
      if (user.player.status === 'approved' || user.player.status === 'final_accepted') {
        const hasSeenCongrats = localStorage.getItem(`congrats_seen_${user.player.id}`);
        if (!hasSeenCongrats) {
          setShowCongrats(true);
          localStorage.setItem(`congrats_seen_${user.player.id}`, 'true');
        }
      }
    } else {
      setEditData((prev) => ({ ...prev, image: user?.image || '' }));
    }
  }, [user, location, isAdmin, adminType]);

  const handleProfileImageChange = (e) => {
    if (isAdmin) return;
    if (e.target.files && e.target.files[0]) {
      Swal.fire({
        title: 'جاري معالجة الصورة...',
        allowOutsideClick: false,
        background: '#121212',
        color: '#fff',
        didOpen: () => Swal.showLoading(),
      });

      compressImage(e.target.files[0], async (compressedBase64) => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

          const userRes = await fetch(`${API_URL}/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: compressedBase64 }),
          });

          let updatedPlayerData = null;

          if (user.player && user.player.id) {
            const playerRes = await fetch(`${API_URL}/players/${user.player.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: compressedBase64 }),
            });
            if (playerRes.ok) {
              updatedPlayerData = await playerRes.json();
            }
          }

          if (userRes.ok) {
            setEditData((prev) => ({ ...prev, image: compressedBase64 }));
            if (updatedPlayerData) {
              updatePlayerState(updatedPlayerData);
            } else {
              updatePlayerState({ ...user, image: compressedBase64 });
            }
            Swal.fire({
              title: 'تم تحديث الصورة بنجاح!',
              icon: 'success',
              background: '#121212',
              color: '#fff',
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
            throw new Error();
          }
        } catch (err) {
          Swal.fire({
            title: 'خطأ',
            text: 'فشل في تحديث الصورة بالسيرفر',
            icon: 'error',
            background: '#121212',
            color: '#fff',
          });
        }
      });
    }
  };

  const handleUpgradeSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'جاري تسجيلك كلاعب...',
      allowOutsideClick: false,
      background: '#121212',
      color: '#fff',
      didOpen: () => Swal.showLoading(),
    });

    const currentProfileImage =
      editData.image ||
      user.image ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

    const newPlayerPayload = {
      userEmail: user.email,
      name: user.username,
      nationalId: upgradeData.nationalId,
      position: upgradeData.position,
      age: upgradeData.age,
      location: upgradeData.location,
      preferredFoot: upgradeData.preferredFoot,
      videoUrl: upgradeData.videoUrl,
      currentClub: 'لاعب حر',
      height: '175',
      weight: '70',
      rating: '0.0',
      status: 'pending',
      tags: [],
      image: currentProfileImage,
      skills: {
        pace: 0,
        shooting: 0,
        passing: 0,
        dribbling: 0,
        defending: 0,
        physical: 0,
      },
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayerPayload),
      });
      if (res.ok) {
        const createdPlayer = await res.json();
        updatePlayerState(createdPlayer);
        setIsUpgrading(false);
        Swal.fire({
          title: 'مبروك يا بطل!',
          text: 'تم إرسال بياناتك للمراجعة',
          icon: 'success',
          background: '#121212',
          color: '#fff',
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'خطأ',
        text: 'فشل في الاتصال بالسيرفر',
        icon: 'error',
        background: '#121212',
        color: '#fff',
      });
    }
  };

  const handleSave = async () => {
    Swal.fire({
      title: 'جاري الحفظ...',
      allowOutsideClick: false,
      background: '#121212',
      color: '#fff',
      didOpen: () => Swal.showLoading(),
    });
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const videoUrlChanged = editData.videoUrl !== (user.player.videoUrl || '');
      const shouldResetToPending = status === 'rejected' && videoUrlChanged;
      const payload = shouldResetToPending ? { ...editData, status: 'pending' } : editData;

      const response = await fetch(`${API_URL}/players/${user.player.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      const updatedPlayer = await response.json();
      updatePlayerState(updatedPlayer);
      Swal.fire({
        title: shouldResetToPending ? 'تم إعادة تقديم طلبك!' : 'تم الحفظ!',
        text: shouldResetToPending ? 'بياناتك قيد المراجعة من جديد ✅' : '',
        icon: 'success',
        background: '#121212',
        color: '#fff',
      });
    } catch (err) {
      Swal.fire({ title: 'خطأ', text: 'فشل الاتصال بالسيرفر', icon: 'error', background: '#121212' });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'خروج؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم',
      background: '#121212',
      color: '#fff',
    }).then((r) => {
      if (r.isConfirmed) logout();
    });
  };

  return {
    user,
    status,
    isAdmin,
    isPlayer,
    isPendingOrRejectedPlayer,
    isUser,
    adminType,
    showCongrats,
    isUpgrading,
    setIsUpgrading,
    editData,
    setEditData,
    upgradeData,
    setUpgradeData,
    handleProfileImageChange,
    handleUpgradeSubmit,
    handleSave,
    handleLogout,
  };
};

export default useProfileData;