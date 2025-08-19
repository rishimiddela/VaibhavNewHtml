import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { createEvents } from 'ics';

export const exportToPDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('panchang.pdf');
};

interface PanchangEvent {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export const exportToICS = (events: PanchangEvent[]) => {
  const icsEvents = events.map(event => ({
    title: event.title,
    description: event.description,
    start: [
      event.startTime.getFullYear(),
      event.startTime.getMonth() + 1,
      event.startTime.getDate(),
      event.startTime.getHours(),
      event.startTime.getMinutes()
    ],
    end: [
      event.endTime.getFullYear(),
      event.endTime.getMonth() + 1,
      event.endTime.getDate(),
      event.endTime.getHours(),
      event.endTime.getMinutes()
    ]
  }));

  createEvents(icsEvents, (error, value) => {
    if (error) {
      console.error(error);
      return;
    }
    if (value) {
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      saveAs(blob, 'panchang.ics');
    }
  });
};
