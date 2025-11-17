const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

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

export async function fetchProductById(id: string) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
