"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X, LogOut, CheckCircle } from "lucide-react";
import { API_URL } from "@/lib/api";

// Tab төрөл - category эсвэл product
type TabType = "category" | "product";

// Category-ийн төрөл
interface Category {
  _id: string;
  name: string;
  Image?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Size-ын төрөл
interface SizeInfo {
  size: string;
  quantity: number;
  description: string;
}

// Category/Brand object төрөл
interface CategoryBrand {
  _id: string;
  name: string;
}

// Бүтээгдэхүүний төрөл
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  quantity?: number;
  sizes?: SizeInfo[];
  imgCover?: string;
  images?: string[];
  category?: string | CategoryBrand;
  subcategory?: string | CategoryBrand;
  brand?: string | CategoryBrand;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Админ хуудас - Category болон бүтээгдэхүүн удирдах
export const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabType>("category");
  
  const [token, setToken] = useState<string>(() => {
    if (typeof window === 'undefined') return "";
    return localStorage.getItem("adminToken") || "";
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem("adminToken");
  });

  // Системээс гарах
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setIsLoggedIn(false);
  };

  // Client-side only rendering
  if (typeof window === 'undefined') {
    return null;
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={(token) => {
      setToken(token);
      setIsLoggedIn(true);
      localStorage.setItem("adminToken", token);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <a
              href="/admin/verify-payments"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <CheckCircle size={20} />
              Төлбөр батлах
            </a>
            <button
              onClick={handleLogout}
              aria-label="Системээс гарах"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <LogOut size={20} aria-hidden="true" />
              Гарах
            </button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("category")}
                  aria-label="Category оруулах хуудас руу шилжих"
                  aria-current={activeTab === "category" ? "page" : undefined}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    activeTab === "category"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  1. Category оруулах
                </button>
                <button
                  onClick={() => setActiveTab("product")}
                  aria-label="Бүтээгдэхүүн оруулах хуудас руу шилжих"
                  aria-current={activeTab === "product" ? "page" : undefined}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    activeTab === "product"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  2. Бүтээгдэхүүн оруулах
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === "category" ? <CategoryForm token={token} /> : <ProductForm token={token} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Админ нэвтрэх форм
function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        onLogin(data.token);
      } else {
        setError(data.message || "Нэвтрэх нэр эсвэл нууц үг буруу байна");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Нэвтрэх</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Админы и-мэйл хаяг"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Нууц үг</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Админы нууц үг"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-label={loading ? "Нэвтэрч байна" : "Нэвтрэх товч"}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Нэвтэрч байна...
              </span>
            ) : (
              "Нэвтрэх"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Category оруулах болон удирдах форм
function CategoryForm({ token }: { token: string }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const loadCategories = async () => {
    setLoadingList(true);
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data.getAllCategories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("Image", image);
      }

      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { token },
        body: formData,
      });

      if (response.ok) {
        alert("Category амжилттай нэмэгдлээ!");
        setName("");
        setImage(null);
        setImagePreview("");
        loadCategories();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Алдаа гарлаа!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ category-г устгах уу?")) return;
    
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { token },
      });
      
      if (response.ok) {
        alert("Амжилттай устгагдлаа!");
        loadCategories();
      } else {
        alert("Устгахад алдаа гарлаа!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Алдаа гарлаа!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Category оруулах</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Category нэр <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Category нэр"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
              placeholder="Жишээ: Electronics"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Зураг</label>
            
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:border-blue-400">
                <Upload className="w-12 h-12 text-gray-400 mb-2" aria-hidden="true" />
                <span className="text-sm text-gray-500">Зураг сонгох</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  aria-label="Category зураг сонгох"
                />
              </label>
            ) : (
              <div className="relative w-full h-64">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  aria-label="Зургийг устгах"
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-label={loading ? "Уншиж байна" : "Category нэмэх товч"}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Уншиж байна...
              </span>
            ) : (
              "Category нэмэх"
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Бүх Categories</h2>
        
        {loadingList ? (
          <div className="text-center py-8">
            <div className="inline-flex flex-col items-center gap-3">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">Ачааллаж байна...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Category байхгүй байна</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="border rounded-lg p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {cat.Image && !cat.Image.includes('undefined') && (
                  <div className="relative h-32 mb-3">
                    <Image
                      src={cat.Image}
                      alt={cat.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                )}
                <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500 mb-3">ID: {cat._id}</p>
                <button
                  onClick={() => handleDelete(cat._id)}
                  aria-label={`${cat.name} category-г устгах`}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-all duration-200 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Устгах
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Бүтээгдэхүүн оруулах болон удирдах форм
function ProductForm({ token }: { token: string }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    priceAfterDiscount: "",
    quantity: "",
    category: "",
    subcategory: "",
    brand: "",
    isFeatured: false,
  });
  
  // Size-тай холбоотой state-үүд
  const [numberOfSizes, setNumberOfSizes] = useState<number>(3); // Default 3 (S, M, L)
  const [useCustomSizes, setUseCustomSizes] = useState<boolean>(false); // Default size эсвэл өөрийн size
  const [sizes, setSizes] = useState<SizeInfo[]>([
    { size: "S", quantity: 0, description: "" },
    { size: "M", quantity: 0, description: "" },
    { size: "L", quantity: 0, description: "" },
  ]);
  
  const [imgCover, setImgCover] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data.getAllCategories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadProducts = async () => {
    setLoadingList(true);
    try {
      // Бүх бүтээгдэхүүнүүдийг авахын тулд limit=1000 гэж өгнө
      const response = await fetch(`${API_URL}/products?limit=1000`);
      const data = await response.json();
      setProducts(data.getAllProducts || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Size-ын тоог өөрчлөх
  const handleNumberOfSizesChange = (count: number) => {
    setNumberOfSizes(count);
    const newSizes: SizeInfo[] = [];
    
    if (!useCustomSizes) {
      // Default size-ууд: S, M, L, XL, XXL гэх мэт
      const defaultSizes = ["S", "M", "L", "XL", "XXL"];
      for (let i = 0; i < count && i < defaultSizes.length; i++) {
        newSizes.push({
          size: defaultSizes[i],
          quantity: sizes[i]?.quantity || 0,
          description: sizes[i]?.description || "",
        });
      }
    } else {
      // Хэрвээ тоо нэмэгдвэл шинэ size нэмэх
      for (let i = 0; i < count; i++) {
        newSizes.push({
          size: sizes[i]?.size || "",
          quantity: sizes[i]?.quantity || 0,
          description: sizes[i]?.description || "",
        });
      }
    }
    
    setSizes(newSizes);
  };

  // Size-ын утгыг шинэчлэх
  const handleSizeChange = (index: number, field: keyof SizeInfo, value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: value,
    };
    setSizes(newSizes);
  };

  // Default эсвэл custom size солих
  const toggleSizeMode = () => {
    const newMode = !useCustomSizes;
    setUseCustomSizes(newMode);
    
    if (!newMode) {
      // Default size руу буцах
      const defaultSizes = ["S", "M", "L", "XL", "XXL"];
      const newSizes: SizeInfo[] = [];
      for (let i = 0; i < numberOfSizes && i < defaultSizes.length; i++) {
        newSizes.push({
          size: defaultSizes[i],
          quantity: 0,
          description: "",
        });
      }
      setSizes(newSizes);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 6) {
      alert("Хамгийн ихдээ 6 зураг оруулах боломжтой!");
      return;
    }
    
    setImages([...images, ...files]);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCover = () => {
    setImgCover(null);
    setCoverPreview("");
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== false) {
          data.append(key, String(value));
        }
      });
      
      // Size-ын мэдээллийг нэмэх
      if (sizes.length > 0) {
        data.append("sizes", JSON.stringify(sizes));
      }
      
      if (imgCover) data.append("imgCover", imgCover);
      images.forEach((img) => data.append("images", img));

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { token },
        body: data,
      });

      const responseData = await response.json();
      
      if (response.ok) {
        alert("Бүтээгдэхүүн амжилттай нэмэгдлээ!");
        setFormData({
          title: "",
          description: "",
          price: "",
          priceAfterDiscount: "",
          quantity: "",
          category: "",
          subcategory: "",
          brand: "",
          isFeatured: false,
        });
        // Size-ыг default руу буцаах
        setNumberOfSizes(3);
        setUseCustomSizes(false);
        setSizes([
          { size: "S", quantity: 0, description: "" },
          { size: "M", quantity: 0, description: "" },
          { size: "L", quantity: 0, description: "" },
        ]);
        setImgCover(null);
        setImages([]);
        setCoverPreview("");
        setImagePreviews([]);
        await loadProducts(); // Жагсаалтыг дахин ачаалах
      } else {
        alert(responseData.message || responseData.error || "Алдаа гарлаа!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ бүтээгдэхүүнийг устгах уу?")) return;
    
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { token },
      });
      
      if (response.ok) {
        alert("Амжилттай устгагдлаа!");
        loadProducts();
      } else {
        alert("Устгахад алдаа гарлаа!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Алдаа гарлаа!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Бүтээгдэхүүн оруулах</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Нэр <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              aria-label="Бүтээгдэхүүний нэр"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Тайлбар (хамгийн багадаа 10 тэмдэгт) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              aria-label="Бүтээгдэхүүний тайлбар"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
              rows={3}
              minLength={10}
              placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар (хамгийн багадаа 10 тэмдэгт)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/10 тэмдэгт</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Үнэ <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                aria-label="Бүтээгдэхүүний үнэ"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Хөнгөлөлттэй үнэ
              </label>
              <input
                type="number"
                name="priceAfterDiscount"
                value={formData.priceAfterDiscount}
                onChange={handleInputChange}
                aria-label="Хөнгөлөлттэй үнэ"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Size-ын хэсэг */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Size мэдээлэл</h3>
            
            {/* Size-ын горим сонгох */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomSizes}
                  onChange={toggleSizeMode}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Өөрийн size оруулах (default: S, M, L, XL, XXL)</span>
              </label>
            </div>

            {/* Size-ын тоо сонгох */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Хэдэн төрлийн size байгаа вэ?
              </label>
              <input
                type="number"
                value={numberOfSizes}
                onChange={(e) => handleNumberOfSizesChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                min="1"
                max="10"
                placeholder="3"
              />
              <p className="text-xs text-gray-500 mt-1">1-10 хооронд сонгоно уу</p>
            </div>

            {/* Size бүрийн мэдээлэл */}
            <div className="space-y-4">
              {sizes.map((sizeInfo, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-blue-600">Size #{index + 1}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Size нэр */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Size <span className="text-red-500">*</span>
                      </label>
                      {useCustomSizes ? (
                        <input
                          type="text"
                          value={sizeInfo.size}
                          onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="жнь: XL"
                          required
                        />
                      ) : (
                        <input
                          type="text"
                          value={sizeInfo.size}
                          readOnly
                          className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                      )}
                    </div>

                    {/* Тоо ширхэг */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Тоо ширхэг <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={sizeInfo.quantity}
                        onChange={(e) => handleSizeChange(index, "quantity", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        min="0"
                        placeholder="0"
                        required
                      />
                    </div>

                    {/* Нэмэлт тайлбар */}
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium mb-1">
                        Нэмэлт тайлбар
                      </label>
                      <input
                        type="text"
                        value={sizeInfo.description}
                        onChange={(e) => handleSizeChange(index, "description", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="жнь: 40-50кг хүнд тохиромжтой"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                aria-label="Бүтээгдэхүүний category сонгох"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                required
              >
                <option value="">Category сонгох</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Эхлээд Category нэмнэ үү</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                aria-label="Онцгой бүтээгдэхүүн эсэх"
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
              />
              <span className="text-sm font-medium">Онцгой бүтээгдэхүүн (Featured Products хэсэгт харагдана)</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Үндсэн зураг</label>
            {!coverPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:border-blue-400">
                <Upload className="w-10 h-10 text-gray-400 mb-2" aria-hidden="true" />
                <span className="text-sm text-gray-500">Үндсэн зураг сонгох</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverChange}
                  aria-label="Үндсэн зураг сонгох"
                />
              </label>
            ) : (
              <div className="relative w-full h-48">
                <Image
                  src={coverPreview}
                  alt="Cover"
                  fill
                  className="object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  aria-label="Үндсэн зургийг устгах"
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Нэмэлт зургууд (хамгийн ихдээ 6)
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative h-32">
                  <Image
                    src={preview}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-contain rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Зураг ${index + 1}-г устгах`}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            {images.length < 6 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:border-blue-400">
                <Upload className="w-8 h-8 text-gray-400 mb-1" aria-hidden="true" />
                <span className="text-sm text-gray-500">Зураг нэмэх</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  aria-label="Нэмэлт зураг нэмэх"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-label={loading ? "Уншиж байна" : "Бүтээгдэхүүн нэмэх товч"}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Уншиж байна...
              </span>
            ) : (
              "Бүтээгдэхүүн нэмэх"
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Бүх Бүтээгдэхүүнүүд</h2>
        
        {loadingList ? (
          <div className="text-center py-8">
            <div className="inline-flex flex-col items-center gap-3">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">Ачааллаж байна...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Бүтээгдэхүүн байхгүй байна</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {product.imgCover && !product.imgCover.includes('undefined') && (
                  <div className="relative h-40 mb-3">
                    <Image
                      src={product.imgCover}
                      alt={product.title}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                )}
                <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <p className="text-lg font-bold text-blue-600 mb-2">${product.price}</p>
                
                {/* Category болон Brand харуулах */}
                <div className="mb-3 text-xs space-y-1">
                  {product.category && (
                    <p>
                      <span className="font-semibold text-gray-700">Category:</span>{' '}
                      <span className="text-gray-900 font-medium">
                        {typeof product.category === 'string' 
                          ? product.category 
                          : product.category.name}
                      </span>
                    </p>
                  )}
                  {product.brand && (
                    <p>
                      <span className="font-semibold text-gray-700">Brand:</span>{' '}
                      <span className="text-gray-900 font-medium">
                        {typeof product.brand === 'string' 
                          ? product.brand 
                          : product.brand.name}
                      </span>
                    </p>
                  )}
                </div>
                
                {/* Size мэдээлэл харуулах */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-3 text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Sizes:</p>
                    <div className="space-y-1">
                      {product.sizes.map((sizeInfo, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded">
                          <span className="font-medium">{sizeInfo.size}</span>
                          {" - "}
                          <span className="text-gray-600">{sizeInfo.quantity} ширхэг</span>
                          {sizeInfo.description && (
                            <p className="text-gray-500 italic text-xs mt-1">
                              {sizeInfo.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mb-3">ID: {product._id}</p>
                <button
                  onClick={() => handleDelete(product._id)}
                  aria-label={`${product.title} бүтээгдэхүүнийг устгах`}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-all duration-200 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Устгах
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
