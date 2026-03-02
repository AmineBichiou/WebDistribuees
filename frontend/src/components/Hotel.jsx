import { useEffect, useState } from 'react'
import {
  fetchHotels,
  fetchHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  fetchAvailableHotels,
  fetchHotelsByCity,
} from '../api/hotel'

const initialForm = {
  name: '',
  city: '',
  address: '',
  pricePerNight: '',
  rating: 1,
  available: true,
}

export default function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [view, setView] = useState('list')
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [detail, setDetail] = useState(null)

  const [filterMode, setFilterMode] = useState('all')
  const [cityFilter, setCityFilter] = useState('')

  const load = async (mode = filterMode, city = cityFilter) => {
    setLoading(true)
    setError(null)
    try {
      let data
      if (mode === 'available') data = await fetchAvailableHotels()
      else if (mode === 'city' && city.trim()) data = await fetchHotelsByCity(city.trim())
      else data = await fetchHotels()
      setHotels(data)
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

  const openEdit = (hotel) => {
    setForm({ ...hotel })
    setEditTarget(hotel.id)
    setView('form')
  }

  const openDetail = async (id) => {
    setLoading(true)
    try {
      const data = await fetchHotelById(id)
      setDetail(data)
      setView('detail')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    const payload = {
      ...form,
      pricePerNight: parseFloat(form.pricePerNight),
      rating: parseInt(form.rating),
    }
    try {
      if (editTarget) {
        await updateHotel(editTarget, payload)
        setSuccess('Hotel updated successfully')
      } else {
        await createHotel(payload)
        setSuccess('Hotel created successfully')
      }
      setView('list')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this hotel?')) return
    try {
      await deleteHotel(id)
      setSuccess('Hotel deleted')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h2>Hotels</h2>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ── LIST VIEW ── */}
      {view === 'list' && (
        <div>
          <label>Filter: </label>
          <select value={filterMode} onChange={e => setFilterMode(e.target.value)}>
            <option value="all">All Hotels</option>
            <option value="available">Available Only</option>
            <option value="city">By City</option>
          </select>
          {filterMode === 'city' && (
            <input
              placeholder="City name"
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
            />
          )}
          <button onClick={() => load(filterMode, cityFilter)}>Search</button>
          <button onClick={openCreate} style={{ marginLeft: 12 }}>+ Add Hotel</button>

          <br /><br />

          {loading && <p>Loading...</p>}
          {!loading && hotels.length === 0 && <p>No hotels found.</p>}
          {!loading && hotels.length > 0 && (
            <table border="1" cellPadding="8" cellSpacing="0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Address</th>
                  <th>Price/Night</th>
                  <th>Rating</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map(h => (
                  <tr key={h.id}>
                    <td>{h.id}</td>
                    <td>{h.name}</td>
                    <td>{h.city}</td>
                    <td>{h.address}</td>
                    <td>${h.pricePerNight}</td>
                    <td>{h.rating} / 5</td>
                    <td>{h.available ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => openDetail(h.id)}>View</button>{' '}
                      <button onClick={() => openEdit(h)}>Edit</button>{' '}
                      <button onClick={() => handleDelete(h.id)}>Delete</button>
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
          <button onClick={() => setView('list')}>← Back</button>
          <h3>Hotel Details — #{detail.id}</h3>
          <table border="1" cellPadding="8" cellSpacing="0">
            <tbody>
              <tr><th>Name</th><td>{detail.name}</td></tr>
              <tr><th>City</th><td>{detail.city}</td></tr>
              <tr><th>Address</th><td>{detail.address}</td></tr>
              <tr><th>Price / Night</th><td>${detail.pricePerNight}</td></tr>
              <tr><th>Rating</th><td>{detail.rating} / 5</td></tr>
              <tr><th>Available</th><td>{detail.available ? 'Yes' : 'No'}</td></tr>
            </tbody>
          </table>
          <br />
          <button onClick={() => openEdit(detail)}>Edit</button>{' '}
          <button onClick={() => { handleDelete(detail.id); setView('list') }}>Delete</button>
        </div>
      )}

      {view === 'form' && (
        <div>
          <button onClick={() => setView('list')}>← Back</button>
          <h3>{editTarget ? 'Edit Hotel' : 'New Hotel'}</h3>
          <table>
            <tbody>
              <tr>
                <td><label>Name</label></td>
                <td>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>City</label></td>
                <td>
                  <input
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Address</label></td>
                <td>
                  <input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Price / Night ($)</label></td>
                <td>
                  <input
                    type="number"
                    value={form.pricePerNight}
                    onChange={e => setForm(f => ({ ...f, pricePerNight: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Rating (1–5)</label></td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Available</label></td>
                <td>
                  <select
                    value={form.available}
                    onChange={e => setForm(f => ({ ...f, available: e.target.value === 'true' }))}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <button onClick={handleSubmit}>{editTarget ? 'Save Changes' : 'Create Hotel'}</button>{' '}
          <button onClick={() => setView('list')}>Cancel</button>
        </div>
      )}
    </div>
  )
}