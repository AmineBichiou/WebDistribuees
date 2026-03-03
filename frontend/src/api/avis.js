import { refreshToken, getToken } from '../services/keycloakService'

const GATEWAY_URL = 'http://localhost:8090'

async function authHeaders() {
  await refreshToken(30)
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }
}

export const fetchAllAvis = async () => {
  const res = await fetch(`${GATEWAY_URL}/avis`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch avis: ${res.status}`)
  return res.json()
}

export const createAvis = async (avis) => {
  const res = await fetch(`${GATEWAY_URL}/avis`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(avis),
  })
  if (!res.ok) throw new Error(`Failed to create avis: ${res.status}`)
  return res.json()
}

export const updateAvis = async (id, avis) => {
  const res = await fetch(`${GATEWAY_URL}/avis/${id}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify(avis),
  })
  if (!res.ok) throw new Error(`Failed to update avis: ${res.status}`)
  return res.json()
}

export const deleteAvis = async (id) => {
  const res = await fetch(`${GATEWAY_URL}/avis/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  })
  if (!res.ok) throw new Error(`Failed to delete avis: ${res.status}`)
}