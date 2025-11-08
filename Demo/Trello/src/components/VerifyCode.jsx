import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verificodeAPI, resendCodeAPI } from "../services/UserAPI";

export default function VerifyCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Nếu không có email (vào thẳng /verify-code mà không đăng ký trước)
  if (!email) {
    navigate("/register");
    return null;
  }

  //  Gửi mã xác thực lên server
  const handleVerify = async () => {
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã xác thực!");
      return;
    }

    try {
      setLoading(true);
      const res = await verificodeAPI(email, code);
      toast.success(res.data || "Xác thực thành công!");
      // Chuyển sang trang đăng nhập
      navigate("/login");
    } catch (err) {
      console.error(" Verify error:", err);
      toast.error(err.response?.data || "Mã không hợp lệ hoặc đã hết hạn!");
    } finally {
      setLoading(false);
    }
  };

  //  Gửi lại mã mới
  const handleResend = async () => {
    try {
      setResending(true);
      const res = await resendCodeAPI(email);
      toast.success(res.data || "Mã xác thực mới đã được gửi!");
    } catch (err) {
      console.error(" Resend error:", err);
      toast.error(err.response?.data || "Không thể gửi lại mã!");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg p-8 rounded-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🔐 Xác thực tài khoản</h2>

        <p className="text-gray-600 mb-6">
          Mã xác thực đã được gửi tới <span className="text-blue-600 font-semibold">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Nhập mã 6 chữ số"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 text-center tracking-widest text-lg"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-2 rounded text-white font-medium transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang xác thực..." : "Xác thực ngay"}
        </button>

        <div className="mt-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className={`w-full py-2 rounded font-medium transition ${
              resending
                ? "bg-gray-300 text-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-blue-600"
            }`}
          >
            {resending ? "Đang gửi lại..." : "Gửi lại mã xác thực"}
          </button>
        </div>
      </div>
    </div>
  );
}
