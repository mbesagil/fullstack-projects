import { ref } from "vue";
import { defineStore } from "pinia";
import AxiosService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref({});
  const isAuthenticated = ref(!!JwtService.getToken());

  const router = useRouter();

  function setAuth(authUser) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.token.access_token);
    window.localStorage.setItem("ID_USER", JSON.stringify(authUser));
    ApiService.setHeader();
  }

  function setError(error) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {};
    errors.value = [];
    JwtService.destroyToken();
  }

  async function login(credentials, userType) {
    return await AxiosService.post(`${userType}/login`, credentials)
      .then((res) => {
        console.log("res :>> ", res);
        if (res.err) {
          console.log("res.err :>> ", res.err);
        }
        if (res.data) setAuth(res.data);
        toast.success(`Success Login`);
        router.push("/");
      })
      .catch(({ response }) => {
        console.log("response :>> ", response);
        toast.error(`${response.data.message}`);
      });
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials) {
    return AxiosService.post("users/create", credentials)
      .then(({ data }) => {
        router.push("/login");
      })
      .catch(({ response }) => {
        console.log("response :>> ", response);
        toast.error(`Error ${response.data?.err[0]?.message}`);
      });
  }

  function forgotPassword(email) {
    return AxiosService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  // function verifyAuth() {
  //   if (JwtService.getToken()) {
  //     AxiosService.setHeader();
  //     AxiosService.post("verify_token", { api_token: JwtService.getToken() })
  //       .then(({ data }) => {
  //         setAuth(data);
  //       })
  //       .catch(({ response }) => {
  //         setError(response.data.errors);
  //         purgeAuth();
  //       });
  //   } else {
  //     purgeAuth();
  //   }
  // }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    // verifyAuth,
  };
});
