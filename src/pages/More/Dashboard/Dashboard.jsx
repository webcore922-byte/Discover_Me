import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const POSITION_OPTIONS = [
  { value: "حارس مرمى", label: "حارس مرمى (GK)" },
  { value: "قلب دفاع", label: "قلب دفاع (CB)" },
  { value: "ظهير أيمن", label: "ظهير أيمن (RB)" },
  { value: "ظهير أيسر", label: "ظهير أيسر (LB)" },
  { value: "وسط مدافع", label: "وسط مدافع (CDM)" },
  { value: "وسط ملعب", label: "وسط ملعب (CM)" },
  { value: "صانع ألعاب", label: "صانع ألعاب (CAM)" },
  { value: "جناح أيمن", label: "جناح أيمن (RW)" },
  { value: "جناح أيسر", label: "جناح أيسر (LW)" },
  { value: "مهاجم صريح", label: "مهاجم صريح (ST)" },
  { value: "مهاجم وهمي", label: "مهاجم وهمي (CF)" },
];

emailjs.init("IrYz-yNKPjZh7J3t2");

const Dashboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [activeTab, setActiveTab] = useState('pending');
  const [positionFilter, setPositionFilter] = useState('All'); 
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const sendStatusEmail = async (player, status, reason = "") => {
    const SERVICE_ID = "service_gcnbn55";
    const TEMPLATE_ID = "template_t4iawyc"; 
    
    const templateParams = {
      player_email: player.userEmail,
      player_name: player.name,
      status: status === 'approved' ? 'مقبول ✅' : 'مرفوض ❌',
      message: status === 'approved' 
  ? `ألف مبروك يا بطل! 🌟 تم قبول انضمامك لعائلة 'اكتشفني' بنجاح! ⚽ رحلتك نحو النجومية بدأت دلوقتي.. جهز مهاراتك، الملاعب مستنية موهبتك! 🔥 ادخل دلوقتي وورينا سحرك! 🚀`
  : `للأسف يا بطل، طلبك المرة دي لم يحالفه الحظ.. وده كان بسبـب: ${reason || 'عدم استيفاء الشروط الحالية'}. 🛑 لكن دي مش النهاية! دي مجرد بداية جديدة ليك عشان تشتغل على مهاراتك أكتر وتطور مستواك في الملعب. ⚽ استمر في التمرين، واحنا واثقين إننا هنشوفك أقوى المرة الجاية! 💪🔥`,
    };  
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    } catch (error) {
      console.error('Email failed:', error);
    }
  };

  const changePlayerStatus = async (player, newStatus) => {
    let reason = "";
    if (newStatus === 'rejected') {
      const { value: text } = await Swal.fire({
        title: 'سبب الرفض',
        input: 'textarea',
        inputPlaceholder: 'اكتب السبب هنا...',
        showCancelButton: true,
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ff4444',
      });
      if (text) reason = text;
      else return; 
    }

    try {
      const res = await fetch(`${API_URL}/players/${player.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await sendStatusEmail(player, newStatus, reason);
        setPlayers(players.map(p => p.id === player.id ? { ...p, status: newStatus } : p));
        Swal.fire({ 
          title: newStatus === 'approved' ? 'تم القبول وإرسال الإيميل' : 'تم الرفض وإرسال الإيميل', 
          icon: 'success', 
          background: '#1a1a1a', 
          color: '#D4AF37' 
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/players`);
      if (!res.ok) throw new Error('Server Error');
      const data = await res.json();
      setPlayers(data.sort((a, b) => b.id - a.id));
      setError(null);
    } catch (err) {
      setError("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlayers(); }, []);

  const handleDeletePlayer = async (playerId, playerName) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف اللاعب "${playerName}" نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4444',
      cancelButtonColor: '#444',
      confirmButtonText: 'نعم، قم بالحذف',
      background: '#1a1a1a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/players/${playerId}`, { method: 'DELETE' });
        if (res.ok) {
          setPlayers(players.filter(p => p.id !== playerId));
          Swal.fire({ title: 'تم الحذف!', icon: 'success', background: '#1a1a1a', color: '#fff' });
        }
      } catch (err) { console.error(err); }
    }
  };

  const updateRating = async (playerId, newRating) => {
    const ratingNum = parseFloat(newRating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) return;
    try {
      const res = await fetch(`${API_URL}/players/${playerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingNum.toFixed(1) }),
      });
      if (res.ok) {
        setPlayers(players.map(p => p.id === playerId ? { ...p, rating: ratingNum.toFixed(1) } : p));
      }
    } catch (err) { console.error(err); }
  };

  const filteredPlayers = players.filter(p => {
    const matchesTab = p.status === activeTab;
    const matchesPosition = positionFilter === 'All' || p.position === positionFilter;
    return matchesTab && matchesPosition;
  });

  if (loading) return (
    <div className="min-h-screen bg-[--color-bg-card] flex items-center justify-center">
      <div className="text-yellow-500 text-xl animate-pulse italic">EKTASHENFI LOADING...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[--color-bg-main] flex flex-col items-center justify-center text-white gap-4">
      <h2 className="text-2xl font-black text-yellow-500 uppercase">{error}</h2>
      <button onClick={fetchPlayers} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-yellow-500 hover:text-black transition-all font-bold">إعادة المحاولة 🔄</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[--color-bg-main] text-white p-4 md:p-10" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-yellow-500 italic uppercase">لوحة التحكم</h1>
          </div>
          <div className="flex gap-6">
            <StatCard label="المعتمدين" value={players.filter(p => p.status === 'approved').length} color="#D4AF37" />
            <StatCard label="الانتظار" value={players.filter(p => p.status === 'pending').length} color="#F2D472" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex bg-white/5 p-1 rounded-3xl border border-white/5 w-full md:max-w-md">
            <button onClick={() => setActiveTab('pending')} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${activeTab === 'pending' ? 'bg-yellow-500 text-black' : 'text-white/40'}`}>Pending</button>
            <button onClick={() => setActiveTab('approved')} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${activeTab === 'approved' ? 'bg-yellow-500 text-black' : 'text-white/40'}`}>Approved</button>
          </div>

          <select 
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-white outline-none"
          >
            <option value="All" className='bg-[--color-bg-main]'>جميع المراكز</option>
            {POSITION_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className='bg-[--color-bg-main]'>{opt.label}</option>)}
          </select>
        </div>

        <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-white/5 text-yellow-500 text-xs font-black uppercase">
                  <th className="p-6">اللاعب</th>
                  <th className="p-6 text-center">المركز</th>
                  <th className="p-6 text-center">السمات</th>
                  <th className="p-6 text-center">فيديو</th>
                  <th className="p-6 text-center">التقييم</th>
                  <th className="p-6 text-center">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPlayers.map(player => (
                  <tr key={player.id} className="hover:bg-white/5 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={player.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="font-bold text-lg">{player.name}</p>
                          <p className="text-xs text-gray-500">{player.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px]">{player.position}</span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex flex-wrap gap-1 justify-center max-w-[120px] mx-auto">
                        {player.tags && player.tags.map((tag, idx) => (
                          <span key={idx} className="text-[8px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <button onClick={() => window.open(player.videoUrl, '_blank')} className="text-red-500 hover:text-red-400">
                        ▶ فيديو
                      </button>
                    </td>
                    <td className="p-6 text-center">
                      <input 
                        type="number" step="0.1" max="10" min="0" 
                        defaultValue={player.rating} 
                        onBlur={(e) => updateRating(player.id, e.target.value)} 
                        className="w-16 bg-transparent border border-white/10 rounded text-center text-yellow-500 font-bold" 
                      />
                    </td>
                    <td className="p-6">
                      <div className="flex gap-2 justify-center">
                        {activeTab === 'pending' && (
                          <>
                            <button onClick={() => changePlayerStatus(player, 'approved')} className="px-4 py-2 bg-green-600/20 text-green-500 rounded-lg text-[10px] font-bold hover:bg-green-600 hover:text-white transition-all">ACCEPT</button>
                            <button onClick={() => changePlayerStatus(player, 'rejected')} className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all">REJECT</button>
                          </>
                        )}
                        <button onClick={() => navigate(`/dashboard/player/${player.id}`)} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-bold">EDIT</button>
                        <button onClick={() => handleDeletePlayer(player.id, player.name)} className="px-4 py-2 bg-red-900/20 text-red-700 rounded-lg text-[10px] font-bold">DEL</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/5 text-center min-w-[140px]">
    <p className="text-[10px] text-gray-500 mb-1">{label}</p>
    <p className="text-3xl font-black italic" style={{ color }}>{value}</p>
  </div>
);

export default Dashboard;