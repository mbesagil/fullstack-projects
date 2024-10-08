import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import useLogin from "@/hooks/useLogin";

function Login() {
  const { t, i18n } = useTranslation();

  const { login, loading } = useLogin();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Geçersiz email adresi")
      .required("Email gerekli"),
    password: Yup.string()
      .min(6, "Şifre en az 6 karakter olmalı")
      .required("Şifre gerekli"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (logData: any) => {
    console.log("logData :>> ", logData);
    await login(logData.email, logData.password);
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="m-10 w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">{t("Login")}</h2>
        <div className="flex justify-center mb-2"></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              {t("Email")}
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-3 py-2 border rounded-md bg-transparent ${
                touchedFields.email && errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touchedFields.email && errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-3">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              {t("Password")}
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-3 py-2 border rounded-md bg-transparent ${
                touchedFields.password && errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touchedFields.password && errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center mb-3">
            <Button disabled={loading} type="submit">
              {t("Login")}
            </Button>
          </div>
          <div className="flex justify-center">
            <span className="text-xs">
              {t("If You Don't Have an Account")}{" "}
              <NavLink
                to="/auth/register"
                className="underline text-blue-500 hover:text-blue-600"
              >
                {t("Create New Account")}
              </NavLink>{" "}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
