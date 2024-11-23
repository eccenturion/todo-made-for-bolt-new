import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Todo } from '../lib/supabase';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  todos: Todo[];
  onSelectEvent: (todo: Todo) => void;
}

export function Calendar({ todos, onSelectEvent }: CalendarProps) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const formattedEvents = todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      start: new Date(todo.start_date),
      end: new Date(todo.end_date),
      completed: todo.completed,
    }));
    setEvents(formattedEvents);
  }, [todos]);

  return (
    <div className="h-[600px] mt-4">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onSelectEvent}
        eventPropGetter={(event) => ({
          className: event.completed ? 'bg-green-500' : 'bg-blue-500',
        })}
      />
    </div>
  );
}