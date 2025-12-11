"use client";

import { useState } from "react";
import { User, LogOut, MapPin, Mail, Lock, UserCircle, Package, Search, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/lib/authContext";
import { API_URL } from "@/lib/api";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = "auth" | "verify-email" | "forgot-password" | "verify-reset-code" | "reset-password";

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const router = useRouter();
  const { user, isAuthenticated, isGuest, login, logout, continueAsGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [currentView, setCurrentView] = useState<ViewState>("auth");

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Signup form states
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Verification states
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [pendingUserId, setPendingUserId] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  // Reset code states
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCodeLoading, setResetCodeLoading] = useState(false);
  const [resetCodeError, setResetCodeError] = useState("");

  // Reset password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState("");

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Нэвтрэхэд алдаа гарлаа");
      }

      const userData = {
        id: data.user?.id || "",
        name: data.user?.name || "",
        email: loginEmail,
        role: data.user?.role || "user",
      };

      login(data.token, userData);
      setLoginEmail("");
      setLoginPassword("");
      onClose();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Бүртгүүлэх үед алдаа гарлаа");
      }

      // Save for verification
      setPendingUserId(data.userId);
      setPendingEmail(signupEmail);

      // Clear form
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");

      // Switch to verification view
      setCurrentView("verify-email");

    } catch (err) {
      setSignupError(err instanceof Error ? err.message : "Бүртгүүлэх үед алдаа гарлаа");
    } finally {
      setSignupLoading(false);
    }
  };

  // Handle Verification Code Input
  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`verify-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerificationKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`verify-code-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle Email Verification
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyLoading(true);
    setVerifyError("");

    const code = verificationCode.join("");

    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: pendingUserId, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Баталгаажуулалт амжилтгүй");
      }

      // Login user
      login(data.token, data.user);

      // Reset states
      setVerificationCode(["", "", "", "", "", ""]);
      setPendingUserId("");
      setPendingEmail("");
      setCurrentView("auth");
      onClose();

    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Resend Verification Code
  const handleResendCode = async () => {
    setResendLoading(true);
    setVerifyError("");
    setResendSuccess("");

    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: pendingUserId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Код дахин илгээхэд алдаа гарлаа");
      }

      setResendSuccess("Шинэ код таны email рүү илгээгдлээ!");
      setVerificationCode(["", "", "", "", "", ""]);
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setResendLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Код илгээхэд алдаа гарлаа");
      }

      setResetEmail(forgotEmail);
      setCurrentView("verify-reset-code");

    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Код илгээхэд алдаа гарлаа");
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Reset Code Input
  const handleResetCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...resetCode];
    newCode[index] = value;
    setResetCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResetKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !resetCode[index] && index > 0) {
      const prevInput = document.getElementById(`reset-code-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify Reset Code
  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetCodeLoading(true);
    setResetCodeError("");

    const code = resetCode.join("");

    try {
      const response = await fetch(`${API_URL}/auth/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, resetCode: code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Буруу код");
      }

      setCurrentView("reset-password");

    } catch (err) {
      setResetCodeError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setResetCodeLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetPasswordLoading(true);
    setResetPasswordError("");

    if (newPassword !== confirmPassword) {
      setResetPasswordError("Нууц үг таарахгүй байна");
      setResetPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Нууц үг солихоо алдаа гарлаа");
      }

      // Auto-login
      const userData = {
        id: data.user?.id || "",
        name: data.user?.name || "",
        email: resetEmail,
        role: data.user?.role || "user",
      };

      login(data.token, userData);

      // Reset all states
      setNewPassword("");
      setConfirmPassword("");
      setResetEmail("");
      setResetCode(["", "", "", "", "", ""]);
      setCurrentView("auth");
      onClose();

    } catch (err) {
      setResetPasswordError(err instanceof Error ? err.message : "Failed");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logout();
    onClose();
  };

  // Handle Continue as Guest
  const handleContinueAsGuest = () => {
    continueAsGuest();
    onClose();
  };

  // Back to Auth View
  const backToAuth = () => {
    setCurrentView("auth");
    setActiveTab("login");
    setVerificationCode(["", "", "", "", "", ""]);
    setResetCode(["", "", "", "", "", ""]);
    setVerifyError("");
    setForgotError("");
    setResetCodeError("");
    setResetPasswordError("");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {currentView === "verify-email" && "Email Баталгаажуулах"}
            {currentView === "forgot-password" && "Нууц үг сэргээх"}
            {currentView === "verify-reset-code" && "Код баталгаажуулах"}
            {currentView === "reset-password" && "Шинэ нууц үг"}
            {currentView === "auth" && (isAuthenticated ? "Profile" : isGuest ? "Guest Profile" : "Login / Sign Up")}
          </SheetTitle>
        </SheetHeader>

        {/* EMAIL VERIFICATION VIEW */}
        {currentView === "verify-email" && (
          <div className="mt-6">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Mail className="text-blue-600" size={48} />
              </div>
            </div>

            <p className="text-center text-gray-600 mb-6">
              <strong>{pendingEmail}</strong> хаяг руу илгээсэн 6 оронтой кодыг оруулна уу
            </p>

            <form onSubmit={handleVerifyEmail} className="space-y-6">
              <div className="flex justify-center gap-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`verify-code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                    className="w-10 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                ))}
              </div>

              {verifyError && (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                  {verifyError}
                </div>
              )}

              {resendSuccess && (
                <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
                  {resendSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={verifyLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
              >
                {verifyLoading ? "Шалгаж байна..." : "Баталгаажуулах"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center gap-2 mx-auto disabled:text-gray-400"
              >
                <RefreshCw size={16} className={resendLoading ? "animate-spin" : ""} />
                {resendLoading ? "Илгээж байна..." : "Код дахин илгээх"}
              </button>
            </div>

            <button
              onClick={backToAuth}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Буцах
            </button>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {currentView === "forgot-password" && (
          <div className="mt-6">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-100 p-4 rounded-full">
                <Lock className="text-orange-600" size={48} />
              </div>
            </div>

            <p className="text-center text-gray-600 mb-6">
              Бүртгэлтэй email хаягаа оруулна уу
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              {forgotError && (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                  {forgotError}
                </div>
              )}

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition font-semibold disabled:bg-gray-400"
              >
                {forgotLoading ? "Илгээж байна..." : "Код илгээх"}
              </button>
            </form>

            <button
              onClick={backToAuth}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Буцах
            </button>
          </div>
        )}

        {/* VERIFY RESET CODE VIEW */}
        {currentView === "verify-reset-code" && (
          <div className="mt-6">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-100 p-4 rounded-full">
                <Lock className="text-purple-600" size={48} />
              </div>
            </div>

            <p className="text-center text-gray-600 mb-6">
              <strong>{resetEmail}</strong> хаяг руу илгээсэн 6 оронтой кодыг оруулна уу
            </p>

            <form onSubmit={handleVerifyResetCode} className="space-y-6">
              <div className="flex justify-center gap-2">
                {resetCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`reset-code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleResetCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleResetKeyDown(index, e)}
                    className="w-10 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    required
                  />
                ))}
              </div>

              {resetCodeError && (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                  {resetCodeError}
                </div>
              )}

              <button
                type="submit"
                disabled={resetCodeLoading}
                className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition font-semibold disabled:bg-gray-400"
              >
                {resetCodeLoading ? "Шалгаж байна..." : "Баталгаажуулах"}
              </button>
            </form>

            <button
              onClick={backToAuth}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Буцах
            </button>
          </div>
        )}

        {/* RESET PASSWORD VIEW */}
        {currentView === "reset-password" && (
          <div className="mt-6">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <Lock className="text-green-600" size={48} />
              </div>
            </div>

            <p className="text-center text-gray-600 mb-6">
              Шинэ нууц үгээ оруулна уу
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Шинэ нууц үг</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Шинэ нууц үг"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Нууц үг баталгаажуулах</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Нууц үг дахин оруулах"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {resetPasswordError && (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                  {resetPasswordError}
                </div>
              )}

              <button
                type="submit"
                disabled={resetPasswordLoading}
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition font-semibold disabled:bg-gray-400"
              >
                {resetPasswordLoading ? "Солиож байна..." : "Нууц үг солих"}
              </button>
            </form>

            <button
              onClick={backToAuth}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Буцах
            </button>
          </div>
        )}

        {/* MAIN AUTH VIEW (Login/Signup) */}
        {currentView === "auth" && (
          <>
            {isGuest && !isAuthenticated ? (
              <div className="mt-6">
                <div className="flex flex-col items-center py-6 border-b">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                    <User size={40} className="text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Guest User</h3>
                  <p className="text-gray-500 text-sm">Browsing as guest</p>
                </div>

                <div className="py-6 space-y-4">
                  <button
                    onClick={() => {
                      router.push("/my-orders");
                      onClose();
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Package size={20} />
                    Миний захиалгууд
                  </button>

                  <button
                    onClick={() => {
                      router.push("/order-track");
                      onClose();
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Search size={20} />
                    Захиалга хянах
                  </button>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 mb-3 font-semibold">
                      You&apos;re currently browsing as a guest. Create an account to:
                    </p>
                    <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                      <li>• Save your addresses</li>
                      <li>• Track your orders easily</li>
                      <li>• Faster checkout</li>
                      <li>• Save wishlist items</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setActiveTab("signup");
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold"
                  >
                    Create Account
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setActiveTab("login");
                    }}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition font-semibold"
                  >
                    Login to Existing Account
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
                  <button
                    onClick={onClose}
                    className="w-full text-gray-600 hover:text-gray-800 py-2 transition text-sm"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="mt-6">
                <div className="flex flex-col items-center py-6 border-b">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                    <User size={40} className="text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                <div className="py-4 space-y-4">
                  <button
                    onClick={() => {
                      router.push("/my-orders");
                      onClose();
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Package size={20} />
                    Миний захиалгууд
                  </button>

                  <button
                    onClick={() => {
                      router.push("/order-track");
                      onClose();
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Search size={20} />
                    Захиалга хянах
                  </button>

                  <div className="flex items-center gap-3 text-gray-700">
                    <UserCircle size={20} />
                    <span>Role: {user.role}</span>
                  </div>

                  {user.addresses && user.addresses.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gray-700 font-semibold">
                        <MapPin size={20} />
                        <span>Saved Addresses</span>
                      </div>
                      {user.addresses.map((address, index) => (
                        <div key={index} className="ml-8 text-sm text-gray-600">
                          <p>{address.street}, {address.city}</p>
                          <p>{address.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex gap-2 mb-6 border-b">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 pb-3 font-semibold transition ${
                      activeTab === "login"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab("signup")}
                    className={`flex-1 pb-3 font-semibold transition ${
                      activeTab === "signup"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {activeTab === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setCurrentView("forgot-password")}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Нууц үгээ мартсан уу?
                      </button>
                    </div>

                    {loginError && (
                      <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                        {loginError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold disabled:bg-gray-400"
                    >
                      {loginLoading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                )}

                {activeTab === "signup" && (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    {signupError && (
                      <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                        {signupError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={signupLoading}
                      className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold disabled:bg-gray-400"
                    >
                      {signupLoading ? "Creating account..." : "Sign Up"}
                    </button>
                  </form>
                )}

                <div className="mt-6 space-y-3">
                  <div className="text-center text-sm text-gray-500">
                    <p className="mb-3">Quick Actions</p>
                  </div>
                  
                  <button
                    onClick={handleContinueAsGuest}
                    className="w-full bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition font-medium"
                  >
                    Continue as Guest
                  </button>
                  
                  <button
                    onClick={() => {
                      router.push("/order-track");
                      onClose();
                    }}
                    className="w-full bg-blue-50 text-blue-700 py-2 rounded-md hover:bg-blue-100 transition font-medium flex items-center justify-center gap-2 border border-blue-200"
                  >
                    <Search size={18} />
                    Захиалга хянах
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
