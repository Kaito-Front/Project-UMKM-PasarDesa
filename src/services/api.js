const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('pasardesa_token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `API request failed (${response.status})`);
  }

  return response.status === 204 ? null : response.json();
}

export const fetchProducts = () => request('/products?include_hidden=1');
export const fetchOrders = () => request('/orders');
export const fetchStats = () => request('/stats');
export const fetchCurrentUser = () => request('/auth/me');
export const logoutRequest = () => request('/auth/logout', { method: 'POST' });
export async function loginRequest(identifier, password) {
  const result = await request('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) });
  localStorage.setItem('pasardesa_token', result.token);
  return result.user;
}
export async function registerRequest(data) {
  const result = await request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  localStorage.setItem('pasardesa_token', result.token);
  return result.user;
}

export async function fetchCategories() {
  const categories = await request('/categories');
  const totalProducts = categories.reduce((total, category) => total + category.products_count, 0);

  return [
    { id: 'semua', name: 'Semua Kategori', icon: 'LayoutGrid', count: totalProducts },
    ...categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      count: category.products_count,
      desc: category.description,
    })),
  ];
}

export async function fetchShops() {
  const shops = await request('/shops');

  return shops.map(shop => ({
    ...shop,
    categorySlug: shop.category_slug,
    reviewCount: shop.review_count,
    joinDate: shop.join_date,
    operatingHours: shop.operating_hours,
  }));
}

export const createProduct = product => request('/products', {
  method: 'POST',
  body: JSON.stringify(product),
});

export const updateProductVisibility = (productId, isHidden) => request(`/products/${productId}/visibility`, {
  method: 'PATCH',
  body: JSON.stringify({ isHidden }),
});

export const updateProductNumbers = (productId, data) => request(`/products/${productId}`, {
  method: 'PATCH',
  body: JSON.stringify(data),
});

export const createOrder = order => request('/orders', {
  method: 'POST',
  body: JSON.stringify(order),
});

export const updateOrderStatus = (orderId, status) => request(`/orders/${orderId}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status }),
});
