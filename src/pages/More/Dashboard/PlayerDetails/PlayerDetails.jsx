import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from '../../../../utils/swalAlert';
import CheckVedio from './CheckVedio/CheckVedio';
import TestPlayer from './TestPlayer/TestPlayer';
import FinalAccept from './FinalAccept/FinalAccept';
import FinalAcceptedProfile from './FinalAcceptedProfile/FinalAcceptedProfile';
const PlayerDetails = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userImage, setUserImage] = useState(null);
  const [skills, setSkills] = useState({
    pace: 5,
    shooting: 5,
    passing: 5,
    dribbling: 5,
    defending: 5,
    physical: 5
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [fieldTest, setFieldTest] = useState({
    date: '',
    time: '',
    location: '',
    coachName: '',
    isDone: false,
    finalStatus: ''
  });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  useEffect(() => {
    fetch(`${API_URL}/players/${id}`).then(res => {
      if (!res.ok) throw new Error('Player not found');
      return res.json();
    }).then(async data => {
      setPlayer(data);
      if (data.userEmail) {
        try {
          const usersRes = await fetch(`${API_URL}/users`);
          if (usersRes.ok) {
            const allUsers = await usersRes.json();
            const matchedUser = allUsers.find(u => u.email?.trim().toLowerCase() === data.userEmail?.trim().toLowerCase());
            if (matchedUser?.image) {
              setUserImage(matchedUser.image);
            }
          }
        } catch (e) {
          console.warn('مش قادر يجيب صورة اليوزر:', e);
        }
      }
      if (data.skills) setSkills(data.skills);
      if (data.tags) setSelectedTags(data.tags);
      if (data.fieldTest) {
        setFieldTest({
          date: data.fieldTest.date || '',
          time: data.fieldTest.time || '',
          location: data.fieldTest.location || '',
          coachName: data.fieldTest.coachName || '',
          isDone: data.fieldTest.isDone || false,
          finalStatus: data.fieldTest.finalStatus || ''
        });
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الوصول للاعب',
        background: '#1a1a1a',
        color: '#fff'
      });
      setLoading(false);
    });
  }, [id, API_URL]);
  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-yellow-500 text-xl animate-pulse italic font-black">EKTASHENFI LOADING...</div>
    </div>;
  if (!player) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[var(--color-text-white)]">
      <h2>اللاعب غير موجود!</h2>
    </div>;
  const hasFieldTestDetails = !!(fieldTest.date?.trim() && fieldTest.location?.trim());
  if (player.status === 'pending' && !hasFieldTestDetails) {
    return <CheckVedio player={player} userImage={userImage} skills={skills} setSkills={setSkills} selectedTags={selectedTags} setSelectedTags={setSelectedTags} API_URL={API_URL} navigate={navigate} />;
  }
  if (player.status === 'approved' && !hasFieldTestDetails) {
    return <TestPlayer player={player} userImage={userImage} fieldTest={fieldTest} setFieldTest={setFieldTest} API_URL={API_URL} navigate={navigate} />;
  }
  if (player.status === 'approved' && hasFieldTestDetails) {
    return <FinalAccept player={player} userImage={userImage} fieldTest={fieldTest} setFieldTest={setFieldTest} API_URL={API_URL} navigate={navigate} />;
  }
  if (player.status === 'final_accepted') {
    return <FinalAcceptedProfile player={player} userImage={userImage} API_URL={API_URL} />;
  }
  return <div className="min-h-screen dark:bg-[#0e1011] bg-[var(--color-bg-main)] dark:text-[var(--color-text-white)] text-[var(--color-text-gray)] flex flex-col items-center justify-center gap-4 font-sans" dir="rtl">
      <h2 className="text-2xl font-black text-[#D4AF37]">تم معالجة طلب اللاعب بنجاح 🎉</h2>
      <p className="dark:text-gray-400 font-bold">الحالة الحالية للاعب في النظام هي: 
        <span className="dark:text-[var(--color-text-white)] mr-2 bg-white/10 px-3 py-1 rounded-lg">
          {player.status === 'final_accepted' ? 'قبول نهائي' : player.status === 'final_rejected' ? 'رفض نهائي' : player.status}
        </span>
      </p>
      <button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-3 bg-[#D4AF37] text-black font-black rounded-xl hover:scale-105 transition-all text-sm">
        العودة لوحة التحكم
      </button>
    </div>;
};
export default PlayerDetails;
