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

interface AstroTime {
  start: DateTime;
  end: DateTime;
}

interface PanchangDetails {
  samvatsaram: string;
  ayanam: string;
  rutu: string;
  masam: string;
  paksham: string;
  tithi: {
    name: string;
    start: DateTime;
    end: DateTime;
  };
  nakshatra: {
    name: string;
    start: DateTime;
    end: DateTime;
  };
  yoga: {
    name: string;
    start: DateTime;
    end: DateTime;
  };
  karana: {
    name: string;
    start: DateTime;
    end: DateTime;
  };
}

const SAMVATSARAS = [
  'Prabhava', 'Vibhava', 'Shukla', 'Pramoda', 'Prajapati',
  'Angirasa', 'Srimukha', 'Bhava', 'Yuva', 'Dhatu',
  'Sowmya', 'Sadharana', 'Virodhikruthi', 'Paridhavi', 'Pramadicha',
  'Ananda', 'Rakshasa', 'Nala', 'Pingala', 'Kalayukthi',
  'Siddharthi', 'Roudri', 'Durmathi', 'Dundubhi', 'Rudhirodgari',
  'Raktakshi', 'Krodhana', 'Kshaya', 'Prabhava', 'Vibhava'
];

const AYANAMS = ['Uttarayanam', 'Dakshinayanam'];

const RITUS = [
  'Vasantha', 'Grishma', 'Varsha',
  'Sharad', 'Hemantha', 'Shishira'
];

const MASAMS = [
  'Chaitra', 'Vaisakha', 'Jyeshtha',
  'Ashadha', 'Shravana', 'Bhadrapada',
  'Ashwina', 'Kartika', 'Margashira',
  'Pushya', 'Magha', 'Phalguna'
];

const PAKSHAMS = ['Shukla', 'Krishna'];

export const HYDERABAD: Location = {
  name: 'Hyderabad',
  latitude: 17.3850,
  longitude: 78.4867,
  timezone: 'Asia/Kolkata'
};

export function calculateSunriseSunset(date: Date, location: Location) {
  const dt = DateTime.fromJSDate(date).setZone(location.timezone);
  
  // Convert to Julian date for calculations
  const jDate = calculateJulianDate(dt);
  
  // Calculate the sunrise and sunset times
  const times = calculateSunTimes(jDate, location.latitude, location.longitude);
  
  // Convert times back to location timezone
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
  // Constants
  const RAD = Math.PI / 180;
  const DEG = 180 / Math.PI;
  
  // Convert latitude to radians
  const phi = lat * RAD;
  
  // Days since J2000
  const n = jd - 2451545.0;
  
  // Mean solar noon
  const Jnoon = n - lng / 360.0;
  
  // Solar mean anomaly
  const M = (357.5291 + 0.98560028 * Jnoon) % 360;
  
  // Equation of center
  const C = 1.9148 * Math.sin(M * RAD) + 0.0200 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
  
  // Ecliptic longitude
  const lambda = (M + C + 180 + 102.9372) % 360;
  
  // Solar transit
  const Jtransit = 2451545.0 + Jnoon + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * lambda * RAD);
  
  // Declination
  const delta = Math.asin(Math.sin(lambda * RAD) * Math.sin(23.44 * RAD)) * DEG;
  
  // Hour angle
  const omega = Math.acos((Math.sin(-0.83 * RAD) - Math.sin(phi) * Math.sin(delta * RAD)) / 
                         (Math.cos(phi) * Math.cos(delta * RAD))) * DEG;
  
  // Calculate sunrise and sunset times
  const Jrise = Jtransit - omega / 360.0;
  const Jset = Jtransit + omega / 360.0;
  
  // Convert Julian dates to hours and minutes
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
  // Similar calculations for moon times
  // To be implemented based on astronomical algorithms
  return {
    moonrise: DateTime.fromJSDate(date).setZone(location.timezone).plus({ hours: 6 }),
    moonset: DateTime.fromJSDate(date).setZone(location.timezone).plus({ hours: 18 })
  };
}

export function calculatePanchanga(date: Date, location: Location) {
  const dt = DateTime.fromJSDate(date).setZone(location.timezone);
  
  // Calculate tithi (lunar day)
  const tithiNum = calculateTithi(dt, location);
  const tithi = getTithiName(tithiNum);
  
  // Calculate nakshatra (constellation)
  const nakshatraNum = calculateNakshatra(dt, location);
  const nakshatra = getNakshatraName(nakshatraNum);
  
  // Calculate yoga
  const yogaNum = calculateYoga(dt, location);
  const yoga = getYogaName(yogaNum);
  
  // Calculate karana
  const karanaNum = calculateKarana(dt, location);
  const karana = getKaranaName(karanaNum);

  return {
    tithi,
    nakshatra,
    yoga,
    karana
  };
}

function calculateTithi(dt: DateTime, location: Location): number {
  // Placeholder calculation - needs astronomical implementation
  return Math.floor((dt.day % 30) / 2) + 1;
}

function calculateNakshatra(dt: DateTime, location: Location): number {
  // Placeholder calculation - needs astronomical implementation
  return (dt.day % 27) + 1;
}

function calculateYoga(dt: DateTime, location: Location): number {
  // Placeholder calculation - needs astronomical implementation
  return (dt.day % 27) + 1;
}

function calculateKarana(dt: DateTime, location: Location): number {
  // Placeholder calculation - needs astronomical implementation
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
  
  // Calculate Rahu Kalam
  const rahuKalam = calculateRahuKalam(dt, sunrise);
  
  // Calculate Yamaganda Kalam
  const yamagandaKalam = calculateYamagandaKalam(dt, sunrise);
  
  // Calculate Gulika Kalam
  const gulikaKalam = calculateGulikaKalam(dt, sunrise);
  
  // Calculate Abhijit Muhurat
  const abhijitMuhurat = calculateAbhijitMuhurat(dt, sunrise);
  
  return {
    rahuKalam,
    yamagandaKalam,
    gulikaKalam,
    abhijitMuhurat
  };
}

function calculateRahuKalam(dt: DateTime, sunrise: DateTime) {
  // Rahu Kalam calculation based on day of week
  const dayOfWeek = dt.weekday;
  const duration = 24 / 8; // Each time period is 3 hours
  
  let startHour;
  switch(dayOfWeek) {
    case 1: startHour = 7.5; break;  // Monday
    case 2: startHour = 3; break;    // Tuesday
    case 3: startHour = 12; break;   // Wednesday
    case 4: startHour = 13.5; break; // Thursday
    case 5: startHour = 10.5; break; // Friday
    case 6: startHour = 9; break;    // Saturday
    case 7: startHour = 4.5; break;  // Sunday
    default: startHour = 0;
  }
  
  const start = sunrise.plus({ hours: startHour });
  const end = start.plus({ hours: duration });
  
  return { start, end };
}

function calculateYamagandaKalam(dt: DateTime, sunrise: DateTime) {
  // Yamaganda Kalam calculation based on day of week
  const dayOfWeek = dt.weekday;
  const duration = 24 / 8;
  
  let startHour;
  switch(dayOfWeek) {
    case 1: startHour = 10.5; break; // Monday
    case 2: startHour = 9; break;    // Tuesday
    case 3: startHour = 7.5; break;  // Wednesday
    case 4: startHour = 6; break;    // Thursday
    case 5: startHour = 3; break;    // Friday
    case 6: startHour = 1.5; break;  // Saturday
    case 7: startHour = 12; break;   // Sunday
    default: startHour = 0;
  }
  
  const start = sunrise.plus({ hours: startHour });
  const end = start.plus({ hours: duration });
  
  return { start, end };
}

function calculateGulikaKalam(dt: DateTime, sunrise: DateTime) {
  // Gulika Kalam calculation based on day of week
  const dayOfWeek = dt.weekday;
  const duration = 24 / 8;
  
  let startHour;
  switch(dayOfWeek) {
    case 1: startHour = 6; break;    // Monday
    case 2: startHour = 4.5; break;  // Tuesday
    case 3: startHour = 3; break;    // Wednesday
    case 4: startHour = 1.5; break;  // Thursday
    case 5: startHour = 12; break;   // Friday
    case 6: startHour = 10.5; break; // Saturday
    case 7: startHour = 9; break;    // Sunday
    default: startHour = 0;
  }
  
  const start = sunrise.plus({ hours: startHour });
  const end = start.plus({ hours: duration });
  
  return { start, end };
}

function calculateAbhijitMuhurat(dt: DateTime, sunrise: DateTime) {
  // Abhijit Muhurat is roughly around noon
  const start = sunrise.plus({ hours: 5 });
  const end = start.plus({ minutes: 48 });
  
  return { start, end };
}
