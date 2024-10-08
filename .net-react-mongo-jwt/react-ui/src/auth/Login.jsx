import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";

import { login } from "../stores/userSlice";
import ApiService from "../core/services/ApiService";
import JwtService from "../core/services/JwtService";
import { setToken, setIsAuthenticated } from '../stores/userSlice';

function Login() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Geçersiz email adresi")
        .required("Email gerekli"),
      password: Yup.string()
        .min(6, "Şifre en az 6 karakter olmalı")
        .required("Şifre gerekli"),
    }),
    onSubmit: (logData) => async (dispatch) => {
      try {
        const response = await ApiService.post("Auth/login", logData);
        console.log("response", response);
        if (response.data.token) {
          JwtService.saveToken(response.data.token); // Save token to localStorage
          ApiService.setHeader(); // Set JWT token in headers

          // Dispatch actions to update Redux state
          dispatch(setToken(response.data.token));
          dispatch(setIsAuthenticated(true));
        }
        return response;
      } catch (err) {
        console.log("err", err);
        return null;
      }
    },
  });

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="bg-white p-4 rounded shadow-lg max-w-md m-10 ">
        <h2 className="h4 fw-bold text-center">Giriş Yap</h2>
        <div className="d-flex justify-content-center mb-2">
          <span className="text-muted">
            Eger Hesabiniz Yoksa{" "}
            <NavLink to="/register" className="text-decoration-underline">
              Yeni Hesap Olustur
            </NavLink>{" "}
          </span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="invalid-feedback">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <button type="submit" className="btn btn-primary">
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
