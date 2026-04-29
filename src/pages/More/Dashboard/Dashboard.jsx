import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('الكل');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // جلب البيانات من السيرفر
  const fetchPlayers = async () => {
    try {
      const res = await fetch(`${API_URL}/players`);
      const data = await res.json();
      setPlayers(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching players:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // تحديث التقييم برقم عشري (9.5، الخ)
  const updateRating = async (playerId, newRating) => {
    const ratingNum = parseFloat(newRating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      Swal.fire({ title: 'خطأ', text: 'أدخل رقم بين 0 و 10', icon: 'error', background: '#121212', color: '#fff' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/players/${playerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingNum.toFixed(1) }),
      });

      if (res.ok) {
        setPlayers(players.map(p => p.id === playerId ? { ...p, rating: ratingNum.toFixed(1) } : p));
        Swal.fire({
          title: 'تم التحديث!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          background: '#1a1a1a',
          color: '#fff'
        });
      }
    } catch (err) {
      Swal.fire({ title: 'خطأ في الاتصال', icon: 'error', background: '#121212' });
    }
  };

  const filteredPlayers = filter === 'الكل' 
    ? players 
    : players.filter(p => p.position.includes(filter));

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[var(--color-gold-main)] text-2xl font-black italic animate-pulse">
        جارٍ تحميل بيانات الكشافين...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-12 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--color-gold-main)] italic uppercase">لوحة التحكم</h1>
            <p className="text-white/40 font-bold mt-2">نظام إدارة وتقييم المواهب</p>
          </div>
          <div className="flex gap-4">
            <StatCard label="المواهب" value={players.length} color="var(--color-gold-main)" />
            <StatCard label="بدون تقييم" value={players.filter(p => parseFloat(p.rating) === 0).length} color="#ff4444" />
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-[2rem] border border-white/5 flex gap-3 overflow-x-auto no-scrollbar bg-white/5">
          {['الكل', 'هجوم', 'خط وسط', 'جناح', 'دفاع'].map(pos => (
            <button 
              key={pos}
              onClick={() => setFilter(pos)}
              className={`px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap
                ${filter === pos ? 'bg-[var(--gold-gradient)] text-black shadow-[var(--gold-glow)]' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Players Table */}
        <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white/5 text-[var(--color-gold-main)] text-[10px] uppercase tracking-widest font-black">
                  <th className="p-8">اللاعب</th>
                  <th className="p-8">المركز</th>
                  <th className="p-8 text-center">التقييم</th>
                  <th className="p-8 text-center">تحديث التقييم</th>
                  <th className="p-8 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPlayers.map(player => (
                  <tr key={player.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <img src={player.image} className="w-14 h-14 rounded-full border-2 border-gold-main/20 object-cover" alt="" />
                        <div>
                          <p className="font-black text-xl italic group-hover:text-[var(--color-gold-main)] transition-colors">{player.name}</p>
                          <p className="text-[10px] text-white/30 font-bold uppercase">{player.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 font-bold">{player.position}</td>
                    <td className="p-8 text-center">
                      <span className="text-2xl font-black text-gold-main italic">{player.rating}</span>
                    </td>
                    <td className="p-8">
                      <div className="flex justify-center">
                        <input 
                          type="number" step="0.1" max="10" min="0"
                          defaultValue={player.rating}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateRating(player.id, e.target.value);
                          }}
                          onBlur={(e) => {
                            if (e.target.value !== player.rating) updateRating(player.id, e.target.value);
                          }}
                          className="w-24 bg-black border-2 border-white/10 rounded-2xl px-4 py-2 text-center font-black text-xl text-gold-main outline-none focus:border-gold-main"
                        />
                      </div>
                    </td>
                    <td className="p-8 text-left">
                       <button 
                         onClick={() => navigate(`/dashboard/player/${player.id}`)}
                         className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-gold-main hover:text-black transition-all"
                       >
                         View Details
                       </button>
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
  <div className="glass-card px-8 py-5 rounded-[2rem] border border-white/5 text-center min-w-[150px] bg-white/5">
    <p className="text-[10px] font-black uppercase text-white/40 mb-1">{label}</p>
    <p className="text-4xl font-black italic" style={{ color }}>{value}</p>
  </div>
);

export default Dashboard;