import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Home from "../components/Home";
import { AuthProvider } from "../contexts/AuthContext";
import Profiles from "../components/profile/Profile";

const LoginPage = lazy(() => import("../components/login/Login"));
const SignupPage = lazy(() => import("../components/signup/Signup"));
const CreateProfileFormPage = lazy(() =>
  import("../components/profile/Create")
);
const UpdateProfileFormPage = lazy(() =>
  import("../components/profile/Update")
);

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div id="app">
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<Profiles />} />
              <Route
                path="/profile/create"
                element={<CreateProfileFormPage />}
              />
              <Route
                path="/profile/update/:id/:buname/:budescription/:token"
                element={<UpdateProfileFormPage />}
              />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
