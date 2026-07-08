import React from 'react';
import useProfileData from './hooks/useProfileData';
import StatusBanner from './components/StatusBanner';
import ProfileHeader from './components/ProfileHeader';
import AccountInfoCard from './components/AccountInfoCard';
import AdminPanel from './components/AdminPanel';
import PlayerEditForm from './components/PlayerEditForm';
import UpgradeToPlayerForm from './components/UpgradeToPlayerForm';
const Profile = () => {
  const {
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
  } = useProfileData();
  if (!user) return null;
  return <div className="min-h-screen bg-[var(--color-bg-main)] py-10 md:py-16 px-4 md:px-8 text-right font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="space-y-4">
          <StatusBanner user={user} status={status} showCongrats={showCongrats} isPlayer={isPlayer} />
        </div>

        <ProfileHeader user={user} isAdmin={isAdmin} adminType={adminType} editData={editData} status={status} handleLogout={handleLogout} handleProfileImageChange={handleProfileImageChange} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <AccountInfoCard user={user} isAdmin={isAdmin} adminType={adminType} />
          </div>

          <div className="lg:col-span-8">
            {isAdmin && <AdminPanel adminType={adminType} editData={editData} />}

            {(isPlayer || isPendingOrRejectedPlayer) && <PlayerEditForm user={user} status={status} editData={editData} setEditData={setEditData} handleSave={handleSave} />}

            {isUser && !user?.player && <UpgradeToPlayerForm isUpgrading={isUpgrading} setIsUpgrading={setIsUpgrading} upgradeData={upgradeData} setUpgradeData={setUpgradeData} handleUpgradeSubmit={handleUpgradeSubmit} />}
          </div>
        </div>

      </div>
    </div>;
};
export default Profile;
