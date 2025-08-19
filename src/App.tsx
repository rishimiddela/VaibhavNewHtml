import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './App.css';
import { DateLocationPicker } from './components/DateLocationPicker';
import { PanchangDetails } from './components/PanchangDetails';
import { exportToPDF, exportToICS } from './services/exportService';

const queryClient = new QueryClient();

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('dallas');

  // Mock data - replace with actual API call
  const panchangData = {
    solar: {
      sunrise: '06:45 AM',
      sunset: '08:15 PM',
    },
    lunar: {
      moonrise: '03:30 PM',
      moonset: '02:15 AM',
    },
    panchang: {
      tithi: 'Shukla Paksha Panchami',
      nakshatra: 'Rohini',
      yoga: 'Shubha',
      karana: 'Vanija',
    },
    auspicious: {
      abhijitMuhurat: '11:45 AM - 12:30 PM',
      amritKalam: '07:30 AM - 09:00 AM',
      brahmaMuhurat: '04:30 AM - 05:15 AM',
    },
    inauspicious: {
      rahuKalam: '09:00 AM - 10:30 AM',
      yamagandaKalam: '02:00 PM - 03:30 PM',
      gulikaKalam: '06:30 AM - 08:00 AM',
      durMuhurat: ['10:15 AM - 11:00 AM', '02:30 PM - 03:15 PM'],
      varjyam: '01:15 PM - 02:45 PM',
    },
  };

  const handleExportPDF = () => {
    exportToPDF('panchang-content');
  };

  const handleExportICS = () => {
    const events = [
      {
        title: 'Abhijit Muhurat',
        description: 'Auspicious time for starting new ventures',
        startTime: new Date(),
        endTime: new Date(),
      },
      // Add more events as needed
    ];
    exportToICS(events);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Vedic Mobile Calendar
          </h1>

          <DateLocationPicker
            onDateChange={setSelectedDate}
            onLocationChange={setSelectedLocation}
            defaultLocation={selectedLocation}
          />

          <div id="panchang-content">
            <PanchangDetails data={panchangData} />
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export as PDF
            </button>
            <button
              onClick={handleExportICS}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export as ICS
            </button>
          </div>
        </div>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
