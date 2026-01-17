"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

// Холбоо барих хуудас - Форм болон холбоо барих мэдээлэл
export const Contact = () => {
  // Формын өгөгдөл
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Форм илгээх
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Имэйл validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: "error",
        message: "Имэйл хаяг буруу байна. @ тэмдэгт орсон байх ёстой.",
      });
      setIsSubmitting(false);
      return;
    }

    // Утасны дугаар validation (8 орон)
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setSubmitStatus({
        type: "error",
        message: "Утасны дугаар 8 оронтой байна.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/contact/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.data || "Баярлалаа! Таны мессеж амжилттай илгээгдлээ.",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Мессеж илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
        });
      }
    } catch {
        setSubmitStatus({
          type: "error",
          message: "Алдаа гарлаа. Дараа дахин оролдоно уу.",
        });
      }

      finally {
          setIsSubmitting(false);
        }
      };

  // Input өөрчлөгдөх үед
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Хэсгийн гарчиг */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-300" />
          <h3 className="text-2xl md:text-3xl font-bold text-center">Холбоо барих</h3>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Холбоо барих форм */}
          <div className="xl:col-span-8">
            <div className="p-6 md:p-8 border border-gray-200 rounded-lg shadow-sm">
              <form onSubmit={handleSubmit}>
                <h4 className="text-xl md:text-2xl font-bold mb-4">Бидэнтэй холбогдох</h4>
                <div className="border-b border-gray-200 mb-6" />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Таны нэр
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имэйл хаяг <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">@ тэмдэгт орсон байх ёстой</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Утасны дугаар <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="99101234"
                    maxLength={8}
                    pattern="\d{8}"
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">утасны дугаар 8 оронтой байна</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мессеж
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                {submitStatus.type && (
                  <div
                    className={`mb-4 p-4 rounded ${
                      submitStatus.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors duration-300 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Илгээж байна..." : "Мессеж илгээх"}
                </button>
              </form>
            </div>
          </div>

          {/* Холбоо барих мэдээлэл */}
          <div className="xl:col-span-4">
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
              <div className="mb-6">
                <h5 className="text-lg font-bold mb-2">Хаяг</h5>
                <p className="text-sm text-gray-600">Макс Молл, Улаанбаатар, Монгол</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div className="mb-6">
                <h5 className="text-lg font-bold mb-2">Утас</h5>
                <p className="text-sm text-gray-600">Үнэгүй (123) 472-796</p>
                <p className="text-sm text-gray-600">Гар утас: +976-9910XXXX</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div className="mb-6">
                <h5 className="text-lg font-bold mb-2">Имэйл</h5>
                <p className="text-sm text-gray-600">info@maxmall.mn</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div>
                <h5 className="text-lg font-bold mb-2">Ажлын өдрүүд</h5>
                <p className="text-sm text-gray-600">Даваа - Баасан / 9:30 - 18:30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
