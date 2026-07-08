import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext/AuthContext';
import { authJsonHeader } from '../../../utils/authHeader';
import { uploadImage, UploadImageError } from '../../../utils/uploadImage';
import Swal from '../../../utils/swalAlert';
const useProfileData = () => {
  const {
    user,
    logout,
    updatePlayerState
  } = useAuth();
  const location = useLocation();
  const [showCongrats, setShowCongrats] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeData, setUpgradeData] = useState({
    nationalId: '',
    position: '',
    age: '',
    location: '',
    preferredFoot: '',
    videoUrl: ''
  });
  const [editData, setEditData] = useState({
    currentClub: '',
    location: '',
    age: '',
    videoUrl: '',
    height: '',
    weight: '',
    preferredFoot: '',
    image: ''
  });
  const isAdmin = user?.role === 'admin' || user?.role === 'Admin' || user?.role === 'super_admin' || user?.role === 'technical_coach' || user?.role === 'camps_manager' || user?.role === 'marketing_admin' || user?.isAdmin === true || user?.isAdmin === 'true' || user?.username?.toLowerCase().includes('admin');
  const adminType = user?.role || (isAdmin ? 'Admin' : '');
  const status = user?.player ? user.player.status : null;
  const isPlayer = !isAdmin && (user?.role === 'player' || user?.player && (user.player.status === 'approved' || user.player.status === 'final_accepted'));
  const isPendingOrRejectedPlayer = !isAdmin && user?.player && (user.player.status === 'pending' || user.player.status === 'rejected' || user.player.status === 'final_rejected');
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
        image: user?.image || ''
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
        image: user.player.image || user.image || ''
      });
      if (user.player.status === 'approved' || user.player.status === 'final_accepted') {
        const hasSeenCongrats = localStorage.getItem(`congrats_seen_${user.player.id}`);
        if (!hasSeenCongrats) {
          setShowCongrats(true);
          localStorage.setItem(`congrats_seen_${user.player.id}`, 'true');
        }
      }
    } else {
      setEditData(prev => ({
        ...prev,
        image: user?.image || ''
      }));
    }
  }, [user, location, isAdmin, adminType]);
  const handleProfileImageChange = e => {
    if (isAdmin) return;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      Swal.fire({
        title: 'جاري رفع الصورة...',
        text: 'من فضلك استنى شوية، بنرفع صورتك بجودة عالية',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
      (async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
          const uploadedUrl = await uploadImage(file, 'users');
          const userRes = await fetch(`${API_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: authJsonHeader(),
            body: JSON.stringify({
              image: uploadedUrl
            })
          });
          let updatedPlayerData = null;
          if (user.player && user.player.id) {
            const playerRes = await fetch(`${API_URL}/players/${user.player.id}`, {
              method: 'PATCH',
              headers: authJsonHeader(),
              body: JSON.stringify({
                image: uploadedUrl
              })
            });
            if (playerRes.ok) {
              updatedPlayerData = await playerRes.json();
            }
          }
          if (!userRes.ok) {
            throw new Error('فشل حفظ الصورة الجديدة في حسابك');
          }
          setEditData(prev => ({
            ...prev,
            image: uploadedUrl
          }));
          if (updatedPlayerData) {
            updatePlayerState(updatedPlayerData);
          } else {
            updatePlayerState({
              ...user,
              image: uploadedUrl
            });
          }
          Swal.fire({
            title: 'تم تحديث صورتك بنجاح!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (err) {
          const message = err instanceof UploadImageError ? err.message : err?.message || 'فشل في تحديث الصورة بالسيرفر، جرب تاني كمان شوية';
          Swal.fire({
            title: 'تعذر تحديث الصورة',
            text: message,
            icon: 'error'
          });
        }
      })();
    }
  };
  const handleUpgradeSubmit = async e => {
    e.preventDefault();
    Swal.fire({
      title: 'جاري تسجيلك كلاعب...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    const currentProfileImage = editData.image || user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
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
        physical: 0
      }
    };
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const res = await fetch(`${API_URL}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlayerPayload)
      });
      if (res.ok) {
        const createdPlayer = await res.json();
        updatePlayerState(createdPlayer);
        setIsUpgrading(false);
        Swal.fire({
          title: 'مبروك يا بطل!',
          text: 'تم إرسال بياناتك للمراجعة',
          icon: 'success'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'خطأ',
        text: 'فشل في الاتصال بالسيرفر',
        icon: 'error'
      });
    }
  };
  const handleSave = async () => {
    Swal.fire({
      title: 'جاري الحفظ...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const videoUrlChanged = editData.videoUrl !== (user.player.videoUrl || '');
      const shouldResetToPending = status === 'rejected' && videoUrlChanged;
      const payload = shouldResetToPending ? {
        ...editData,
        status: 'pending'
      } : editData;
      const response = await fetch(`${API_URL}/players/${user.player.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error();
      const updatedPlayer = await response.json();
      updatePlayerState(updatedPlayer);
      Swal.fire({
        title: shouldResetToPending ? 'تم إعادة تقديم طلبك!' : 'تم الحفظ!',
        text: shouldResetToPending ? 'بياناتك قيد المراجعة من جديد ✅' : '',
        icon: 'success'
      });
    } catch (err) {
      Swal.fire({
        title: 'خطأ',
        text: 'فشل الاتصال بالسيرفر',
        icon: 'error',
        background: '#121212'
      });
    }
  };
  const handleLogout = () => {
    Swal.fire({
      title: 'خروج؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم'
    }).then(r => {
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
    handleLogout
  };
};
export default useProfileData;
