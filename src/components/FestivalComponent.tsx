import React from 'react';
import { useTranslation } from 'react-i18next';
import { Festival } from '../services/festivalService';
import { DateTime } from 'luxon';

interface FestivalComponentProps {
  festivals: Festival[];
  upcomingFestivals: { date: DateTime; festivals: Festival[] }[];
}

const FestivalComponent: React.FC<FestivalComponentProps> = ({ festivals, upcomingFestivals }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{t('festivals')}</h2>
      
      {/* Today's Festivals */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">{t('todays_festivals')}</h3>
        {festivals.length > 0 ? (
          <div className="space-y-4">
            {festivals.map((festival, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium">{t(festival.name)}</h4>
                <p className="text-sm text-gray-600">{t(festival.description)}</p>
                {festival.significance && (
                  <p className="text-sm text-gray-500 mt-1">{t(festival.significance)}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{t('no_festivals_today')}</p>
        )}
      </div>

      {/* Upcoming Festivals */}
      <div>
        <h3 className="text-lg font-medium mb-3">{t('upcoming_festivals')}</h3>
        <div className="space-y-4">
          {upcomingFestivals.map(({ date, festivals }, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">{date.toFormat('MMM dd, yyyy')}</h4>
              {festivals.map((festival, fIndex) => (
                <div key={fIndex} className="mt-2">
                  <p className="font-medium text-sm">{t(festival.name)}</p>
                  <p className="text-sm text-gray-600">{t(festival.description)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FestivalComponent;
