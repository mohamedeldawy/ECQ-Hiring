import { Candidate } from '../types';

export function getEffectiveCalendarEmail(candidate?: Candidate | null, overrideEmail?: string): string {
  if (overrideEmail && overrideEmail.trim()) {
    return overrideEmail.trim();
  }
  if (candidate?.calendarEmail && candidate.calendarEmail.trim()) {
    return candidate.calendarEmail.trim();
  }
  try {
    const saved = localStorage.getItem('elkheta_user_calendar_email');
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // ignore
  }
  return 'dawy@elkheta.com';
}

export function createGoogleCalendarUrl(candidate: Candidate, customEmails?: string): string {
  const title = encodeURIComponent(`مقابلة تعيين: ${candidate.name} - ${candidate.specializationRole}`);
  
  // Format date and time
  const dateStr = candidate.interviewDate || new Date().toISOString().split('T')[0];
  const timeStr = candidate.interviewTime || '11:00 ص';
  
  // Parse time
  let hours = 11;
  let minutes = 0;
  const match = timeStr.match(/(\d+):?(\d*)\s*(ص|م|am|pm)?/i);
  if (match) {
    hours = parseInt(match[1], 10);
    if (match[2]) minutes = parseInt(match[2], 10);
    const period = match[3];
    if (period && (period === 'م' || period.toLowerCase() === 'pm') && hours < 12) {
      hours += 12;
    } else if (period && (period === 'ص' || period.toLowerCase() === 'am') && hours === 12) {
      hours = 0;
    }
  }

  // Build ISO format string YYYYMMDDTHHmmSSZ
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  const cleanDate = dateStr.replace(/-/g, '');
  const startHoursStr = pad(hours);
  const startMinutesStr = pad(minutes);
  const endHoursStr = pad((hours + 1) % 24);

  const startDateFormatted = `${cleanDate}T${startHoursStr}${startMinutesStr}00`;
  const endDateFormatted = `${cleanDate}T${endHoursStr}${startMinutesStr}00`;

  const effectiveEmail = getEffectiveCalendarEmail(candidate, customEmails);

  const detailsText = `مقابلة شخصية لتقييم واختيار أخصائي جودة محتوى:
- المرشح: ${candidate.name}
- التخصص: ${candidate.specializationRole}
- المادة: ${candidate.subject}
- المرحلة: ${candidate.targetStage}
- سنوات الخبرة: ${candidate.experienceYears} سنوات
- الراتب المتوقع: ${candidate.expectedSalary}
- المقابلة مشتركة بين: أ/ محمد الضوي (مدير جودة المحتوى) و أ/ حبيبة (مسؤول الموارد البشرية)
- منصة الخطة - فرع الإسكندرية
- البريد المستهدف لمفكرة جوجل: ${effectiveEmail}`;

  const details = encodeURIComponent(detailsText);
  const location = encodeURIComponent('الإسكندرية - منصة الخطة التعليمية');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateFormatted}/${endDateFormatted}&details=${details}&location=${location}&add=${encodeURIComponent(effectiveEmail)}`;
}

export function downloadIcsFile(candidate: Candidate, customEmails?: string) {
  const dateStr = candidate.interviewDate || new Date().toISOString().split('T')[0];
  const cleanDate = dateStr.replace(/-/g, '');
  const effectiveEmail = getEffectiveCalendarEmail(candidate, customEmails);
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//El-Kheta Educational Platform//Recruitment Calendar//AR
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:elkheta-${candidate.id}-${Date.now()}@elkheta.com
DTSTAMP:${cleanDate}T100000Z
DTSTART:${cleanDate}T090000Z
DTEND:${cleanDate}T100000Z
SUMMARY:مقابلة تعيين: ${candidate.name} (${candidate.specializationRole})
DESCRIPTION:مقابلة تقييم جودة المحتوى لمنصة الخطة\\nالمرشح: ${candidate.name}\\nالتخصص: ${candidate.specializationRole}\\nالمادة: ${candidate.subject}\\nالمرحلة: ${candidate.targetStage}\\nلجنة التقييم: أ/ محمد الضوي & أ/ حبيبة\\nالبريد المستهدف: ${effectiveEmail}
LOCATION:الإسكندرية - جمهورية مصر العربية
ORGANIZER;CN="منصة الخطة التعليمية":mailto:${effectiveEmail}
ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN="لجنة المقابلات":mailto:${effectiveEmail}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `interview_${candidate.name.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
