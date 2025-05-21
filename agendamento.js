import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Agendamento = () => {
  const [events, setEvents] = useState([
    { title: 'Consulta - João', start: '2025-05-21T10:00:00', end: '2025-05-21T11:00:00', dentista: 'Dr. Ana' },
  ]);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', dentista: '' });

  const handleDateClick = (arg) => {
    setNewEvent({ ...newEvent, start: arg.dateStr });
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.dentista) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    setEvents([...events, { ...newEvent, end: new Date(new Date(newEvent.start).getTime() + 60*60*1000).toISOString() }]);
    setNewEvent({ title: '', start: '', dentista: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Agendamento de Consultas</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={events}
            dateClick={handleDateClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
            eventColor="#3b82f6"
          />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Novo Agendamento</h2>
          <input
            type="text"
            name="title"
            placeholder="Nome do Paciente"
            value={newEvent.title}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="datetime-local"
            name="start"
            value={newEvent.start}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <select
            name="dentista"
            value={newEvent.dentista}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="">Selecione Dentista</option>
            <option value="Dr. Ana">Dr. Ana</option>
            <option value="Dr. Carlos">Dr. Carlos</option>
          </select>
          <button
            onClick={addEvent}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;
