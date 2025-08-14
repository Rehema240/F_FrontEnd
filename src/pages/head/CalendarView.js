import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import headService from '../../services/headService';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendarEvents = async (start, end) => {
      try {
        const response = await headService.getCalendarEvents(start, end);
        const formattedEvents = response.data.map(event => ({
          ...event,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
        }));
        setEvents(formattedEvents);
      } catch (err) {
        setError('Failed to fetch calendar events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const start = moment().startOf('month').toISOString();
    const end = moment().endOf('month').toISOString();
    fetchCalendarEvents(start, end);
  }, []);

  const handleRangeChange = (range) => {
    setLoading(true);
    const start = moment(range.start).toISOString();
    const end = moment(range.end).toISOString();
    const fetchCalendarEvents = async (start, end) => {
        try {
          const response = await headService.getCalendarEvents(start, end);
          const formattedEvents = response.data.map(event => ({
            ...event,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
          }));
          setEvents(formattedEvents);
        } catch (err) {
          setError('Failed to fetch calendar events.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
    fetchCalendarEvents(start, end);
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ height: '500px', padding: '20px' }}>
      <h1>Head Calendar View</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onRangeChange={handleRangeChange}
      />
    </div>
  );
};

export default CalendarView;
