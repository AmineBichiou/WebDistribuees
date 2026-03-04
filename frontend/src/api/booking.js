import { refreshToken, getToken } from '../services/keycloakService'

const GATEWAY_URL = 'http://localhost:8090'

async function authHeaders() {
  await refreshToken(30)
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }
}

/**
 * Créer une nouvelle réservation
 * @param {Object} booking - { roomId, hotelId, userId, checkInDate, checkOutDate, numberOfGuests, pricePerNight, specialRequests }
 * @returns {Promise<Object>} La réservation créée
 */
export const createBooking = async (booking) => {
  const res = await fetch(`${GATEWAY_URL}/api/bookings`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(booking),
  })
  if (!res.ok) throw new Error(`Failed to create booking: ${res.status}`)
  return res.json()
}

/**
 * Récupérer toutes les réservations
 * @param {string} status - (Optionnel) Filtre par statut: PENDING, CONFIRMED, CANCELLED, COMPLETED
 * @returns {Promise<Array>} Liste des réservations
 */
export const fetchBookings = async (status = null) => {
  const url = status 
    ? `${GATEWAY_URL}/api/bookings?status=${status}` 
    : `${GATEWAY_URL}/api/bookings`
  
  const res = await fetch(url, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`)
  return res.json()
}

/**
 * Récupérer une réservation par ID
 * @param {number} id - ID de la réservation
 * @returns {Promise<Object>} La réservation
 */
export const fetchBookingById = async (id) => {
  const res = await fetch(`${GATEWAY_URL}/api/bookings/${id}`, { 
    headers: await authHeaders() 
  })
  if (!res.ok) throw new Error(`Booking not found: ${res.status}`)
  return res.json()
}

/**
 * Récupérer une réservation par numéro de confirmation
 * @param {string} confirmationNumber - Numéro de confirmation (ex: BK-XXXX)
 * @returns {Promise<Object>} La réservation
 */
export const fetchBookingByConfirmation = async (confirmationNumber) => {
  const res = await fetch(`${GATEWAY_URL}/api/bookings/confirmation/${confirmationNumber}`, {
    headers: await authHeaders()
  })
  if (!res.ok) throw new Error(`Booking not found: ${res.status}`)
  return res.json()
}

/**
 * Récupérer toutes les réservations d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des réservations de l'utilisateur
 */
export const fetchBookingsByUser = async (userId) => {
  const res = await fetch(`${GATEWAY_URL}/api/bookings/user/${userId}`, {
    headers: await authHeaders()
  })
  if (!res.ok) throw new Error(`Failed to fetch user bookings: ${res.status}`)
  return res.json()
}

/**
 * Récupérer toutes les réservations d'un hôtel
 * @param {number} hotelId - ID de l'hôtel
 * @returns {Promise<Array>} Liste des réservations de l'hôtel
 */
export const fetchBookingsByHotel = async (hotelId) => {
  const res = await fetch(`${GATEWAY_URL}/api/bookings/hotel/${hotelId}`, {
    headers: await authHeaders()
  })
  if (!res.ok) throw new Error(`Failed to fetch hotel bookings: ${res.status}`)
  return res.json()
}

/**
 * Mettre à jour une réservation
 * @param {number} id - ID de la réservation
 * @param {Object} updates - { checkInDate, checkOutDate, numberOfGuests, specialRequests }
 * @returns {Promise<Object>} La réservation mise à jour
 */
export const updateBooking = async (id, updates) => {
  const res = await fetch(`${GATEWAY_URL}/api/bookings/${id}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error(`Failed to update booking: ${res.status}`)
  return res.json()
}

/**
 * Annuler une réservation
 * @param {number} id - ID de la réservation
 * @returns {Promise<Object>} La réservation annulée
 */
export const cancelBooking = async (id) => {
  const res = await fetch(`${GATEWAY_URL}/api/bookings/${id}/cancel`, {
    method: 'PATCH',
    headers: await authHeaders(),
  })
  if (!res.ok) throw new Error(`Failed to cancel booking: ${res.status}`)
  return res.json()
}

/**
 * Supprimer une réservation
 * @param {number} id - ID de la réservation
 * @returns {Promise<void>}
 */
export const deleteBooking = async (id) => {
  const res = await fetch(`${GATEWAY_URL}/api/bookings/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  })
  if (!res.ok) throw new Error(`Failed to delete booking: ${res.status}`)
}

/**
 * Health check du Booking Service
 * @returns {Promise<string>} Message de santé
 */
export const checkBookingServiceHealth = async () => {
  const res = await fetch(`${GATEWAY_URL}/api/bookings/health`, {
    headers: await authHeaders()
  })
  if (!res.ok) throw new Error(`Booking service unhealthy: ${res.status}`)
  return res.text()
}
