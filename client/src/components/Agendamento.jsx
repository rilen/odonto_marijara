// client/src/components/Agendamento.jsx

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Link } from 'react-router-dom'; // Importa Link para navegação

const Agendamento = () => {
  // State for calendar events
  const [events, setEvents] = useState([
    // Initial mock event (you might fetch these from an API in a real application)
    { title: 'Consulta - João', start: '2025-05-21T10:00:00', end: '2025-05-21T11:00:00', dentista: 'Dr. Ana' },
  ]);

  // State for the new event form fields
  const [newEvent, setNewEvent] = useState({
    pacienteId: '',     // Stores the ID of the selected patient
    pacienteNome: '',   // Stores the name of the selected patient for display
    start: '',          // Start date and time of the appointment
    dentista: ''        // Selected dentist
  });

  // States for managing lists of patients and dentists fetched from the API
  const [pacientes, setPacientes] = useState([]);
  const [dentistas, setDentistas] = useState([]);
  // State for displaying error messages to the user
  const [error, setError] = useState('');

  // useEffect hook to fetch patient and dentist data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contacts from your API endpoint
        const response = await fetch('/api/contatos');
        const data = await response.json();

        if (response.ok) {
          // Filter contacts to separate patients and dentists
          const pacientesData = data.filter(contact => contact.tipo === 'Paciente');
          const dentistasData = data.filter(contact => contact.tipo === 'Dentista');
          setPacientes(pacientesData);
          setDentistas(dentistasData);
          setError(''); // Clear any previous errors
        } else {
          setError(data.message || 'Erro ao carregar dados de pacientes/dentistas.');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor para carregar dados.');
        console.error('Erro ao carregar dados:', err); // Log the actual error for debugging
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs only once on mount

  // Handler for clicking on a date/time slot in the calendar
  const handleDateClick = (arg) => {
    setNewEvent({ ...newEvent, start: arg.dateStr }); // Set the start time for the new event
  };

  // Handler for general input changes in the new event form
  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Handler specifically for when a patient is selected from the dropdown
  const handlePacienteSelectChange = (e) => {
    const id = e.target.value;
    // Find the full patient object based on the selected ID
    const selectedPaciente = pacientes.find(p => p.id === id); // ID pode ser string se vier do HTML option value
    setNewEvent({
      ...newEvent,
      pacienteId: id,
      pacienteNome: selectedPaciente ? selectedPaciente.nome : '' // Store patient's name
    });
  };

  // Function to add a new event (appointment) to the calendar
  const addEvent = () => {
    // Validate that all required fields are filled
    if (!newEvent.pacienteId || !newEvent.start || !newEvent.dentista) {
      setError('Por favor, selecione um paciente, um dentista e uma data/hora!');
      return;
    }
    setError(''); // Clear error if validation passes

    // Construct the event title using the selected patient's name
    const eventTitle = `Consulta - ${newEvent.pacienteNome}`;

    // Calculate the end time (assuming a 1-hour duration for appointments)
    const eventStartTime = new Date(newEvent.start);
    const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds

    // Add the new event to the events state
    setEvents([...events, {
      title: eventTitle,
      start: eventStartTime.toISOString(),
      end: eventEndTime.toISOString(),
      dentista: newEvent.dentista,
      pacienteId: newEvent.pacienteId // Store patient ID for potential future use
    }]);

    // Reset the new event form fields after adding the event
    setNewEvent({ pacienteId: '', pacienteNome: '', start: '', dentista: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Agendamento de Consultas</h1>

      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* FullCalendar component for displaying appointments */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek" // Default view
            events={events} // Events to display on the calendar
            dateClick={handleDateClick} // Callback for date/time clicks
            headerToolbar={{ // Configuration for the calendar header
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            slotMinTime="08:00:00" // Minimum time displayed in time grid
            slotMaxTime="18:00:00" // Maximum time displayed in time grid
            allDaySlot={false} // Hide the all-day slot
            eventColor="#3b82f6" // Custom event color (Tailwind blue-500)
            locale="pt-br" // Set calendar locale to Portuguese
            height="auto" // Allows the calendar to adjust height responsively
          />
        </div>

        {/* Form for adding new appointments */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Novo Agendamento</h2>

          {/* Patient Selection Dropdown */}
          <div className="mb-4">
            <label htmlFor="paciente-select" className="block text-gray-700 text-sm font-bold mb-2">
              Selecione o Paciente:
            </label>
            <select
              id="paciente-select"
              name="pacienteId"
              value={newEvent.pacienteId}
              onChange={handlePacienteSelectChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="">-- Selecione um paciente --</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nome} (CPF: {paciente.cpf})
                </option>
              ))}
            </select>
            {/* Conditional message if no patients are found */}
            {pacientes.length === 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Nenhum paciente encontrado. <Link to="/contatos" className="text-blue-500 hover:underline">Cadastre um novo paciente aqui.</Link>
              </p>
            )}
          </div>

          {/* Date and Time Input */}
          <div className="mb-4">
            <label htmlFor="start-datetime" className="block text-gray-700 text-sm font-bold mb-2">
              Data e Hora da Consulta:
            </label>
            <input
              id="start-datetime"
              type="datetime-local"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>

          {/* Dentist Selection Dropdown */}
          <div className="mb-6">
            <label htmlFor="dentista-select" className="block text-gray-700 text-sm font-bold mb-2">
              Selecione o Dentista:
            </label>
            <select
              id="dentista-select"
              name="dentista"
              value={newEvent.dentista}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="">-- Selecione um dentista --</option>
              {dentistas.map((dentista) => (
                // Assuming dentist name is unique enough for the value
                <option key={dentista.id} value={dentista.nome}>
                  {dentista.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Agendar button */}
          <button
            onClick={addEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
          >
            Agendar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;
