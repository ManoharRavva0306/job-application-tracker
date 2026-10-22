import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ApplicationModal from '../components/ApplicationModal';
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  DollarSign,
  Briefcase,
} from 'lucide-react';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ Total: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 });
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get('/applications/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let query = `?status=${selectedStatus}`;
      if (searchTerm) query += `&search=${searchTerm}`;
      const res = await API.get(`/applications${query}`);
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus, searchTerm]);

  const handleSave = async (formData) => {
    try {
      if (editingApp) {
        await API.put(`/applications/${editingApp._id}`, formData);
      } else {
        await API.post('/applications', formData);
      }
      setIsModalOpen(false);
      setEditingApp(null);
      fetchApplications();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving application');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await API.delete(`/applications/${id}`);
        fetchApplications();
        fetchStats();
      } catch (err) {
        alert('Failed to delete application');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.patch(`/applications/${id}/status`, { status: newStatus });
      fetchApplications();
      fetchStats();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Applied': return 'badge-applied';
      case 'Interview': return 'badge-interview';
      case 'Offer': return 'badge-offer';
      case 'Rejected': return 'badge-rejected';
      default: return 'badge-applied';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Job Applications Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track and manage your application pipeline stages
          </p>
        </div>
        <button
          onClick={() => { setEditingApp(null); setIsModalOpen(true); }}
          className="btn btn-primary"
        >
          <Plus size={18} /> Add Application
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Applications</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.3rem' }}>{stats.Total}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-applied)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Applied</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.3rem', color: 'var(--accent-applied)' }}>{stats.Applied}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-interview)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interviewing</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.3rem', color: 'var(--accent-interview)' }}>{stats.Interview}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-offer)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Offers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.3rem', color: 'var(--accent-offer)' }}>{stats.Offer}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-rejected)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rejected</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.3rem', color: 'var(--accent-rejected)' }}>{stats.Rejected}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="input-field"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className="btn btn-outline"
              style={{
                fontSize: '0.8rem',
                padding: '0.4rem 0.75rem',
                borderColor: selectedStatus === status ? 'var(--primary)' : 'var(--border-color)',
                backgroundColor: selectedStatus === status ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: selectedStatus === status ? 'var(--primary)' : 'var(--text-main)',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No applications found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Click "Add Application" above to begin tracking your job journey!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {applications.map((app) => (
            <div key={app._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{app.role}</h3>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {app.company}
                  </div>
                </div>

                {/* Status Dropdown */}
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className={`badge ${getBadgeClass(app.status)}`}
                  style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Details & Dates */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {app.salaryExpectation && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <DollarSign size={15} color="var(--primary)" />
                    <span>Expected: {app.salaryExpectation}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CalendarIcon size={15} />
                  <span>Applied: {new Date(app.applicationDate).toLocaleDateString()}</span>
                </div>
                {app.interviewDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-interview)', fontWeight: 600 }}>
                    <CalendarIcon size={15} />
                    <span>Interview: {new Date(app.interviewDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {app.notes && (
                <div style={{ fontSize: '0.85rem', backgroundColor: 'var(--bg-main)', padding: '0.5rem', borderRadius: '0.4rem', color: 'var(--text-muted)' }}>
                  {app.notes}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                {app.jobLink ? (
                  <a
                    href={app.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                  >
                    <ExternalLink size={14} /> Link
                  </a>
                ) : <span />}

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => { setEditingApp(app); setIsModalOpen(true); }}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.5rem' }}
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.5rem', color: 'var(--accent-rejected)' }}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingApp(null); }}
        onSave={handleSave}
        initialData={editingApp}
      />
    </div>
  );
};

export default Dashboard;