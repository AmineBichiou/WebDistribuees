import { refreshToken, getToken } from '../services/keycloakService'

const GATEWAY_URL = 'http://localhost:8090'

async function authHeaders() {
  await refreshToken(30)
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }
}

export const fetchHotels = async () => {
  const res = await fetch(`${GATEWAY_URL}/hotels`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch hotels: ${res.status}`)
  return res.json()
}

export const fetchHotelById = async (id) => {
  const res = await fetch(`${GATEWAY_URL}/hotels/${id}`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Hotel not found: ${res.status}`)
  return res.json()
}

export const createHotel = async (hotel) => {
  const res = await fetch(`${GATEWAY_URL}/hotels`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(hotel),
  })
  if (!res.ok) throw new Error(`Failed to create hotel: ${res.status}`)
  return res.json()
}

export const updateHotel = async (id, hotel) => {
  const res = await fetch(`${GATEWAY_URL}/hotels/${id}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify(hotel),
  })
  if (!res.ok) throw new Error(`Failed to update hotel: ${res.status}`)
  return res.json()
}

export const deleteHotel = async (id) => {
  const res = await fetch(`${GATEWAY_URL}/hotels/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  })
  if (!res.ok) throw new Error(`Failed to delete hotel: ${res.status}`)
}

export const fetchAvailableHotels = async () => {
  const res = await fetch(`${GATEWAY_URL}/hotels/available`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch available hotels: ${res.status}`)
  return res.json()
}

export const fetchHotelsByCity = async (city) => {
  const res = await fetch(`${GATEWAY_URL}/hotels/city/${city}`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch hotels by city: ${res.status}`)
  return res.json()
}