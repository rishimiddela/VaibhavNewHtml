import React from 'react';
import { useTranslation } from 'react-i18next';

interface PanchangDetailsProps {
  data: {
    solar: {
      sunrise: string;
      sunset: string;
    };
    lunar: {
      moonrise: string;
      moonset: string;
    };
    panchang: {
      tithi: string;
      nakshatra: string;
      yoga: string;
      karana: string;
    };
    auspicious: {
      abhijitMuhurat: string;
      amritKalam: string;
      brahmaMuhurat: string;
    };
    inauspicious: {
      rahuKalam: string;
      yamagandaKalam: string;
      gulikaKalam: string;
      durMuhurat: string[];
      varjyam: string;
    };
  };
}

export const PanchangDetails: React.FC<PanchangDetailsProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('solar.title')}</h2>
        <div>
          <p><span className="font-medium">{t('solar.sunrise')}:</span> {data.solar.sunrise}</p>
          <p><span className="font-medium">{t('solar.sunset')}:</span> {data.solar.sunset}</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('lunar.title')}</h2>
        <div>
          <p><span className="font-medium">{t('lunar.moonrise')}:</span> {data.lunar.moonrise}</p>
          <p><span className="font-medium">{t('lunar.moonset')}:</span> {data.lunar.moonset}</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('panchang.title')}</h2>
        <div>
          <p><span className="font-medium">{t('panchang.tithi')}:</span> {data.panchang.tithi}</p>
          <p><span className="font-medium">{t('panchang.nakshatra')}:</span> {data.panchang.nakshatra}</p>
          <p><span className="font-medium">{t('panchang.yoga')}:</span> {data.panchang.yoga}</p>
          <p><span className="font-medium">{t('panchang.karana')}:</span> {data.panchang.karana}</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('auspicious.title')}</h2>
        <div>
          <p><span className="font-medium">{t('auspicious.abhijit')}:</span> {data.auspicious.abhijitMuhurat}</p>
          <p><span className="font-medium">{t('auspicious.amrit')}:</span> {data.auspicious.amritKalam}</p>
          <p><span className="font-medium">{t('auspicious.brahma')}:</span> {data.auspicious.brahmaMuhurat}</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('inauspicious.title')}</h2>
        <div>
          <p><span className="font-medium">{t('inauspicious.rahu')}:</span> {data.inauspicious.rahuKalam}</p>
          <p><span className="font-medium">{t('inauspicious.yamaganda')}:</span> {data.inauspicious.yamagandaKalam}</p>
          <p><span className="font-medium">{t('inauspicious.gulika')}:</span> {data.inauspicious.gulikaKalam}</p>
          <p><span className="font-medium">{t('inauspicious.durMuhurat')}:</span> {data.inauspicious.durMuhurat.join(', ')}</p>
          <p><span className="font-medium">{t('inauspicious.varjyam')}:</span> {data.inauspicious.varjyam}</p>
        </div>
      </section>
    </div>
  );
};
