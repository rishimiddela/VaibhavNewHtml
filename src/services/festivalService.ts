import { DateTime } from 'luxon';
import type { Location } from './timeService';

export interface Festival {
  name: string;
  description: string;
  type: 'major' | 'minor';
  significance?: string;
}

// This is a basic festival database. In a production environment,
// this should be moved to a proper database or API
const festivalDatabase: Record<string, Festival[]> = {
  // Format: 'MM-DD': Festival[]
  '08-19': [
    {
      name: 'Krishna Panchami',
      description: 'Fifth day of Krishna Paksha',
      type: 'minor',
      significance: 'Day dedicated to spiritual practices and prayers'
    }
  ],
  '08-31': [
    {
      name: 'Krishna Janmashtami',
      description: 'Birth of Lord Krishna',
      type: 'major',
      significance: 'One of the most important festivals in the Hindu calendar, celebrating the birth of Lord Krishna'
    }
  ],
  '09-07': [
    {
      name: 'Ganesh Chaturthi',
      description: 'Festival of Lord Ganesha',
      type: 'major',
      significance: 'Marks the birth of Lord Ganesha, the remover of obstacles'
    }
  ]
};

export function getFestivals(date: Date, location: Location): Festival[] {
  const dt = DateTime.fromJSDate(date).setZone(location.timezone);
  const dateKey = dt.toFormat('MM-dd');
  return festivalDatabase[dateKey] || [];
}

export function getUpcomingFestivals(date: Date, location: Location, limit: number = 5): { date: DateTime; festivals: Festival[] }[] {
  const dt = DateTime.fromJSDate(date).setZone(location.timezone);
  const upcoming: { date: DateTime; festivals: Festival[] }[] = [];
  let currentDate = dt;

  for (let i = 0; i < 30 && upcoming.length < limit; i++) {
    const dateKey = currentDate.toFormat('MM-dd');
    const festivals = festivalDatabase[dateKey];
    if (festivals?.length) {
      upcoming.push({ date: currentDate, festivals });
    }
    currentDate = currentDate.plus({ days: 1 });
  }

  return upcoming;
}
