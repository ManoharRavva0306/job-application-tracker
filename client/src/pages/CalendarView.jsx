import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Briefcase,
  BookOpen,
  Clock,
  Filter,
} from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [applications, setApplications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState('all'); // 'all', 'interview', 'skill', 'applied'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appRes, skillRes] = await Promise.all([
          API.get('/applications'),
          API.get('/skills?status=to-learn'),
        ]);
        setApplications(appRes.data);
        setSkills(skillRes.data);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calendar Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Build events lookup by YYYY-MM-DD
  const eventsByDate = {};

  const addEvent = (dateStr, eventObj) => {
    if (!dateStr) return;
    const formattedDate = new Date(dateStr).toISOString().split('T')[0];
    if (!eventsByDate[formattedDate]) {
      eventsByDate[formattedDate] = [];
    }
    eventsByDate[formattedDate].push(eventObj);
  };

  // Add Interviews & Applications
  applications.forEach((app) => {
    if (app.interviewDate) {
      addEvent(app.interviewDate, {
        type: 'interview',
        title: `Interview: ${app.company}`,
        subtitle: app.role,
        notes: app.notes,
        color: '#f59e0b',
        badgeClass: 'badge-interview',
        raw: app,
      });
    }
    if (app.applicationDate) {
      addEvent(app.applicationDate, {
        type: 'applied',
        title: `Applied: ${app.company}`,
        subtitle: app.role,
        notes: app.notes,
        color: '#3b82f6',
        badgeClass: 'badge-applied',
        raw: app,
      });
    }
  });

  // Add Skills To-Learn (Start Dates)
  skills.forEach((skill) => {
    if (skill.startDate) {
      addEvent(skill.startDate, {
        type: 'skill',
        title: `Start Learning: ${skill.name}`,
        subtitle: `Category: ${skill.category}`,
        notes: skill.notes,
        color: '#10b981',
        badgeClass: 'badge-offer',
        raw: skill,
      });
    }
  });

  // Days array for calendar grid
  const calendarCells = [];
  // Empty padding cells for previous month days
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(d);
  }

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Activity & Learning Calendar</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Unified schedule for job interviews, application submissions, and skill learning start dates
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
            Interviews
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Skills Start Dates
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
            Applications
          </span>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            {monthName} {year}
          </h2>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button onClick={prevMonth} className="btn btn-outline" style={{ padding: '0.4rem 0.6rem' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="btn btn-outline" style={{ padding: '0.4rem 0.6rem' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={goToToday} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            Today
          </button>

          {/* Filter */}
          <select
            className="input-field"
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            style={{ width: 'auto', fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
          >
            <option value="all">Show All Events</option>
            <option value="interview">Interviews Only</option>
            <option value="skill">Skills Start Dates Only</option>
            <option value="applied">Applications Only</option>
          </select>
        </div>
      </div>

      {/* Main Grid + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 320px)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Calendar Grid */}
        <div className="card" style={{ padding: '1rem' }}>
          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem' }}>
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    style={{
                      height: '90px',
                      backgroundColor: 'transparent',
                      borderRadius: '0.5rem',
                      opacity: 0.2,
                    }}
                  />
                );
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = (eventsByDate[dateStr] || []).filter(
                (ev) => eventTypeFilter === 'all' || ev.type === eventTypeFilter
              );
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    height: '90px',
                    padding: '0.35rem',
                    borderRadius: '0.5rem',
                    border: isSelected
                      ? '2px solid var(--primary)'
                      : isToday
                      ? '2px solid var(--accent-interview)'
                      : '1px solid var(--border-color)',
                    backgroundColor: isSelected
                      ? 'rgba(59, 130, 246, 0.08)'
                      : 'var(--bg-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: isToday ? 700 : 500,
                        color: isToday ? 'var(--accent-interview)' : 'var(--text-main)',
                      }}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          backgroundColor: 'var(--primary)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                        }}
                      >
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Micro event pills */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'hidden' }}>
                    {dayEvents.slice(0, 2).map((ev, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '0.25rem',
                          backgroundColor: `${ev.color}25`,
                          color: ev.color,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 600,
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel */}
        <div className="card" style={{ position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <CalendarIcon size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
              {selectedDate
                ? new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Select a Date'}
            </h3>
          </div>

          {!selectedDate ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Click any date cell on the calendar to inspect scheduled interviews, application deadlines, and skill targets.
            </p>
          ) : selectedEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No events scheduled for this day.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedEvents.map((ev, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--bg-main)',
                    borderLeft: `4px solid ${ev.color}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{ev.title}</strong>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: ev.color,
                      }}
                    >
                      {ev.type}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {ev.subtitle}
                  </div>

                  {ev.notes && (
                    <div style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                      "{ev.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;