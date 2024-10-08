import React, { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";

export default function Signup() {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("inputs :>> ", inputs);
    await signup(inputs);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rouned-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-center text-3xl font-semibold text-gray-300">
          Signup <span className="text-blue-400">ChatApp</span>
        </h1>

        <form action="" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="" className="label p-2">
              <span className="text-base label-text">Fullname</span>
            </label>
            <input
              type="text"
              className="w-full input input-bordered h-10"
              value={inputs.fullName}
              onChange={(e) =>
                setInputs({ ...inputs, fullName: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="" className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              className="w-full input input-bordered h-10"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="" className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              className="w-full input input-bordered h-10"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="" className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              className="w-full input input-bordered h-10"
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <div className="form-control">
              <label htmlFor="male" className="label gap-2 cursor-pointer">
                <span className="text-base label-text">Male</span>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  className="radio border-slate-900"
                  checked={inputs.gender === "male"}
                  onChange={(e) =>
                    setInputs({ ...inputs, gender: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="form-control">
              <label htmlFor="female" className="label gap-2 cursor-pointer">
                <span className="text-base label-text">Female</span>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  className="radio border-slate-900"
                  checked={inputs.gender === "female"}
                  onChange={(e) =>
                    setInputs({ ...inputs, gender: e.target.value })
                  }
                />
              </label>
            </div>
          </div>

          <Link
            to={"/login"}
            className="text-xs hover:underline hover:text-blue-600 mt-2 inline-block"
          >
            Already have an account ?
          </Link>
          <div>
            <button
              className="btn btn-block btn-sm mt-2 border border-slate-700"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
