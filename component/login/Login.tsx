"use client";

import Link from "next/link";
import { Facebook, Lock } from "lucide-react";

export const Login = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 md:p-8">
                <h4 className="text-2xl font-bold text-center mb-4">User Login</h4>
                <hr className="mb-4" />
                
                <p className="mb-3 text-gray-700">Join / Sign In using</p>
                
                {/* Social Login */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                    >
                      <Facebook size={18} />
                      Facebook
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                  </div>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <p className="font-bold text-gray-600">Or</p>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Login Form */}
                <form className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div>
                    <Link
                      href="/forgot-password"
                      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition w-full"
                    >
                      <Lock size={18} />
                      Forgot Password
                    </Link>
                  </div>

                  <hr className="my-4" />

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded transition font-medium"
                    >
                      Login
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don&apos;t have an account?{" "}
                      <Link href="/signup" className="text-red-600 hover:text-red-700 font-medium">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
