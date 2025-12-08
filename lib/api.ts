// Backend API-ийн үндсэн хаяг
const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  // undefined эсвэл хоосон string бол default хаяг ашиглах
  if (!envUrl || envUrl === 'undefined') {
    return 'http://localhost:5001/api/v1';
  }
  return envUrl;
};

const API_URL = getApiUrl();

// Бүх категориудыг татаж авах
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data.getAllCategories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Бүх бүтээгдэхүүнүүдийг татаж авах
export async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.getAllProducts || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// ID-аар бүтээгдэхүүний дэлгэрэнгүй мэдээлэл татаж авах
export async function fetchProductById(id: string) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    console.log('Product API response:', data);
    return data.product || data.getSpecificProduct || data || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
