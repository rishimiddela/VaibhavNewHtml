import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DALLAS, HYDERABAD, Location, calculateSunriseSunset, calculateMoonTimes, calculatePanchanga, calculateAuspiciousTimes } from '../services/timeService';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

const PanchangComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedLocation, setSelectedLocation] = useState<Location>(DALLAS);
  const [panchangData, setPanchangData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculatePanchangData();
  }, [selectedDate, selectedLocation]);

  const calculatePanchangData = () => {
    setLoading(true);
    try {
      const sunTimes = calculateSunriseSunset(selectedDate, selectedLocation);
      const moonTimes = calculateMoonTimes(selectedDate, selectedLocation);
      const panchanga = calculatePanchanga(selectedDate, selectedLocation);
      const auspiciousTimes = calculateAuspiciousTimes(selectedDate, selectedLocation);

      setPanchangData({
        sunTimes,
        moonTimes,
        panchanga,
        auspiciousTimes
      });
    } catch (error) {
      console.error('Error calculating panchang data:', error);
    }
    setLoading(false);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location === 'dallas' ? DALLAS : HYDERABAD);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const exportToPDF = async () => {
    const element = document.getElementById('panchang-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('panchang.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const exportToICS = () => {
    if (!panchangData) return;

    const { sunTimes, moonTimes } = panchangData;
    const events = [
      {
        start: sunTimes.sunrise.toJSDate(),
        end: sunTimes.sunrise.toJSDate(),
        title: 'Sunrise',
      },
      {
        start: sunTimes.sunset.toJSDate(),
        end: sunTimes.sunset.toJSDate(),
        title: 'Sunset',
      },
      {
        start: moonTimes.moonrise.toJSDate(),
        end: moonTimes.moonrise.toJSDate(),
        title: 'Moonrise',
      },
      {
        start: moonTimes.moonset.toJSDate(),
        end: moonTimes.moonset.toJSDate(),
        title: 'Moonset',
      },
    ];

    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Vedic Calendar//EN\n';
    events.forEach(event => {
      icsContent += 'BEGIN:VEVENT\n';
      icsContent += `DTSTART:${DateTime.fromJSDate(event.start).toFormat('yyyyMMdd\'T\'HHmmss')}\n`;
      icsContent += `DTEND:${DateTime.fromJSDate(event.end).toFormat('yyyyMMdd\'T\'HHmmss')}\n`;
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += 'END:VEVENT\n';
    });
    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    saveAs(blob, 'panchang.ics');
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!panchangData) {
    return <div className="text-center p-4">Error loading panchang data</div>;
  }

  const { sunTimes, moonTimes, panchanga, auspiciousTimes } = panchangData;

  return (
    <div className="container mx-auto p-4" id="panchang-content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('vedic_calendar')}</h1>
        <div className="space-x-4">
          <select
            className="p-2 border rounded"
            onChange={(e) => handleLocationChange(e.target.value)}
            value={selectedLocation === DALLAS ? 'dallas' : 'hyderabad'}
          >
            <option value="dallas">{t('dallas')}</option>
            <option value="hyderabad">{t('hyderabad')}</option>
          </select>
          <select
            className="p-2 border rounded"
            onChange={(e) => handleLanguageChange(e.target.value)}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="te">Telugu</option>
            <option value="hi">Hindi</option>
            <option value="sa">Sanskrit</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date) => setSelectedDate(date)}
          dateFormat="MMMM d, yyyy"
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solar & Lunar Timings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('solar_lunar_timings')}</h2>
          <div className="space-y-2">
            <p>{t('sunrise')}: {sunTimes.sunrise.toFormat('hh:mm a')}</p>
            <p>{t('sunset')}: {sunTimes.sunset.toFormat('hh:mm a')}</p>
            <p>{t('moonrise')}: {moonTimes.moonrise.toFormat('hh:mm a')}</p>
            <p>{t('moonset')}: {moonTimes.moonset.toFormat('hh:mm a')}</p>
          </div>
        </div>

        {/* Astronomical & Seasonal Cycles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('astronomical_cycles')}</h2>
          <div className="space-y-2">
            <p>{t('samvatsaram')}: {t(panchanga.samvatsaram)}</p>
            <p>{t('ayanam')}: {t(panchanga.ayanam)}</p>
            <p>{t('rutu')}: {t(panchanga.rutu)}</p>
            <p>{t('masam')}: {t(panchanga.masam)}</p>
            <p>{t('paksham')}: {t(panchanga.paksham)}</p>
          </div>
        </div>

        {/* Panchanga Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('panchanga_details')}</h2>
          <div className="space-y-2">
            <div className="mb-4">
              <p className="font-medium">{t('tithi')}: {t(panchanga.tithi.name)}</p>
              <p className="text-sm text-gray-600">
                {t('start')}: {panchanga.tithi.start.toFormat('hh:mm a')}
                {' - '}
                {t('end')}: {panchanga.tithi.end.toFormat('hh:mm a')}
              </p>
            </div>
            <div className="mb-4">
              <p className="font-medium">{t('nakshatra')}: {t(panchanga.nakshatra.name)}</p>
              <p className="text-sm text-gray-600">
                {t('start')}: {panchanga.nakshatra.start.toFormat('hh:mm a')}
                {' - '}
                {t('end')}: {panchanga.nakshatra.end.toFormat('hh:mm a')}
              </p>
            </div>
            <div className="mb-4">
              <p className="font-medium">{t('yoga')}: {t(panchanga.yoga.name)}</p>
              <p className="text-sm text-gray-600">
                {t('start')}: {panchanga.yoga.start.toFormat('hh:mm a')}
                {' - '}
                {t('end')}: {panchanga.yoga.end.toFormat('hh:mm a')}
              </p>
            </div>
            <div>
              <p className="font-medium">{t('karana')}: {t(panchanga.karana.name)}</p>
              <p className="text-sm text-gray-600">
                {t('start')}: {panchanga.karana.start.toFormat('hh:mm a')}
                {' - '}
                {t('end')}: {panchanga.karana.end.toFormat('hh:mm a')}
              </p>
            </div>
          </div>
        </div>

        {/* Auspicious Timings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('auspicious_timings')}</h2>
          <div className="space-y-2">
            <p>{t('abhijit_muhurat')}: {auspiciousTimes.abhijitMuhurat.start.toFormat('hh:mm a')} - {auspiciousTimes.abhijitMuhurat.end.toFormat('hh:mm a')}</p>
          </div>
        </div>

        {/* Inauspicious Timings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('inauspicious_timings')}</h2>
          <div className="space-y-2">
            <p>{t('rahu_kalam')}: {auspiciousTimes.rahuKalam.start.toFormat('hh:mm a')} - {auspiciousTimes.rahuKalam.end.toFormat('hh:mm a')}</p>
            <p>{t('yamaganda_kalam')}: {auspiciousTimes.yamagandaKalam.start.toFormat('hh:mm a')} - {auspiciousTimes.yamagandaKalam.end.toFormat('hh:mm a')}</p>
            <p>{t('gulika_kalam')}: {auspiciousTimes.gulikaKalam.start.toFormat('hh:mm a')} - {auspiciousTimes.gulikaKalam.end.toFormat('hh:mm a')}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={exportToPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t('export_pdf')}
        </button>
        <button
          onClick={exportToICS}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {t('export_ics')}
        </button>
      </div>
    </div>
  );
};

export default PanchangComponent;
