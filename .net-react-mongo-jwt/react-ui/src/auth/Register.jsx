import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NavLink } from 'react-router-dom';

const Register = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Geçersiz email adresi')
                .required('Email gerekli'),
            password: Yup.string()
                .min(6, 'Şifre en az 6 karakter olmalı')
                .required('Şifre gerekli'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
                .required('Şifre doğrulama gerekli'),
        }),
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light ">
            <div className="bg-white p-4 rounded shadow-lg max-w-md m-3 ">
                <h2 className="h4 fw-bold text-center">Kayıt Ol</h2>
                <div className="d-flex justify-content-center mb-2">
                    <span className="text-muted">
                        Eger Hesabiniz Varsa <NavLink to="/login" className="text-decoration-underline">Giris Yap</NavLink>
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
                            {...formik.getFieldProps('email')}
                            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
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
                            {...formik.getFieldProps('password')}
                            className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="invalid-feedback">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label className="form-label" htmlFor="confirmPassword">
                            Şifre Doğrulama
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...formik.getFieldProps('confirmPassword')}
                            className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Kayıt Ol
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
