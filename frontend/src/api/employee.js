import { refreshToken, getToken } from '../services/keycloakService'

const GATEWAY_URL = 'http://localhost:8090'

async function authHeaders() {
  await refreshToken(30)
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }
}

export const fetchEmployees = async () => {
  const res = await fetch(`${GATEWAY_URL}/api/employees`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch employees: ${res.status}`)
  return res.json()
}

export const fetchEmployeeById = async (id) => {
  const res = await fetch(`${GATEWAY_URL}/api/employees/${id}`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Employee not found: ${res.status}`)
  return res.json()
}

export const createEmployee = async (employee) => {
  const res = await fetch(`${GATEWAY_URL}/api/employees`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(employee),
  })
  if (!res.ok) throw new Error(`Failed to create employee: ${res.status}`)
  return res.json()
}

export const updateEmployee = async (id, employee) => {
  const res = await fetch(`${GATEWAY_URL}/api/employees/${id}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify(employee),
  })
  if (!res.ok) throw new Error(`Failed to update employee: ${res.status}`)
  return res.json()
}

export const deleteEmployee = async (id) => {
  const res = await fetch(`${GATEWAY_URL}/api/employees/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  })
  if (!res.ok) throw new Error(`Failed to delete employee: ${res.status}`)
}

export const fetchEmployeesByService = async (service) => {
  const res = await fetch(`${GATEWAY_URL}/api/employees/service/${service}`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch employees by service: ${res.status}`)
  return res.json()
}

export const fetchEmployeesByPoste = async (poste) => {
  const res = await fetch(`${GATEWAY_URL}/api/employees/poste/${poste}`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch employees by position: ${res.status}`)
  return res.json()
}

export const fetchEmployeesByStatus = async (status) => {
  const res = await fetch(`${GATEWAY_URL}/api/employees?statut=${status}`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch employees by status: ${res.status}`)
  return res.json()
}
