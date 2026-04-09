// ─── API клиент ──────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function getToken() {
  return localStorage.getItem('access_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options })

  if (res.status === 401) {
    // Попытка обновить токен
    const refreshed = await tryRefresh()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`
      const retry = await fetch(`${BASE_URL}${path}`, { headers, ...options })
      if (!retry.ok) {
        const err = await retry.json().catch(() => ({}))
        throw new Error(err.message || `HTTP ${retry.status}`)
      }
      return retry.json()
    } else {
      localStorage.removeItem('access_token')
      window.location.href = '/admin/login'
      throw new Error('Unauthorized')
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

async function tryRefresh() {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem('access_token', data.accessToken)
    return true
  } catch {
    return false
  }
}

// ─── Книги ───────────────────────────────────────────────────────────────────
export const booksApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/books${qs ? '?' + qs : ''}`)
  },
  getById: (id) => request(`/books/${id}`),
  create: (data) => request('/books', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/books/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/books/${id}`, { method: 'DELETE' }),
}

// ─── Категории ───────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => request('/categories'),
  create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
}

// ─── Авторы ──────────────────────────────────────────────────────────────────
export const authorsApi = {
  getAll: () => request('/authors'),
  create: (data) => request('/authors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/authors/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/authors/${id}`, { method: 'DELETE' }),
}

// ─── Баннеры ─────────────────────────────────────────────────────────────────
export const bannersApi = {
  getActive: () => request('/banners/active'),
  getAll: () => request('/banners'),
  create: (data) => request('/banners', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/banners/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/banners/${id}`, { method: 'DELETE' }),
}

// ─── Заказы ──────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/orders${qs ? '?' + qs : ''}`)
  },
  updateStatus: (id, status) => request(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

// ─── Загрузка изображений ─────────────────────────────────────────────────────
export const uploadApi = {
  upload: async (file) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    if (!res.ok) throw new Error('Ошибка загрузки')
    return res.json()
  },
}

// ─── Авторизация ─────────────────────────────────────────────────────────────
export const authApi = {
  login: async (login, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ login, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Неверный логин или пароль')
    }
    const data = await res.json()
    localStorage.setItem('access_token', data.accessToken)
    return data
  },
  logout: async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    localStorage.removeItem('access_token')
  },
  isAuthenticated: () => !!localStorage.getItem('access_token'),
}
