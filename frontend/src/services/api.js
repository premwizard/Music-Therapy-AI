const API_BASE_URL = '/api'
const TOKEN_STORAGE_KEY = 'music_therapy_token'

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredToken(token) {
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

async function request(path, options = {}) {
  const { method = 'GET', headers = {}, body, skipAuth = false } = options
  const token = getStoredToken()
  const requestHeaders = { ...headers }

  if (!skipAuth && token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  let requestBody = body
  const isFormData = body instanceof FormData

  if (!isFormData && body && typeof body === 'object') {
    requestHeaders['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    const message = json?.message || response.statusText || 'API request failed'
    throw new Error(message)
  }

  return json
}

export async function loginUser({ username, password }) {
  const response = await request('/auth/login', {
    method: 'POST',
    body: { username, password },
    skipAuth: true,
  })
  return response.data?.access_token
}

export async function registerUser({ username, password, meta }) {
  const response = await request('/auth/register', {
    method: 'POST',
    body: { username, password, meta },
    skipAuth: true,
  })
  return response.data?.access_token
}

export async function getProfile() {
  const response = await request('/auth/profile')
  return response.data
}

export async function detectTextEmotion(text) {
  const response = await request('/emotion/text', {
    method: 'POST',
    body: { text },
  })
  return response.data
}

export async function detectImageEmotion(imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)
  const response = await request('/emotion/image', {
    method: 'POST',
    body: formData,
  })
  return response.data
}

export async function detectVoiceEmotion(audioFile) {
  const formData = new FormData()
  formData.append('audio', audioFile)
  const response = await request('/emotion/voice', {
    method: 'POST',
    body: formData,
  })
  return response.data
}

export async function getTherapyResponse(emotion, message) {
  const response = await request('/ai/therapy', {
    method: 'POST',
    body: { emotion, message },
  })
  return response.data
}

export async function getMusicRecommendations(emotion, limit = 6) {
  const query = new URLSearchParams({ emotion, limit: String(limit) }).toString()
  const response = await request(`/music/recommend?${query}`)
  return response.data
}

export async function saveMood({ emotion, notes, source }) {
  const response = await request('/mood/save', {
    method: 'POST',
    body: { emotion, notes, source },
  })
  return response.data
}

export async function getMoodHistory(limit = 50) {
  const query = new URLSearchParams({ limit: String(limit) }).toString()
  const response = await request(`/mood/history?${query}`)
  return response.data
}
