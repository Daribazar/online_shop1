"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X, LogOut } from "lucide-react";

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

// Бүтээгдэхүүний төрөл
interface Product {
  _id: string;
  title: string;
  descripton: string;
  price: number;
  priceAfterDiscount?: number;
  quantity?: number;
  imgCover?: string;
  images?: string[];
  category?: string;
  subcategory?: string;
  brand?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Backend API хаяг
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <LogOut size={20} />
            Гарах
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("category")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === "category"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  1. Category оруулах
                </button>
                <button
                  onClick={() => setActiveTab("product")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === "product"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
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
        console.log("Image file:", image);
      }

      console.log("FormData entries:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { token },
        body: formData,
      });

      console.log("Response status:", response.status);

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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Жишээ: Electronics"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Зураг</label>
            
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Зураг сонгох</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
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
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Уншиж байна..." : "Category нэмэх"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Бүх Categories</h2>
        
        {loadingList ? (
          <div className="text-center py-8">Ачааллаж байна...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Category байхгүй байна</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="border rounded-lg p-4 hover:shadow-lg transition">
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
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
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
    descripton: "",
    price: "",
    priceAfterDiscount: "",
    quantity: "",
    category: "",
    subcategory: "",
    brand: "",
    isFeatured: false,
  });
  
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
      const response = await fetch(`${API_URL}/products`);
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
      
      if (imgCover) data.append("imgCover", imgCover);
      images.forEach((img) => data.append("images", img));

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { token },
        body: data,
      });

      if (response.ok) {
        alert("Бүтээгдэхүүн амжилттай нэмэгдлээ!");
        setFormData({
          title: "",
          descripton: "",
          price: "",
          priceAfterDiscount: "",
          quantity: "",
          category: "",
          subcategory: "",
          brand: "",
          isFeatured: false,
        });
        setImgCover(null);
        setImages([]);
        setCoverPreview("");
        setImagePreviews([]);
        loadProducts();
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Тайлбар (хамгийн багадаа 10 тэмдэгт) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripton"
              value={formData.descripton}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              minLength={10}
              placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар (хамгийн багадаа 10 тэмдэгт)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.descripton.length}/10 тэмдэгт</p>
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Тоо ширхэг</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              placeholder="0"
            />
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Онцгой бүтээгдэхүүн (Featured Products хэсэгт харагдана)</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Үндсэн зураг</label>
            {!coverPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Үндсэн зураг сонгох</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverChange}
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
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X size={20} />
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
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {images.length < 6 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">Зураг нэмэх</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Уншиж байна..." : "Бүтээгдэхүүн нэмэх"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Бүх Бүтээгдэхүүнүүд</h2>
        
        {loadingList ? (
          <div className="text-center py-8">Ачааллаж байна...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Бүтээгдэхүүн байхгүй байна</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition">
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
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.descripton}</p>
                <p className="text-lg font-bold text-blue-600 mb-2">${product.price}</p>
                <p className="text-xs text-gray-500 mb-3">ID: {product._id}</p>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
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
