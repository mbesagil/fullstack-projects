import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSignup from "@/hooks/useSignup";
import Password from "antd/es/input/Password";

interface regDataInteface {
  password: string;
  confirmPassword: string;
  email: string;
}

const Register = () => {
  const { t, i18n } = useTranslation();

  const { signup, loading } = useSignup();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Geçersiz email adresi")
      .required("Email gerekli"),
    password: Yup.string()
      .min(6, "Şifre en az 6 karakter olmalı")
      .required("Şifre gerekli"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Şifreler eşleşmiyor")
      .required("Şifre doğrulama gerekli"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (regData: regDataInteface) => {
    console.log("regData :>> ", regData);
    await signup(regData.email, regData.password);
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-sm m-3">
        <h2 className="text-xl font-bold text-center mb-4">{t("Sign Up")}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-3 py-2 border rounded-md bg-transparent  ${
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
              className={`w-full px-3 py-2 border rounded-md bg-transparent  ${
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
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="confirmPassword"
            >
              {t("Confirm Password")}
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className={`w-full px-3 py-2 border rounded-md bg-transparent  ${
                touchedFields.confirmPassword && errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touchedFields.confirmPassword && errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center mb-3">
            <button
              disabled={loading}
              type="submit"
              className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {t("Sign Up")}
            </button>
          </div>
          <div className="flex justify-center mb-2">
            <span className="text-xs">
              {t("If You Have an Account")}{" "}
              <NavLink
                to="/auth/login"
                className="underline text-blue-500 hover:text-blue-600"
              >
                {t("Login")}
              </NavLink>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
