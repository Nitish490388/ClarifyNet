import React, { Suspense, lazy } from "react";
import Loader from "./components/Loader";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

export function LazyLoader() {
  return (
    <div className="h-[calc(100dvh-60px)] w-full flex justify-center items-center">
      <Loader />
    </div>
  )
}

const AllRoutes = () => {
  return (
    <Suspense fallback={<LazyLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
