import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Eye, Mail, CheckCircle, XCircle, Clock, CalendarDays, UserCheck, ClipboardCheck, Award } from 'lucide-react';
import Swal from '../../utils/swalAlert';
const PlayersSection = ({
  activeTab
}) => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/players`);
      if (res.ok) {
        const data = await res.json();
        setPlayers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("خطأ أثناء جلب بيانات اللاعبين:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlayers();
  }, [activeTab, API_URL]);
  const handleMarkAsDone = async player => {
    Swal.fire({
      title: 'تأكيد حضور الاختبار ⚽',
      text: `هل أنت متأكد أن اللاعب (${player.name}) قد تم اختباره في الملعب بالفعل وجاهز لرصد تقييمه الفني؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، تم اختباره ✔️',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#ef4444',
      customClass: {
        popup: 'rounded-[1.5rem] border border-white/10 shadow-2xl'
      }
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const updatedFieldTest = {
            ...player.fieldTest,
            isDone: true
          };
          const res = await fetch(`${API_URL}/players/${player.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fieldTest: updatedFieldTest
            })
          });
          if (res.ok) {
            setPlayers(prev => prev.map(p => p.id === player.id ? {
              ...p,
              fieldTest: updatedFieldTest
            } : p));
            navigate(`/dashboard/player/${player.id}`);
          } else {
            Swal.fire({
              title: 'خطأ!',
              text: 'عذراً، حدث خطأ أثناء تحديث حالة الاختبار بالسيرفر.',
              icon: 'error'
            });
          }
        } catch (err) {
          console.error("خطأ أثناء تحديث حالة اختبار اللاعب:", err);
        }
      }
    });
  };
  const getCountdownStatus = dateString => {
    if (!dateString) return null;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const testDate = new Date(dateString);
      testDate.setHours(0, 0, 0, 0);
      const diffTime = testDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        return {
          text: "عدّى ميعاده ⚠️",
          className: "text-red-400 bg-red-500/10 border border-red-500/20"
        };
      } else if (diffDays === 0) {
        return {
          text: "اليوم ⚽",
          className: "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 animate-pulse font-black"
        };
      } else {
        return {
          text: `متبقي ${diffDays} يوم ⏱️`,
          className: "text-sky-400 bg-sky-500/10 border border-sky-500/20"
        };
      }
    } catch (e) {
      return null;
    }
  };
  const getFilteredBaseList = () => {
    return players.filter(player => {
      if (activeTab === 'pending' && player.status && player.status !== 'pending') return false;
      if (activeTab === 'approved_waiting' && player.status !== 'approved') return false;
      if (activeTab === 'final_accepted' && player.fieldTest?.finalStatus !== 'accepted') return false;
      if (activeTab === 'final_rejected') {
        const isInitialRejected = player.status === 'rejected';
        const isFieldRejected = player.fieldTest?.finalStatus === 'rejected';
        if (!isInitialRejected && !isFieldRejected) return false;
      }
      const nameMatch = player.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = player.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const positionMatch = player.position?.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || locationMatch || positionMatch;
    });
  };
  const currentFilteredPlayers = getFilteredBaseList();
  const playersWithoutSchedule = currentFilteredPlayers.filter(p => !p.fieldTest?.date || !p.fieldTest?.location);
  const playersWithSchedule = currentFilteredPlayers.filter(p => p.fieldTest?.date && p.fieldTest?.location && !p.fieldTest?.isDone);
  const playersTestedWaitingDecision = currentFilteredPlayers.filter(p => p.fieldTest?.isDone === true && (!p.fieldTest?.finalStatus || p.fieldTest?.finalStatus === ''));
  const RenderPlayersTable = ({
    playersList,
    emptyMessage,
    showActionType
  }) => <div className="bg-white/5 rounded-[2rem] border dark:border-white/10 border-[var(--color-border)] overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-white/5 dark:text-gray-400  text-[var(--color-text-gray)] text-xs font-black uppercase tracking-wider">
              <th className="p-6">اللاعب والمركز</th>
              <th className="p-6">المحافظة / النادي والسن</th>
              <th className="p-6">بيانات الاتصال وتفاصيل الموعد</th>
              <th className="p-6 text-center">القرار الفني والتفاصيل</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-white/5 divide-[var(--color-border)]">
            {playersList.length === 0 ? <tr>
                <td colSpan="4" className="p-10 text-center text-sm dark:text-gray-400 text-[var(--color-text-gray)] font-bold">{emptyMessage}</td>
              </tr> : playersList.map(player => {
            const hasSchedule = player.fieldTest?.date && player.fieldTest?.location;
            const countdown = hasSchedule ? getCountdownStatus(player.fieldTest.date) : null;
            return <tr key={player.id} className="dark:hover:bg-white/[0.02] transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        {player.image ? <img src={player.image} alt="" className="w-12 h-12 rounded-full object-cover border dark:border-white/10 border-[var(--color-border)] " onError={e => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }} /> : null}
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center  text-[#D4AF37]" style={{
                    display: player.image ? 'none' : 'flex'
                  }}>
                          {player.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-base text-[var(--color-gold-main)] group-hover:text-[#D4AF37] transition-colors">{player.name}</p>
                          <p className="text-xs dark:text-gray-400 text-[var(--color-text-gray)] font-medium mt-0.5">🏃 المركز: <span className="dark:text-gray-300 text-[var(--color-text-gray)] font-bold">{player.position}</span></p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm">
                      <p className="dark:text-gray-300 text-[var(--color-text-gray)] flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {player.location === "20" ? "القاهرة" : player.location} - {player.currentClub || 'لاعب حر'}</p>
                      <p className="text-[11px] dark:text-gray-500 text-[var(--color-text-gray)] font-bold mt-1">📅 العمر: {player.age} سنة | 👟 القدم: {player.preferredFoot || 'يمين'}</p>
                    </td>
                    <td className="p-6 text-xs">
                      <div className="space-y-1">
                        <p className="dark:text-gray-400 text-[var(--color-text-gray)] flex items-center gap-1.5 truncate max-w-[200px]">
                          <Mail className="w-3 h-3 dark:text-gray-600 text-[var(--color-text-gray)]" /> {player.userEmail}
                        </p>
                        <div className="flex flex-col gap-1 mt-1">
                          {player.fieldTest?.isDone ? player.fieldTest.finalStatus === 'accepted' ? <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold w-fit"><CheckCircle className="w-3 h-3" /> مقبول نهائي</span> : player.fieldTest.finalStatus === 'rejected' ? <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold w-fit"><XCircle className="w-3 h-3" /> مستبعد ميدانياً</span> : <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold w-fit animate-pulse"><Clock className="w-3 h-3" /> تم الاختبار (بانتظار القرار النهائي)</span> : player.status === 'approved' ? hasSchedule ? <div className="space-y-1 bg-white/[0.02] p-2 rounded-xl border border-white/5 mt-1 max-w-[220px]">
                                <div className="flex items-center gap-1.5 justify-between">
                                  <span className="text-sky-400 font-bold flex items-center gap-1 text-[11px]">
                                    <CalendarDays className="w-3 h-3" /> موعد الاختبار
                                  </span>
                                  {countdown && <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${countdown.className}`}>
                                      {countdown.text}
                                    </span>}
                                </div>
                                <p className="text-[10px] dark:text-gray-300 text-[var(--color-text-gray)] font-bold truncate">📍 {player.fieldTest.location}</p>
                                <p className="text-[10px] dark:text-gray-400 text-[var(--color-text-gray)]">⏱️ {player.fieldTest.date}</p>
                              </div> : <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold w-fit"><Clock className="w-3 h-3" /> معلق (بانتظار تحديد موعد)</span> : <span className="text-[var(--color-gold-main)] bg-yellow-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold w-fit"><Clock className="w-3 h-3" /> تحت المراجعة الأولي</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center items-center gap-2">
                        
                        {}
                        {showActionType === 'mark_done' && <button onClick={() => handleMarkAsDone(player)} className="px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-black hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1 shadow-md">
                            <ClipboardCheck className="w-4 h-4" /> تم الاختبار ⚽
                          </button>}

                        {showActionType === 'go_evaluate' && <button onClick={() => navigate(`/dashboard/player/${player.id}`)} className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-black hover:bg-purple-500 dark:hover:text-white transition-all flex items-center gap-1.5 shadow-lg">
                            <Award className="w-4 h-4 text-purple-400" /> رصد الدرجات والتقييم النهائي 📝
                          </button>}

                        {showActionType !== 'go_evaluate' && <button onClick={() => navigate(`/dashboard/player/${player.id}`)} className="px-3 py-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-xl text-xs font-black hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-1.5 shadow-md">
                            <Eye className="w-4 h-4" /> فتح الملف الفني
                          </button>}
                      </div>
                    </td>
                  </tr>;
          })}
          </tbody>
        </table>
      </div>
    </div>;
  return <div className="space-y-8 animate-fadeIn dark:text-[var(--color-text-white)] text-[var(--color-text-gray)]" dir="rtl">

      {}
      <div className="relative max-w-md w-full">
        <input type="text" placeholder="ابحث باسم اللاعب، المركز، أو المحافظة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white/5 border dark:border-white/10 border-[var(--color-border)] rounded-2xl pr-12 pl-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all dark:text-[var(--color-text-white)] dark:placeholder-gray-500 placeholder-[var(--color-text-gray)]" />
        <Search className="w-5 h-5 dark:text-gray-500 absolute right-4 top-3.5" />
      </div>

      {}
      {activeTab === 'approved_waiting' ? <div className="space-y-10">
          
          {}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <Award className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-black dark:text-[var(--color-text-white)]">لاعبين انتهى اختبارهم الميداني <span className="text-purple-300 font-bold text-sm bg-purple-500/10 px-2 py-1 rounded-lg mr-2">({playersTestedWaitingDecision.length} لاعبين بانتظار التقييم والقرار النهائي)</span></h3>
            </div>
            <RenderPlayersTable playersList={playersTestedWaitingDecision} emptyMessage="لا يوجد لاعبين معلقين بانتظار التقييم النهائي حالياً." showActionType="go_evaluate" />
          </div>

          {}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <CalendarDays className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-black dark:text-[var(--color-text-white)]">لاعبين جاهزين للاختبار الميداني <span className="text-sky-400 font-bold text-sm bg-sky-500/10 px-2 py-1 rounded-lg mr-2">({playersWithSchedule.length} لاعبين تم جدولتها)</span></h3>
            </div>
            <RenderPlayersTable playersList={playersWithSchedule} emptyMessage="لا يوجد لاعبين متاحين في جدول الترتيب الحالي." showActionType="mark_done" />
          </div>

          {}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black dark:text-[var(--color-text-white)]">لاعبين مقبولين مبدئياً <span className="text-amber-400 font-bold text-sm bg-amber-500/10 px-2 py-1 rounded-lg mr-2">({playersWithoutSchedule.length} لاعبين بانتظار تحديد موعد)</span></h3>
            </div>
            <RenderPlayersTable playersList={playersWithoutSchedule} emptyMessage="لا يوجد لاعبين معلقين بانتظار تحديد موعد حالياً." showActionType="none" />
          </div>

        </div> : <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <UserCheck className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-lg font-black dark:text-[var(--color-text-white)]">
              {activeTab === 'pending' && 'طلبات المراجعة بانتظار الكابتن'}
              {activeTab === 'final_accepted' && 'كشف اللاعبين المقبولين نهائياً'}
              {activeTab === 'final_rejected' && 'كشف طلبات اللاعبين المستبعدة'}
              <span className="text-[#D4AF37] font-bold text-sm bg-[#D4AF37]/10 px-2 py-1 rounded-lg mr-2">({currentFilteredPlayers.length} لاعبين)</span>
            </h3>
          </div>
          <RenderPlayersTable playersList={currentFilteredPlayers} emptyMessage="لا يوجد لاعبين في هذا الكشف حالياً." showActionType="none" />
        </div>}

    </div>;
};
export default PlayersSection;
