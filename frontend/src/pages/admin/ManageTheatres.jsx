import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Edit2, Trash2, MapPin, X } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);

  const [name, setName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [facilities, setFacilities] = useState('Dolby Atmos, Recliner Seats, Food Court');
  const [screenName, setScreenName] = useState('Audi 1 - IMAX');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const res = await API.get('/theatres');
      if (res.data.success) {
        setTheatres(res.data.theatres);
      }
    } catch (err) {
      toast.error('Failed to load theatres.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTheatre(null);
    setName('');
    setCity('Mumbai');
    setLocation('');
    setAddress('');
    setFacilities('Dolby Atmos, Recliner Seats, Food Court');
    setScreenName('Audi 1 - IMAX');
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTheatre(t);
    setName(t.name);
    setCity(t.city);
    setLocation(t.location);
    setAddress(t.address);
    setFacilities(t.facilities?.join(', ') || '');
    setScreenName(t.screens?.[0]?.name || 'Screen 1');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name,
      city,
      location,
      address,
      facilities: facilities.split(',').map((f) => f.trim()),
      screens: [
        {
          screenNumber: 1,
          name: screenName,
          seatingCapacity: 60,
          soundSystem: 'Dolby Atmos',
          formats: ['2D', '3D', 'IMAX 3D']
        }
      ]
    };

    try {
      if (editingTheatre) {
        const res = await API.put(`/theatres/${editingTheatre._id}`, payload);
        if (res.data.success) {
          toast.success('Theatre updated successfully!');
        }
      } else {
        const res = await API.post('/theatres', payload);
        if (res.data.success) {
          toast.success('New theatre added successfully!');
        }
      }
      setModalOpen(false);
      fetchTheatres();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this theatre and all its scheduled shows?')) return;

    try {
      const res = await API.delete(`/theatres/${id}`);
      if (res.data.success) {
        toast.success('Theatre deleted.');
        setTheatres((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete theatre.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading theatre network..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Cinema Theatres</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Manage theatre partners and auditoriums across cities</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
          <Plus size={16} /> Add New Theatre
        </button>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '14px 18px' }}>Theatre Name</th>
              <th style={{ padding: '14px 18px' }}>City</th>
              <th style={{ padding: '14px 18px' }}>Location</th>
              <th style={{ padding: '14px 18px' }}>Screens</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {theatres.map((t) => (
              <tr key={t._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: '#ffffff' }}>{t.name}</td>
                <td style={{ padding: '14px 18px', color: '#e50914', fontWeight: 600 }}>{t.city}</td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{t.location}</td>
                <td style={{ padding: '14px 18px', color: '#38bdf8' }}>{t.screens?.length || 1} Screen(s)</td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEdit(t)}
                      style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', backgroundColor: '#0f172a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>{editingTheatre ? 'Edit Theatre' : 'Add New Theatre'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>THEATRE NAME</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="e.g. PVR ICON" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>CITY</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="form-input" placeholder="e.g. Mumbai" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>LOCATION / AREA</label>
                  <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} className="form-input" placeholder="e.g. Andheri West" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>FULL ADDRESS</label>
                <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className="form-input" placeholder="Mall name, street address..." />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>SCREEN / AUDI NAME</label>
                <input type="text" required value={screenName} onChange={(e) => setScreenName(e.target.value)} className="form-input" placeholder="e.g. Screen 1 - IMAX" />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>FACILITIES (COMMA-SEPARATED)</label>
                <input type="text" value={facilities} onChange={(e) => setFacilities(e.target.value)} className="form-input" placeholder="Dolby Atmos, Recliners, Food Court" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '8px 20px' }}>{submitting ? 'Saving...' : 'Save Theatre'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTheatres;

