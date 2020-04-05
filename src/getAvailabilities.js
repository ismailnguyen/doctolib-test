import moment from 'moment'
import { getOpenings, getAppointments } from './eventsRepository'

function isOpenedDay (currentDate, openingDate) {
  return moment(currentDate).day() === moment(openingDate.starts_at).day()
}

function isSomeAppointment (appointments, slotDate) {
  return appointments
          .some(
            appointment => 
                slotDate.isBetween(moment(appointment.starts_at), moment(appointment.ends_at)) 
                || slotDate.isSame(moment(appointment.starts_at))
          );
}

function formatSlotTime (slot) {
  return slot.format('H:mm');
}

function countOpeningSlots (opening, slotDurationMinutes) {
  const openingTimespan = moment.duration(moment(opening.ends_at).diff(moment(opening.starts_at)));

  return openingTimespan.asMinutes() / slotDurationMinutes;
}

function isAnyOpeningBefore (startDate, openings) {
  return openings.some(opening => moment(opening.starts_at).isBefore(moment(startDate)));
}

function getCurrentSlotDate(opening, date, slotDurationMinutes, slotNumber) {
  const slotTime = moment(opening.starts_at);
  
  return moment(date)
                    .set({
                      'hour': slotTime.get('hour'),
                      'minute': slotTime.get('minute')
                    })
                    .add(slotNumber * slotDurationMinutes, 'minutes');
}

function getSlots (date, { openings, appointments }) {
  const slotDurationMinutes = 30;
  var slots = [];
  
  openings
  .forEach(opening =>
  {
    if (!isOpenedDay(date, opening))
      return;

    const openingSlotsOnTimespan = countOpeningSlots(opening, slotDurationMinutes);

    for (let slotNumber = 0; slotNumber < openingSlotsOnTimespan; slotNumber++)
    {
      const slotDate = getCurrentSlotDate(opening, date, slotDurationMinutes, slotNumber);

      if (isSomeAppointment(appointments, slotDate))
        continue;

      slots.push(formatSlotTime(slotDate));
    }
  })

  return slots;
}

export default async function getAvailabilities(startDate)
{
  const availabilitiesDaySpan = 7;
  let availabilities = [];

  const events =  {
    openings: await getOpenings(),
    appointments: await getAppointments()
  };

  if (!isAnyOpeningBefore(startDate, events.openings))
    return availabilities;

  for (let day = 0; day < availabilitiesDaySpan; day++)
  {
    const availabilityDate =  moment(startDate)
                                .add(day, 'days')
                                .toDate();

    availabilities.push({
      date: availabilityDate,
      slots: getSlots(availabilityDate, events)
    });
  }

  return availabilities;
}
