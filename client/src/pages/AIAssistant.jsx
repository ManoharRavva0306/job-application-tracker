import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Clock,
  Briefcase,
  Plus,
  Send,
  Calendar as CalendarIcon,
} from 'lucide-react';

const AIAssistant = () => {
  const [role, setRole] = useState('Full Stack Developer');
  const [company, setCompany] = useState('');
  const [days, setDays] = useState(7);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [addedSkills, setAddedSkills] = useState({});

  useEffect(() => {
    // Load existing applications to let user pick one easily
    const loadApps = async () => {
      try {
        const res = await API.get('/applications');
        setApplications(res.data);
        if (res.data.length > 0) {
          setRole(res.data[0].role);
          setCompany(res.data[0].company);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadApps();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!role) return alert('Please enter a target role');
    try {
      setLoading(true);
      const res = await API.post('/ai/plan', { role, company, days });
      setPlan(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating preparation plan');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkillToLearn = async (skillName) => {
    try {
      await API.post('/skills', {
        name: skillName,
        category: 'Core CS & DSA',
        status: 'to-learn',
        startDate: new Date().toISOString().split('T')[0],
        notes: `Recommended by AI Assistant for ${role} at ${company || 'interview'}`,
      });
      setAddedSkills((prev) => ({ ...prev, [skillName]: true }));
      alert(`Added "${skillName}" to your To-Learn list (with today's start date on your Calendar)!`);
    } catch (err) {
      alert('Failed to add skill');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={26} color="var(--primary)" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>AI Preparation & Study Planner</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Generate custom day-by-day interview schedules, mock questions, and add suggested skills directly to your learning roadmap
        </p>
      </div>

      {/* Form Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>
              Target Job Role *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Full Stack Developer, React Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>
              Company (Optional)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Google, Amazon, Microsoft"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>
              Preparation Timeline
            </label>
            <select
              className="input-field"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={3}>3 Days (Crash Prep)</option>
              <option value={7}>7 Days (1 Week Plan)</option>
              <option value={14}>14 Days (2 Weeks Plan)</option>
              <option value={30}>30 Days (Mastery Roadmap)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
            >
              <Sparkles size={18} />
              {loading ? 'Generating Plan...' : 'Generate AI Plan'}
            </button>
          </div>
        </form>

        {/* Quick select from user applications */}
        {applications.length > 0 && (
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick fill from your applications:</span>
            {applications.slice(0, 4).map((app) => (
              <button
                key={app._id}
                type="button"
                onClick={() => { setRole(app.role); setCompany(app.company); }}
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                {app.company} ({app.role})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Generated Plan Section */}
      {plan ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Overview Banner */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              {plan.durationDays}-Day Preparation Plan for {plan.role} {plan.company ? `@ ${plan.company}` : ''}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Follow this structured timeline to maximize your readiness and ace your upcoming interviews.
            </p>
          </div>

          {/* Technical Focus Topics (with Add to To-Learn button) */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="var(--primary)" /> Core Technical Focus Topics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {plan.technicalFocus.map((topic, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{topic}</span>
                  <button
                    onClick={() => handleAddSkillToLearn(topic)}
                    className="btn btn-outline"
                    disabled={addedSkills[topic]}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.3rem 0.6rem',
                      whiteSpace: 'nowrap',
                      color: addedSkills[topic] ? '#10b981' : 'var(--primary)',
                    }}
                    title="Add this skill to your To-Learn roadmap and calendar"
                  >
                    {addedSkills[topic] ? <CheckCircle size={14} /> : <Plus size={14} />}
                    {addedSkills[topic] ? 'Added' : 'Add to Skills'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Schedule Roadmap */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={18} color="var(--accent-interview)" /> Daily Action Plan
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {plan.dailyPlan.map((dayItem) => (
                <div
                  key={dayItem.day}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--bg-main)',
                    borderLeft: `4px solid ${dayItem.day === 1 ? 'var(--primary)' : dayItem.day === plan.durationDays ? '#10b981' : 'var(--accent-interview)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: 'var(--primary)',
                      }}
                    >
                      Day {dayItem.day}
                    </span>
                    <strong style={{ fontSize: '0.95rem' }}>{dayItem.focus}</strong>
                  </div>

                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {dayItem.tasks.map((task, tIndex) => (
                      <li key={tIndex}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Questions */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} color="#f59e0b" /> Mock Interview Questions to Rehearse
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {plan.sampleQuestions.map((q, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--bg-main)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    gap: '0.5rem',
                  }}
                >
                  <strong style={{ color: 'var(--primary)' }}>Q{idx + 1}:</strong>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Sparkles size={45} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Ready to plan your preparation?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0.5rem auto 0 auto' }}>
            Enter your target role and company above, and click <strong>"Generate AI Plan"</strong> to get a customized day-by-day roadmap, mock interview questions, and recommended technical skills.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;