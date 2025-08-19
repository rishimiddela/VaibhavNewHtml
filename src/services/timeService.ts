import { DateTime } from 'luxon';

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const DALLAS: Location = {
  name: 'Dallas',
  latitude: 32.7767,
  longitude: -96.7970,
  timezone: 'America/Chicago'
};

export const HYDERABAD: Location = {
  name: 'Hyderabad',
  latitude: 17.3850,
  longitude: 78.4867,
  timezone: 'Asia/Kolkata'
};

export function calculateSunriseSunset(date: Date, location: Location) {
  const dt = DateTime.fromJSDate(date).setZone(location.timezone);
  
  const jDate = calculateJulianDate(dt);
  const times = calculateSunTimes(jDate, location.latitude, location.longitude);
  
  const sunrise = DateTime.fromObject({
    year: dt.year,
    month: dt.month,
    day: dt.day,
    hour: times.sunrise.hour,
    minute: times.sunrise.minute
  }, { zone: location.timezone });
  
  const sunset = DateTime.fromObject({
    year: dt.year,
    month: dt.month,
    day: dt.day,
    hour: times.sunset.hour,
    minute: times.sunset.minute
  }, { zone: location.timezone });

  return {
    sunrise,
    sunset
  };
}

function calculateJulianDate(dt: DateTime): number {
  const year = dt.year;
  const month = dt.month;
  const day = dt.day;
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  return jd;
}

function calculateSunTimes(jd: number, lat: number, lng: number) {
  const RAD = Math.PI / 180;
  const DEG = 180 / Math.PI;
  
  const phi = lat * RAD;
  const n = jd - 2451545.0;
  const Jnoon = n - lng / 360.0;
  const M = (357.5291 + 0.98560028 * Jnoon) % 360;
  const C = 1.9148 * Math.sin(M * RAD) + 0.0200 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const Jtransit = 2451545.0 + Jnoon + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * lambda * RAD);
  const delta = Math.asin(Math.sin(lambda * RAD) * Math.sin(23.44 * RAD)) * DEG;
  
  const omega = Math.acos((Math.sin(-0.83 * RAD) - Math.sin(phi) * Math.sin(delta * RAD)) / 
                         (Math.cos(phi) * Math.cos(delta * RAD))) * DEG;
  
  const Jrise = Jtransit - omega / 360.0;
  const Jset = Jtransit + omega / 360.0;
  
  const riseHours = ((Jrise % 1) * 24 + 12) % 24;
  const setHours = ((Jset % 1) * 24 + 12) % 24;
  
  return {
    sunrise: {
      hour: Math.floor(riseHours),
      minute: Math.floor((riseHours % 1) * 60)
    },
    sunset: {
      hour: Math.floor(setHours),
      minute: Math.floor((setHours % 1) * 60)
    }
  };
}

export function calculateMoonTimes(date: Date, location: Location) {
  return {
    moonrise: DateTime.fromJSDate(date).setZone(location.timezone).plus({ hours: 6 }),
    moonset: DateTime.fromJSDate(date).setZone(location.timezone).plus({ hours: 18 })
  };
}

export function calculatePanchanga(date: Date, location: Location) {
  const dt = DateTime.fromJSDate(date).setZone(location.timezone);
  const tithiNum = calculateTithi(dt);
  const tithi = getTithiName(tithiNum);
  const nakshatraNum = calculateNakshatra(dt);
  const nakshatra = getNakshatraName(nakshatraNum);
  const yogaNum = calculateYoga(dt);
  const yoga = getYogaName(yogaNum);
  const karanaNum = calculateKarana(dt);
  const karana = getKaranaName(karanaNum);

  return {
    tithi,
    nakshatra,
    yoga,
    karana
  };
}

function calculateTithi(dt: DateTime): number {
  return Math.floor((dt.day % 30) / 2) + 1;
}

function calculateNakshatra(dt: DateTime): number {
  return (dt.day % 27) + 1;
}

function calculateYoga(dt: DateTime): number {
  return (dt.day % 27) + 1;
}

function calculateKarana(dt: DateTime): number {
  return (dt.day % 11) + 1;
}

function getTithiName(tithiNum: number): string {
  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
  ];
  return tithiNames[tithiNum - 1];
}

function getNakshatraName(nakshatraNum: number): string {
  const nakshatraNames = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
    'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula',
    'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];
  return nakshatraNames[nakshatraNum - 1];
}

function getYogaName(yogaNum: number): string {
  const yogaNames = [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
  ];
  return yogaNames[yogaNum - 1];
}

function getKaranaName(karanaNum: number): string {
  const karanaNames = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija',
    'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
  ];
  return karanaNames[karanaNum - 1];
}

export function calculateAuspiciousTimes(date: Date, location: Location) {
  const dt = DateTime.fromJSDate(date).setZone(location.timezone);
  const sunrise = calculateSunriseSunset(date, location).sunrise;
  
  const rahuKalam = calculateRahuKalam(dt, sunrise);
  const yamagandaKalam = calculateYamagandaKalam(dt, sunrise);
  const gulikaKalam = calculateGulikaKalam(dt, sunrise);
  const abhijitMuhurat = calculateAbhijitMuhurat(sunrise);
  
  return {
    rahuKalam,
    yamagandaKalam,
    gulikaKalam,
    abhijitMuhurat
  };
}

function calculateRahuKalam(dt: DateTime, sunrise: DateTime) {
  const dayOfWeek = dt.weekday;
  const duration = 24 / 8;
  
  let startHour;
  switch(dayOfWeek) {
    case 1: startHour = 7.5; break;
    case 2: startHour = 3; break;
    case 3: startHour = 12; break;
    case 4: startHour = 13.5; break;
    case 5: startHour = 10.5; break;
    case 6: startHour = 9; break;
    case 7: startHour = 4.5; break;
    default: startHour = 0;
  }
  
  const start = sunrise.plus({ hours: startHour });
  const end = start.plus({ hours: duration });
  
  return { start, end };
}

function calculateYamagandaKalam(dt: DateTime, sunrise: DateTime) {
  const dayOfWeek = dt.weekday;
  const duration = 24 / 8;
  
  let startHour;
  switch(dayOfWeek) {
    case 1: startHour = 10.5; break;
    case 2: startHour = 9; break;
    case 3: startHour = 7.5; break;
    case 4: startHour = 6; break;
    case 5: startHour = 3; break;
    case 6: startHour = 1.5; break;
    case 7: startHour = 12; break;
    default: startHour = 0;
  }
  
  const start = sunrise.plus({ hours: startHour });
  const end = start.plus({ hours: duration });
  
  return { start, end };
}

function calculateGulikaKalam(dt: DateTime, sunrise: DateTime) {
  const dayOfWeek = dt.weekday;
  const duration = 24 / 8;
  
  let startHour;
  switch(dayOfWeek) {
    case 1: startHour = 6; break;
    case 2: startHour = 4.5; break;
    case 3: startHour = 3; break;
    case 4: startHour = 1.5; break;
    case 5: startHour = 12; break;
    case 6: startHour = 10.5; break;
    case 7: startHour = 9; break;
    default: startHour = 0;
  }
  
  const start = sunrise.plus({ hours: startHour });
  const end = start.plus({ hours: duration });
  
  return { start, end };
}

function calculateAbhijitMuhurat(sunrise: DateTime) {
  const start = sunrise.plus({ hours: 5 });
  const end = start.plus({ minutes: 48 });
  return { start, end };
}
