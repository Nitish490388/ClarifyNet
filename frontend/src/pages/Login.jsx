import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { handleCatch } from "../utils/utilFunctions";
import axiosClient from "../utils/axioxClient";

const Login = () => {

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/user/login", {
        username: email,
        password: password,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="__login_page h-[calc(100dvh-60px)] w-full flex justify-center items-center">
      <div className="__login_form_container p-5 rounded bg-gray-800 w-[300px]">
        <form className="flex gap-3 flex-col">
          <input
            type="text"
            className="p-2 rounded outline-none text-black"
            placeholder="Enter Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={setLoading}
          />
          <input
            className="p-2 rounded outline-none text-black"
            type="password"
            placeholder="Enter Password"
            required
            onChange={(e) => setpassword(e.target.value)}
            value={password}
            disabled={loading}
          />
          <button
            className="bg-blue-500 w-full transition hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </form>
        <p className="w-full text-center my-6 border-t-[1px] border-white leading-[0px]">
          <span className="bg-gray-800 px-3">OR</span>
        </p>
        <button
          className="bg-white w-full py-2 px-4 text-black rounded transition flex justify-center items-center gap-1"
        >
          <FcGoogle className=" text-xl" /> Sign in with Google
        </button>
        <p className="text-xs m-3 text-center">
          New to ClarifyNet? Create account{" "}
          <button
            onClick={() => navigate("/signup")}
            className=" text-blue-500"
          >
            here
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;
