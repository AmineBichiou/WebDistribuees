import { useEffect, useState } from 'react'
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  fetchEmployeesByService,
  fetchEmployeesByPoste,
  fetchEmployeesByStatus,
} from '../api/employee'

const initialForm = {
  nom: '',
  prenom: '',
  dateNaissance: '',
  telephone: '',
  email: '',
  adresse: '',
  poste: '',
  service: '',
  dateEmbauche: '',
  typeContrat: 'CDI',
  salaire: '',
  prime: '',
  heuresTravailParSemaine: 40,
  typeShift: 'JOUR',
}

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [view, setView] = useState('list')
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [detail, setDetail] = useState(null)

  const [filterMode, setFilterMode] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('')
  const [posteFilter, setPosteFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ACTIF')

  const load = async (mode = filterMode, service = serviceFilter, poste = posteFilter, status = statusFilter) => {
    setLoading(true)
    setError(null)
    try {
      let data
      if (mode === 'service' && service.trim()) data = await fetchEmployeesByService(service.trim())
      else if (mode === 'poste' && poste.trim()) data = await fetchEmployeesByPoste(poste.trim())
      else if (mode === 'status' && status) data = await fetchEmployeesByStatus(status)
      else data = await fetchEmployees()
      setEmployees(data)
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

  const openEdit = (employee) => {
    setForm({ ...employee })
    setEditTarget(employee.id)
    setView('form')
  }

  const openDetail = async (id) => {
    setLoading(true)
    try {
      const data = await fetchEmployeeById(id)
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
      salaire: parseFloat(form.salaire),
      prime: form.prime ? parseFloat(form.prime) : null,
      heuresTravailParSemaine: parseInt(form.heuresTravailParSemaine),
    }
    try {
      if (editTarget) {
        await updateEmployee(editTarget, payload)
        setSuccess('Employee updated successfully')
      } else {
        await createEmployee(payload)
        setSuccess('Employee created successfully')
      }
      setView('list')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    try {
      await deleteEmployee(id)
      setSuccess('Employee deleted')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h2>Employees</h2>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ── LIST VIEW ── */}
      {view === 'list' && (
        <div>
          <label>Filter: </label>
          <select value={filterMode} onChange={e => setFilterMode(e.target.value)}>
            <option value="all">All Employees</option>
            <option value="status">By Status</option>
            <option value="service">By Service</option>
            <option value="poste">By Position</option>
          </select>
          {filterMode === 'service' && (
            <input
              placeholder="Service name"
              value={serviceFilter}
              onChange={e => setServiceFilter(e.target.value)}
            />
          )}
          {filterMode === 'poste' && (
            <input
              placeholder="Position"
              value={posteFilter}
              onChange={e => setPosteFilter(e.target.value)}
            />
          )}
          {filterMode === 'status' && (
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ACTIF">ACTIF</option>
              <option value="CONGE">CONGE</option>
              <option value="SUSPENDU">SUSPENDU</option>
              <option value="DEPART">DEPART</option>
            </select>
          )}
          <button onClick={() => load(filterMode, serviceFilter, posteFilter, statusFilter)}>Search</button>
          <button onClick={openCreate} style={{ marginLeft: 12 }}>+ Add Employee</button>

          <br /><br />

          {loading && <p>Loading...</p>}
          {!loading && employees.length === 0 && <p>No employees found.</p>}
          {!loading && employees.length > 0 && (
            <table border="1" cellPadding="8" cellSpacing="0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee #</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.employeeNumber}</td>
                    <td>{emp.nom} {emp.prenom}</td>
                    <td>{emp.email}</td>
                    <td>{emp.telephone}</td>
                    <td>{emp.poste}</td>
                    <td>{emp.service}</td>
                    <td>{emp.statut}</td>
                    <td>
                      <button onClick={() => openDetail(emp.id)}>View</button>{' '}
                      <button onClick={() => openEdit(emp)}>Edit</button>{' '}
                      <button onClick={() => handleDelete(emp.id)}>Delete</button>
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
          <h3>Employee Details — #{detail.employeeNumber}</h3>
          <table border="1" cellPadding="8" cellSpacing="0">
            <tbody>
              <tr><th>ID</th><td>{detail.id}</td></tr>
              <tr><th>Employee Number</th><td>{detail.employeeNumber}</td></tr>
              <tr><th>First Name</th><td>{detail.prenom}</td></tr>
              <tr><th>Last Name</th><td>{detail.nom}</td></tr>
              <tr><th>Birth Date</th><td>{detail.dateNaissance}</td></tr>
              <tr><th>Email</th><td>{detail.email}</td></tr>
              <tr><th>Phone</th><td>{detail.telephone}</td></tr>
              <tr><th>Address</th><td>{detail.adresse}</td></tr>
              <tr><th>Position</th><td>{detail.poste}</td></tr>
              <tr><th>Service</th><td>{detail.service}</td></tr>
              <tr><th>Hire Date</th><td>{detail.dateEmbauche}</td></tr>
              <tr><th>Contract Type</th><td>{detail.typeContrat}</td></tr>
              <tr><th>Status</th><td>{detail.statut}</td></tr>
              <tr><th>Salary</th><td>${detail.salaire}</td></tr>
              <tr><th>Bonus</th><td>${detail.prime || 0}</td></tr>
              <tr><th>Hours/Week</th><td>{detail.heuresTravailParSemaine}</td></tr>
              <tr><th>Shift Type</th><td>{detail.typeShift}</td></tr>
              <tr><th>Created At</th><td>{new Date(detail.createdAt).toLocaleString()}</td></tr>
              <tr><th>Updated At</th><td>{new Date(detail.updatedAt).toLocaleString()}</td></tr>
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
          <h3>{editTarget ? 'Edit Employee' : 'New Employee'}</h3>
          <table>
            <tbody>
              <tr>
                <td><label>Last Name *</label></td>
                <td>
                  <input
                    value={form.nom}
                    onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>First Name *</label></td>
                <td>
                  <input
                    value={form.prenom}
                    onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Birth Date *</label></td>
                <td>
                  <input
                    type="date"
                    value={form.dateNaissance}
                    onChange={e => setForm(f => ({ ...f, dateNaissance: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Email *</label></td>
                <td>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Phone *</label></td>
                <td>
                  <input
                    value={form.telephone}
                    onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Address</label></td>
                <td>
                  <input
                    value={form.adresse}
                    onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Position *</label></td>
                <td>
                  <input
                    value={form.poste}
                    onChange={e => setForm(f => ({ ...f, poste: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Service *</label></td>
                <td>
                  <input
                    value={form.service}
                    onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Hire Date *</label></td>
                <td>
                  <input
                    type="date"
                    value={form.dateEmbauche}
                    onChange={e => setForm(f => ({ ...f, dateEmbauche: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Contract Type *</label></td>
                <td>
                  <select
                    value={form.typeContrat}
                    onChange={e => setForm(f => ({ ...f, typeContrat: e.target.value }))}
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="STAGE">STAGE</option>
                    <option value="FREELANCE">FREELANCE</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><label>Salary ($) *</label></td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={form.salaire}
                    onChange={e => setForm(f => ({ ...f, salaire: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Bonus ($)</label></td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={form.prime}
                    onChange={e => setForm(f => ({ ...f, prime: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Hours/Week *</label></td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="70"
                    value={form.heuresTravailParSemaine}
                    onChange={e => setForm(f => ({ ...f, heuresTravailParSemaine: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Shift Type *</label></td>
                <td>
                  <select
                    value={form.typeShift}
                    onChange={e => setForm(f => ({ ...f, typeShift: e.target.value }))}
                  >
                    <option value="JOUR">JOUR</option>
                    <option value="NUIT">NUIT</option>
                    <option value="MIXTE">MIXTE</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <button onClick={handleSubmit}>{editTarget ? 'Save Changes' : 'Create Employee'}</button>{' '}
          <button onClick={() => setView('list')}>Cancel</button>
        </div>
      )}
    </div>
  )
}
