"use client";

import { useState } from "react";
import { User, LogOut, MapPin, Mail, Lock, UserCircle, Package, Search } from "lucide-react";
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

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const router = useRouter();
  const { user, isAuthenticated, isGuest, login, logout, continueAsGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

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
        throw new Error(data.message || "Login failed");
      }

      // Decode token to get user info (simple approach)
      const userData = {
        id: data.user?.id || "",
        name: data.user?.name || "",
        email: loginEmail,
        role: data.user?.role || "user",
      };

      login(data.token, userData);
      setLoginEmail("");
      setLoginPassword("");
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
        throw new Error(data.message || "Signup failed");
      }

      const userData = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };

      login(data.token, userData);
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setSignupLoading(false);
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isAuthenticated ? "Profile" : isGuest ? "Guest Profile" : "Login / Sign Up"}
          </SheetTitle>
        </SheetHeader>

        {/* Guest Profile View */}
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
              {/* Миний захиалгууд товч */}
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

              {/* Захиалга хянах товч */}
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
          /* Authenticated User Profile */
          <div className="mt-6">
            <div className="flex flex-col items-center py-6 border-b">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <User size={40} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            <div className="py-4 space-y-4">
              {/* Миний захиалгууд товч */}
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

              {/* Захиалга хянах товч */}
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
          /* Login/Signup Forms */
          <div className="mt-6">
            {/* Tab Buttons */}
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

            {/* Login Form */}
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

            {/* Signup Form */}
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

            {/* Quick Actions */}
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
      </SheetContent>
    </Sheet>
  );
}

