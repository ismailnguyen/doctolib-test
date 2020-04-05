import knex from 'knexClient'

export async function getOpenings() {
    return knex('events')
            .select('starts_at', 'ends_at', 'weekly_recurring')
            .where('kind', 'opening')
  }

export async function getAppointments() {
  return knex('events')
            .select('starts_at', 'ends_at')
            .where('kind', 'appointment')
}
