import { useEffect, useState } from 'react'
import {
  fetchBookings,
  fetchBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
  fetchBookingsByUser,
  fetchBookingsByHotel,
  fetchBookingByConfirmation,
} from '../api/booking'
import { getUser } from '../services/keycloakService'

const initialForm = {
  roomId: '',
  hotelId: '',
  checkInDate: '',
  checkOutDate: '',
  numberOfGuests: 1,
  pricePerNight: '',
  specialRequests: '',
}

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [view, setView] = useState('list')
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [detail, setDetail] = useState(null)

  const [filterMode, setFilterMode] = useState('all')
  const [statusFilter, setStatusFilter] = useState('')
  const [userIdFilter, setUserIdFilter] = useState('')
  const [hotelIdFilter, setHotelIdFilter] = useState('')
  const [confirmationFilter, setConfirmationFilter] = useState('')

  const load = async (mode = filterMode) => {
    setLoading(true)
    setError(null)
    try {
      let data
      if (mode === 'status' && statusFilter) {
        data = await fetchBookings(statusFilter)
      } else if (mode === 'user' && userIdFilter.trim()) {
        data = await fetchBookingsByUser(userIdFilter.trim())
      } else if (mode === 'hotel' && hotelIdFilter.trim()) {
        data = await fetchBookingsByHotel(hotelIdFilter.trim())
      } else if (mode === 'confirmation' && confirmationFilter.trim()) {
        const booking = await fetchBookingByConfirmation(confirmationFilter.trim())
        data = [booking]
      } else {
        data = await fetchBookings()
      }
      setBookings(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm(initialForm)
    setEditTarget(null)
    setView('form')
  }

  const openEdit = (booking) => {
    setForm({
      roomId: booking.roomId,
      hotelId: booking.hotelId,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      numberOfGuests: booking.numberOfGuests,
      pricePerNight: booking.pricePerNight,
      specialRequests: booking.specialRequests || '',
    })
    setEditTarget(booking.id)
    setView('form')
  }

  const openDetail = async (id) => {
    setLoading(true)
    try {
      const data = await fetchBookingById(id)
      setDetail(data)
      setView('detail')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    // Récupérer l'utilisateur connecté depuis Keycloak
    const user = getUser()
    console.log('User from Keycloak:', user)
    
    if (!user) {
      setError('User not authenticated - please login')
      return
    }

    // Utiliser sub (subject) comme userId - c'est l'ID unique Keycloak
    const userId = user.sub || user.preferred_username || user.email
    console.log('Using userId:', userId)

    // Validations
    if (!form.roomId || !form.hotelId || !form.checkInDate || !form.checkOutDate || !form.pricePerNight) {
      setError('Please fill in all required fields')
      return
    }

    // Validation: dates doivent être dans le futur
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkIn = new Date(form.checkInDate)
    const checkOut = new Date(form.checkOutDate)

    if (checkIn <= today) {
      setError('Check-in date must be in the future')
      return
    }

    if (checkOut <= today) {
      setError('Check-out date must be in the future')
      return
    }

    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date')
      return
    }

    const payload = {
      roomId: parseInt(form.roomId),
      hotelId: parseInt(form.hotelId),
      userId: userId,
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      numberOfGuests: parseInt(form.numberOfGuests),
      pricePerNight: parseFloat(form.pricePerNight),
      specialRequests: form.specialRequests,
    }
    
    console.log('Sending booking payload:', payload)
    
    try {
      if (editTarget) {
        await updateBooking(editTarget, payload)
        setSuccess('Booking updated successfully')
      } else {
        const result = await createBooking(payload)
        console.log('Booking created:', result)
        setSuccess('Booking created successfully')
      }
      setView('list')
      load()
    } catch (e) {
      console.error('Booking error:', e)
      setError(e.message)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await cancelBooking(id)
      setSuccess('Booking cancelled')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return
    try {
      await deleteBooking(id)
      setSuccess('Booking deleted')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: '#FFA500',
      CONFIRMED: '#4CAF50',
      CANCELLED: '#F44336',
      COMPLETED: '#2196F3',
    }
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: colors[status] || '#999',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
      }}>
        {status}
      </span>
    )
  }

  return (
    <div>
      <h2>Bookings Management</h2>

      {success && <p style={{ color: 'green', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>{success}</p>}
      {error && <p style={{ color: 'red', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>{error}</p>}

      {/* ── LIST VIEW ── */}
      {view === 'list' && (
        <div>
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <label><strong>Filter: </strong></label>
            <select value={filterMode} onChange={e => setFilterMode(e.target.value)} style={{ marginRight: '10px' }}>
              <option value="all">All Bookings</option>
              <option value="status">By Status</option>
              <option value="user">By User ID</option>
              <option value="hotel">By Hotel ID</option>
              <option value="confirmation">By Confirmation #</option>
            </select>

            {filterMode === 'status' && (
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">Select Status</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            )}

            {filterMode === 'user' && (
              <input
                placeholder="User ID"
                value={userIdFilter}
                onChange={e => setUserIdFilter(e.target.value)}
              />
            )}

            {filterMode === 'hotel' && (
              <input
                placeholder="Hotel ID"
                type="number"
                value={hotelIdFilter}
                onChange={e => setHotelIdFilter(e.target.value)}
              />
            )}

            {filterMode === 'confirmation' && (
              <input
                placeholder="Confirmation Number (ex: BK-XXXX)"
                value={confirmationFilter}
                onChange={e => setConfirmationFilter(e.target.value)}
              />
            )}

            <button onClick={() => load(filterMode)} style={{ marginLeft: '10px' }}>Search</button>
            <button onClick={openCreate} style={{ marginLeft: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
              + New Booking
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {!loading && bookings.length === 0 && <p>No bookings found.</p>}
          {!loading && bookings.length > 0 && (
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#333', color: 'white' }}>
                <tr>
                  <th>ID</th>
                  <th>Confirmation #</th>
                  <th>User ID</th>
                  <th>Hotel ID</th>
                  <th>Room ID</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Guests</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td><strong>{b.confirmationNumber}</strong></td>
                    <td>{b.userId}</td>
                    <td>{b.hotelId}</td>
                    <td>{b.roomId}</td>
                    <td>{b.checkInDate}</td>
                    <td>{b.checkOutDate}</td>
                    <td>{b.numberOfGuests}</td>
                    <td>${b.totalPrice?.toFixed(2) || 'N/A'}</td>
                    <td>{getStatusBadge(b.status)}</td>
                    <td>
                      <button onClick={() => openDetail(b.id)} style={{ marginRight: '5px' }}>View</button>
                      {b.status !== 'CANCELLED' && (
                        <>
                          <button onClick={() => openEdit(b)} style={{ marginRight: '5px' }}>Edit</button>
                          <button onClick={() => handleCancel(b.id)} style={{ marginRight: '5px', backgroundColor: '#ff9800' }}>Cancel</button>
                        </>
                      )}
                      <button onClick={() => handleDelete(b.id)} style={{ backgroundColor: '#f44336', color: 'white' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── DETAIL VIEW ── */}
      {view === 'detail' && detail && (
        <div>
          <button onClick={() => setView('list')}>← Back to List</button>
          <h3>Booking Details — #{detail.confirmationNumber}</h3>
          <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px' }}>
            <tbody>
              <tr><th>Booking ID</th><td>{detail.id}</td></tr>
              <tr><th>Confirmation Number</th><td><strong>{detail.confirmationNumber}</strong></td></tr>
              <tr><th>Status</th><td>{getStatusBadge(detail.status)}</td></tr>
              <tr><th>User ID</th><td>{detail.userId}</td></tr>
              <tr><th>Hotel ID</th><td>{detail.hotelId}</td></tr>
              <tr><th>Room ID</th><td>{detail.roomId}</td></tr>
              <tr><th>Check-In Date</th><td>{detail.checkInDate}</td></tr>
              <tr><th>Check-Out Date</th><td>{detail.checkOutDate}</td></tr>
              <tr><th>Number of Guests</th><td>{detail.numberOfGuests}</td></tr>
              <tr><th>Price per Night</th><td>${detail.pricePerNight?.toFixed(2)}</td></tr>
              <tr><th>Total Price</th><td><strong>${detail.totalPrice?.toFixed(2)}</strong></td></tr>
              <tr><th>Special Requests</th><td>{detail.specialRequests || 'None'}</td></tr>
              <tr><th>Created At</th><td>{new Date(detail.createdAt).toLocaleString()}</td></tr>
            </tbody>
          </table>
          <br />
          {detail.status !== 'CANCELLED' && (
            <>
              <button onClick={() => openEdit(detail)}>Edit Booking</button>{' '}
              <button onClick={() => { handleCancel(detail.id); setView('list') }} style={{ backgroundColor: '#ff9800' }}>Cancel Booking</button>{' '}
            </>
          )}
          <button onClick={() => { handleDelete(detail.id); setView('list') }} style={{ backgroundColor: '#f44336', color: 'white' }}>Delete Booking</button>
        </div>
      )}

      {/* ── FORM VIEW ── */}
      {view === 'form' && (
        <div>
          <button onClick={() => setView('list')}>← Back to List</button>
          <h3>{editTarget ? 'Edit Booking' : 'New Booking'}</h3>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
            Logged in as: <strong>{getUser()?.preferred_username || getUser()?.email || getUser()?.name || 'Unknown'}</strong>
            <br />
            <small style={{ color: '#999' }}>User ID: {getUser()?.sub || 'N/A'}</small>
          </p>
          <table style={{ marginTop: '20px' }}>
            <tbody>
              <tr>
                <td><label>Hotel ID *</label></td>
                <td>
                  <input
                    type="number"
                    value={form.hotelId}
                    onChange={e => setForm(f => ({ ...f, hotelId: e.target.value }))}
                    placeholder="Enter Hotel ID"
                  />
                </td>
              </tr>
              <tr>
                <td><label>Room ID *</label></td>
                <td>
                  <input
                    type="number"
                    value={form.roomId}
                    onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))}
                    placeholder="Enter Room ID"
                  />
                </td>
              </tr>
              <tr>
                <td><label>Check-In Date *</label></td>
                <td>
                  <input
                    type="date"
                    value={form.checkInDate}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    onChange={e => setForm(f => ({ ...f, checkInDate: e.target.value }))}
                  />
                  <small style={{ color: '#999', display: 'block' }}>Must be in the future</small>
                </td>
              </tr>
              <tr>
                <td><label>Check-Out Date *</label></td>
                <td>
                  <input
                    type="date"
                    value={form.checkOutDate}
                    min={form.checkInDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    onChange={e => setForm(f => ({ ...f, checkOutDate: e.target.value }))}
                  />
                  <small style={{ color: '#999', display: 'block' }}>Must be after check-in</small>
                </td>
              </tr>
              <tr>
                <td><label>Number of Guests *</label></td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.numberOfGuests}
                    onChange={e => setForm(f => ({ ...f, numberOfGuests: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Price per Night ($) *</label></td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={form.pricePerNight}
                    onChange={e => setForm(f => ({ ...f, pricePerNight: e.target.value }))}
                    placeholder="0.00"
                  />
                </td>
              </tr>
              <tr>
                <td><label>Special Requests</label></td>
                <td>
                  <textarea
                    value={form.specialRequests}
                    onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))}
                    placeholder="Any special requests? (optional)"
                    rows="3"
                    style={{ width: '300px' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <button onClick={handleSubmit} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px' }}>
            {editTarget ? 'Save Changes' : 'Create Booking'}
          </button>{' '}
          <button onClick={() => setView('list')}>Cancel</button>
        </div>
      )}
    </div>
  )
}
