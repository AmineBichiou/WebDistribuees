import { useEffect, useState } from 'react'
import { fetchAllAvis, createAvis, updateAvis, deleteAvis } from '../api/avis'

const initialForm = {
  commentaire: '',
  note: 1,
}

export default function Avis() {
  const [avisList, setAvisList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [view, setView] = useState('list')
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(initialForm)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllAvis()
      setAvisList(data)
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

  const openEdit = (avis) => {
    setForm({ commentaire: avis.commentaire, note: avis.note })
    setEditTarget(avis.id)
    setView('form')
  }

  const handleSubmit = async () => {
    const payload = { ...form, note: parseInt(form.note) }
    try {
      if (editTarget) {
        await updateAvis(editTarget, payload)
        setSuccess('Avis updated successfully')
      } else {
        await createAvis(payload)
        setSuccess('Avis created successfully')
      }
      setView('list')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this avis?')) return
    try {
      await deleteAvis(id)
      setSuccess('Avis deleted')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h2>Avis</h2>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {view === 'list' && (
        <div>
          <button onClick={openCreate}>+ Add Avis</button>
          <br /><br />

          {loading && <p>Loading...</p>}
          {!loading && avisList.length === 0 && <p>No avis found.</p>}
          {!loading && avisList.length > 0 && (
            <table border="1" cellPadding="8" cellSpacing="0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Commentaire</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {avisList.map(a => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.commentaire}</td>
                    <td>{a.note} / 5</td>
                    <td>
                      <button onClick={() => openEdit(a)}>Edit</button>{' '}
                      <button onClick={() => handleDelete(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {view === 'form' && (
        <div>
          <button onClick={() => setView('list')}>← Back</button>
          <h3>{editTarget ? 'Edit Avis' : 'New Avis'}</h3>
          <table>
            <tbody>
              <tr>
                <td><label>Commentaire</label></td>
                <td>
                  <textarea
                    rows="4"
                    cols="40"
                    value={form.commentaire}
                    onChange={e => setForm(f => ({ ...f, commentaire: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Note (1–5)</label></td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.note}
                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <button onClick={handleSubmit}>{editTarget ? 'Save Changes' : 'Create Avis'}</button>{' '}
          <button onClick={() => setView('list')}>Cancel</button>
        </div>
      )}
    </div>
  )
}