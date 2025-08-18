import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import '../../styles/StudentComponents.css';

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get start and end dates for the current month
  const getMonthStartEnd = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  };

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const { start, end } = getMonthStartEnd(selectedDate);
        const response = await studentService.getEventsForCalendar(
          start.toISOString(),
          end.toISOString()
        );
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch calendar events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, [selectedDate]);
  
  const changeMonth = (increment) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + increment);
    setSelectedDate(newDate);
  };
  
  // Group events by day
  const getEventsByDay = () => {
    const eventsByDay = {};
    events.forEach(event => {
      const dateStr = new Date(event.start_time).toDateString();
      if (!eventsByDay[dateStr]) {
        eventsByDay[dateStr] = [];
      }
      eventsByDay[dateStr].push(event);
    });
    return eventsByDay;
  };

  if (loading) {
    return <div className="loading-container">Loading calendar...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }
  
  const eventsByDay = getEventsByDay();
  const daysInMonth = new Array(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()).fill(0).map((_, i) => i + 1);

  return (
    <div className="student-page-container">
      <h1 className="student-page-title">Calendar View</h1>
      
      <div className="card">
        <div className="card-body calendar-container">
          <div className="calendar-header">
            <h2>{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</h2>
            <div className="calendar-nav">
              <button onClick={() => changeMonth(-1)} className="btn btn-outline-primary">
                Previous Month
              </button>
              <button onClick={() => changeMonth(1)} className="btn btn-outline-primary">
                Next Month
              </button>
            </div>
          </div>
          
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            
            {/* Empty cells for days before the first of the month */}
            {Array(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay()).fill(0).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day outside-month"></div>
            ))}
            
            {/* Calendar days */}
            {daysInMonth.map(day => {
              const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
              const dateStr = currentDate.toDateString();
              const hasEvents = !!eventsByDay[dateStr]?.length;
              const isToday = new Date().toDateString() === dateStr;
              
              return (
                <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                  <div className="calendar-day-number">{day}</div>
                  
                  {hasEvents && eventsByDay[dateStr].map(event => (
                    <div 
                      key={event.id} 
                      className="calendar-event"
                      title={`${event.title} - ${new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {events.length > 0 && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header">
            Upcoming Events
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {events.map((event) => (
                <div key={event.id} className="calendar-event">
                  <div className="calendar-event-title">{event.title}</div>
                  <div className="calendar-event-time">
                    {new Date(event.start_time).toLocaleDateString()} at {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div>{event.location}</div>
                  {event.confirmed ? (
                    <span style={{ color: '#28a745', fontWeight: 'bold', marginTop: '5px', display: 'block' }}>
                      ✓ Confirmed
                    </span>
                  ) : (
                    <Link to="/student/events" className="btn btn-sm btn-outline-primary" style={{ marginTop: '5px' }}>
                      View Details
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
