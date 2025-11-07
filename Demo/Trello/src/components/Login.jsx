import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAPI, registerAPI } from "../services/LoginAPI";
export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");

  // === HANDLE LOGIN ===
  const navigate = useNavigate();
const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("⚠️ Vui lòng nhập đầy đủ email và mật khẩu!");
    return;
  }

  try {
    const res = await loginAPI({ email, password });

    // Lưu token và user vào localStorage
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify({
        userUId: res.userUId,
        userName: res.userName,
        email: res.email
      }));

      toast.success("Đăng nhập thành công!");
      console.log("User:", res);

      navigate("/home");
    } else {
      toast.error(res.message || "Đăng nhập thất bại!");
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    toast.error("Sai tài khoản hoặc mật khẩu!");
  }
};

  // === HANDLE REGISTER ===
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !userName) {
      setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const res = await registerAPI({ userName, email, password });
      console.log("Đăng ký thành công:", res);
      setMessage("Đăng ký thành công! Hãy đăng nhập.");
      setIsRegister(false);
    } catch (err) {
      setMessage("Đăng ký thất bại!", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 p-">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl w-full m4ax-w-sm p-8 transition-all duration-300">
        <h2 className="text-2xl font-bold text-center text-teal-600 dark:text-teal-400 mb-6">
          {isRegister ? "Đăng ký tài khoản" : "Đăng nhập hệ thống"}
        </h2>

        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="space-y-4"
        >
          {isRegister && (
            <div>
              <label className="block mb-1 font-medium">Tên người dùng</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nhập tên người dùng..."
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email..."
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-2 text-gray-500 hover:text-teal-500 transition"
              >
                {showPass ? "👁️‍🗨️" : "🙈"}
              </button>
            </div>
          </div>

          {message && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-medium transition-transform transform hover:scale-[1.03]"
          >
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          {isRegister ? (
            <>
              Đã có tài khoản?{" "}
              <span
                onClick={() => {
                  setIsRegister(false);
                  setMessage("");
                }}
                className="text-teal-600 dark:text-teal-400 font-semibold cursor-pointer hover:underline"
              >
                Đăng nhập ngay
              </span>
            </>
          ) : (
            <>
              Chưa có tài khoản?{" "}
              <span
                onClick={() => {
                  setIsRegister(true);
                  setMessage("");
                }}
                className="text-teal-600 dark:text-teal-400 font-semibold cursor-pointer hover:underline"
              >
                Đăng ký ngay
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
