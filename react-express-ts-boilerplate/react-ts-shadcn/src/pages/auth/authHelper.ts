import ApiService from "@/core/ApiService";

const AUTH_LOCAL_STORAGE_KEY = import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY;

const getAuth = () => {
  if (!localStorage) {
    return;
  }

  const lsValue = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }

  try {
    const auth = JSON.parse(lsValue);
    if (auth) {
      // You can easily check auth_token expiration also
      return auth;
    }
  } catch (error) {
    console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
  }
};

const setAuth = (auth: string) => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, auth);
  } catch (error) {
    console.error("AUTH LOCAL STORAGE SAVE ERROR", error);
  }
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
  }
};

const getUserByToken = async (userToken: string | null) => {
  if (userToken) {
    return await ApiService.post("auth/verify-token", { token: userToken });
  }
};

export { getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY, getUserByToken };
