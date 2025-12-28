export const getAuthStorage = () => {
  const rememberMe = localStorage.getItem("ethix_remember_me") === "true";
  return rememberMe ? localStorage : sessionStorage;
};

export const clearAuthStorage = () => {
  localStorage.removeItem("ethix_remember_me");
  localStorage.removeItem("ethix_user");
  localStorage.removeItem("ethix_token");
  sessionStorage.removeItem("ethix_user");
  sessionStorage.removeItem("ethix_token");
};