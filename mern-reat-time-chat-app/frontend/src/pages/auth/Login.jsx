import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

export default function Login() {
  const { loading, login } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rouned-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-center text-3xl font-semibold text-gray-300">
          Login <span className="text-blue-400">ChatApp</span>
        </h1>

        <form action="" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="" className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              className="w-full input input-bordered h-10"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="text"
              className="w-full input input-bordered h-10"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            to={"/signup"}
            className="text-xs hover:underline hover:text-blue-600 mt-2 inline-block"
          >
            Dont have a account
          </Link>
          <div>
            <button
              className="btn btn-block btn-sm mt-2 border border-slate-700"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
