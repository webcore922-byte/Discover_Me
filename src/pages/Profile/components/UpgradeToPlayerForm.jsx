import React from 'react';

const POSITION_OPTIONS = [
  { value: "حارس مرمى", label: "حارس مرمى (GK)" },
  { value: "قلب defense", label: "قلب دفاع (CB)" },
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

const UpgradeInput = ({ label, placeholder, onChange }) => (
  <div className="space-y-2">
    <label className="text-[var(--color-gold-main)] text-[10px] font-black uppercase tracking-widest mr-2">
      {label}
    </label>
    <input
      required
      type="text"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[var(--color-gold-main)] outline-none transition-all text-right"
    />
  </div>
);

const UpgradeToPlayerForm = ({ isUpgrading, setIsUpgrading, upgradeData, setUpgradeData, handleUpgradeSubmit }) => (
  <div className="glass-card rounded-[3rem] p-12 md:p-16 border border-white/10 text-center relative overflow-hidden bg-white/[0.02]">
    {!isUpgrading ? (
      <>
        <h2 className="text-4xl md:text-5xl font-black text-gradient-gold italic uppercase mb-6">
          Scout Mode
        </h2>
        <p className="text-white/40 mb-10 font-bold">
          هل تود الانضمام لمنصة المواهب كلاعب؟
        </p>
        <button
          onClick={() => setIsUpgrading(true)}
          className="bg-[var(--gold-gradient)] text-black font-black px-12 py-5 rounded-2xl shadow-[var(--gold-glow)] hover:scale-105 transition-all text-xl uppercase italic border-b-4 border-black/20"
        >
          سجل كلاعب الآن
        </button>
      </>
    ) : (
      <form onSubmit={handleUpgradeSubmit} className="text-right space-y-6">
        <h3 className="text-2xl font-black text-[var(--color-gold-main)] mb-6 italic uppercase border-b border-white/5 pb-4">
          إكمال بيانات اللاعب
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UpgradeInput
            label="الرقم القومي"
            placeholder="14 رقم"
            onChange={(v) => setUpgradeData({ ...upgradeData, nationalId: v })}
          />
          <UpgradeInput
            label="السن"
            placeholder="مثال: 20"
            onChange={(v) => setUpgradeData({ ...upgradeData, age: v })}
          />
          <div className="space-y-2 text-right">
            <label className="text-[var(--color-gold-main)] text-[10px] font-black uppercase tracking-widest mr-2">
              المركز
            </label>
            <select
              required
              className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[var(--color-gold-main)] outline-none transition-all text-right appearance-none cursor-pointer"
              onChange={(e) => setUpgradeData({ ...upgradeData, position: e.target.value })}
            >
              <option value="">اختر مركزك</option>
              {POSITION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#1e1e1e]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <UpgradeInput
            label="المحافظة"
            placeholder="مثال: القاهرة"
            onChange={(v) => setUpgradeData({ ...upgradeData, location: v })}
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="text-[var(--color-gold-main)] text-[10px] font-black uppercase tracking-widest mr-2">
            القدم المفضلة
          </label>
          <select
            required
            className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[var(--color-gold-main)] outline-none transition-all text-right appearance-none cursor-pointer"
            onChange={(e) => setUpgradeData({ ...upgradeData, preferredFoot: e.target.value })}
          >
            <option value="">اختر القدم</option>
            <option value="يمين" className="bg-[#1e1e1e]">يمين</option>
            <option value="يسار" className="bg-[#1e1e1e]">يسار</option>
            <option value="القدمين" className="bg-[#1e1e1e]">القدمين</option>
          </select>
        </div>

        <UpgradeInput
          label="لينك فيديو مهاراتك"
          placeholder="Google Drive / YouTube"
          onChange={(v) => setUpgradeData({ ...upgradeData, videoUrl: v })}
        />

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-[var(--gold-gradient)] text-black font-black py-5 rounded-2xl text-xl uppercase italic"
          >
            تأكيد البيانات
          </button>
          <button
            type="button"
            onClick={() => setIsUpgrading(false)}
            className="px-8 py-5 bg-white/5 text-white/50 rounded-2xl font-black uppercase italic"
          >
            إلغاء
          </button>
        </div>
      </form>
    )}
  </div>
);

export default UpgradeToPlayerForm;