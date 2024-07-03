import React, { useEffect, useState } from "react";
import { useChromeStorage } from "../../hook/useToken";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [storedValue, setStoredValue] = useChromeStorage("token");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validate = () => {
    const validationErrors = {};
    if (!email.trim() || !validateEmail(email)) {
      validationErrors.email = "Please enter a valid email address ";
    }
    if (!password.trim() || password.length < 4) {
      validationErrors.password = "password must be at least 6 char long";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };


  const fetchProfileData = async (token) => {
    try {
      const response = await fetch('https://api.twitterai.workers.dev/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();

      try {
        await chrome.storage.local.set({userProfile:data});
        console.log('Profile stored successfully', data);
      } catch (error) {
        console.error("Error storing profile:", error);
      }

      return data;

    } catch (error) {
      console.error('Error fetching profile data:', error);
      throw error;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await fetch("https://api.twitterai.workers.dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const token = data.token;
      if ((data.status = "Logged In" && data.token)) {
        setStoredValue(token);
        console.log("Logged In");
        fetchProfileData(token);
        navigate("/");
      }else{
        console.log(data.status);
        console.log(data);
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      setErrors({ general: "Login failed. Please check your credentials." });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center max-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs">
        <h1 className="text-2xl font-bold text-center mb-4 text-orange-600">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
          >
            Login
          </button>
        </form>
        <p className="text-center text-black text-sm mt-4">
          Don't have an account?
          <a href="#/signup" className="text-orange-600 font-medium">
            {" "}
            Sign up here
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
