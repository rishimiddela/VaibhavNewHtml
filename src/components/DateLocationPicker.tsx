import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';

interface LocationPickerProps {
  onDateChange: (date: Date) => void;
  onLocationChange: (location: string) => void;
  defaultLocation: string;
}

const locations = [
  { value: 'dallas', label: 'Dallas, Texas' },
  { value: 'hyderabad', label: 'Hyderabad, India' }
];

export const DateLocationPicker: React.FC<LocationPickerProps> = ({
  onDateChange,
  onLocationChange,
  defaultLocation
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { t } = useTranslation();

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('datePicker.label')}
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('locationPicker.label')}
        </label>
        <select
          onChange={(e) => onLocationChange(e.target.value)}
          defaultValue={defaultLocation}
          className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {locations.map((location) => (
            <option key={location.value} value={location.value}>
              {t(`locations.${location.value}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
