import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Award,
  BookOpen,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle,
  RotateCcw,
  Trash2,
  Tag,
  Star,
} from 'lucide-react';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'learnt', 'to-learn'

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    status: 'to-learn',
    proficiency: 'Intermediate',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await API.get('/skills');
      setSkills(res.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/skills', formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        category: 'Frontend',
        status: 'to-learn',
        proficiency: 'Intermediate',
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      fetchSkills();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating skill');
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/skills/${id}/toggle`);
      fetchSkills();
    } catch (err) {
      alert('Failed to toggle skill status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await API.delete(`/skills/${id}`);
        fetchSkills();
      } catch (err) {
        alert('Failed to delete skill');
      }
    }
  };

  const learntSkills = skills.filter((s) => s.status === 'learnt');
  const toLearnSkills = skills.filter((s) => s.status === 'to-learn');

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'Advanced': return '#10b981';
      case 'Intermediate': return '#3b82f6';
      case 'Beginner': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Skills & Learning Roadmap</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage skills you have mastered and plan future skills with calendar start dates
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={18} /> Add New Skill
        </button>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Skills Mastered</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.3rem', color: '#10b981' }}>
            {learntSkills.length}
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Skills To Learn</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.3rem', color: '#3b82f6' }}>
            {toLearnSkills.length}
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Tracked</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.3rem', color: '#f59e0b' }}>
            {skills.length}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Learnt vs To-Learn */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Column 1: Skills Learnt */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Award size={22} color="#10b981" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Skills Learnt ({learntSkills.length})</h2>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : learntSkills.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No mastered skills logged yet. Add one above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {learntSkills.map((skill) => (
                <div key={skill._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <strong style={{ fontSize: '1.05rem' }}>{skill.name}</strong>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: `${getProficiencyColor(skill.proficiency)}20`,
                          color: getProficiencyColor(skill.proficiency),
                          fontSize: '0.75rem',
                        }}
                      >
                        {skill.proficiency}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Tag size={13} /> {skill.category}
                      </span>
                      {skill.notes && <span>� {skill.notes}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleToggle(skill._id)}
                      className="btn btn-outline"
                      title="Move back to To-Learn"
                      style={{ padding: '0.4rem' }}
                    >
                      <RotateCcw size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="btn btn-outline"
                      style={{ padding: '0.4rem', color: 'var(--accent-rejected)' }}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Skills To Learn */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BookOpen size={22} color="#3b82f6" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>To-Learn List ({toLearnSkills.length})</h2>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : toLearnSkills.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No pending skills to learn. Plan your learning roadmap above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {toLearnSkills.map((skill) => (
                <div
                  key={skill._id}
                  className="card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: '4px solid var(--primary)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <strong style={{ fontSize: '1.05rem' }}>{skill.name}</strong>
                      <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)', fontSize: '0.75rem' }}>
                        {skill.category}
                      </span>
                    </div>

                    {skill.startDate && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginTop: '0.35rem',
                          fontSize: '0.8rem',
                          color: 'var(--accent-interview)',
                          fontWeight: 600,
                        }}
                      >
                        <CalendarIcon size={14} />
                        <span>Starts: {new Date(skill.startDate).toLocaleDateString()} (Shown in Calendar)</span>
                      </div>
                    )}

                    {skill.notes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {skill.notes}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleToggle(skill._id)}
                      className="btn btn-outline"
                      title="Mark as Mastered / Learnt!"
                      style={{ padding: '0.4rem', color: '#10b981' }}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="btn btn-outline"
                      style={{ padding: '0.4rem', color: 'var(--accent-rejected)' }}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Skill Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ maxWidth: '480px', width: '100%' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.2rem' }}>Add New Skill</h3>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                  Skill Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. React Native, System Design, Docker"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Section
                  </label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="to-learn">To-Learn List</option>
                    <option value="learnt">Skills Learnt</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Category
                  </label>
                  <select
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Core CS & DSA">Core CS & DSA</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {formData.status === 'to-learn' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Start Date (Syncs with Calendar!) ??
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                    This date will automatically appear on your Calendar!
                  </small>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Proficiency Level
                  </label>
                  <select
                    className="input-field"
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                  Notes / Resources (Optional)
                </label>
                <textarea
                  className="input-field"
                  rows="2"
                  placeholder="e.g. Official Docs, FreeCodeCamp tutorial..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
