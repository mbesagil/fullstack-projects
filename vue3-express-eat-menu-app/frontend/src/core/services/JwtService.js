export const getToken = () => {
  let token = window.localStorage.getItem("ID_TOKEN_KEY");
  // console.log("token :>> ", token);
  if (token == null) {
    return null;
  }
  return token;
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token) => {
  window.localStorage.setItem("ID_TOKEN_KEY", token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = () => {
  window.localStorage.removeItem("ID_TOKEN_KEY");
};

export default { getToken, saveToken, destroyToken };
