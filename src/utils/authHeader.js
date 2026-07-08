export const getToken = () => localStorage.getItem('scoutToken') || '';
export const authHeader = () => {
  const token = getToken();
  return token ? {
    Authorization: `Bearer ${token}`
  } : {};
};
export const authJsonHeader = () => ({
  'Content-Type': 'application/json',
  ...authHeader()
});
