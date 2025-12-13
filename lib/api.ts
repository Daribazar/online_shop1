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

// API_URL-г export хийх (бусад компонентод ашиглахын тулд)
export { API_URL };

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
export async function fetchProducts(limit: number = 1000) {
  try {
    const response = await fetch(`${API_URL}/products?limit=${limit}`);
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
    return data.product || data.getSpecificProduct || data || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Сагс авах
export async function fetchCart(token: string) {
  try {
    const response = await fetch(`${API_URL}/carts`, {
      headers: {
        token: token,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    const data = await response.json();
    return data.cart || data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

// Бэлэн мөнгөөр захиалга үүсгэх
export async function createCashOrder(cartId: string, shippingAddress: any, token: string) {
  try {
    const response = await fetch(`${API_URL}/orders/${cartId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({ shippingAddress }),
    });
    if (!response.ok) throw new Error('Failed to create order');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Stripe checkout session үүсгэх
export async function createCheckoutSession(cartId: string, shippingAddress: any, token: string) {
  try {
    const response = await fetch(`${API_URL}/orders/checkOut/${cartId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({ shippingAddress }),
    });
    if (!response.ok) throw new Error('Failed to create checkout session');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
}