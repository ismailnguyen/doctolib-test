import knex from 'knexClient'

export async function truncate () {
    return knex('events')
            .truncate() 
}

export async function seed (events) {
    await knex('events')
            .insert([
                {
                    kind: 'opening',
                    starts_at: new Date('2014-08-04 09:30'),
                    ends_at: new Date('2014-08-04 12:30'),
                    weekly_recurring: true,
                },
                {
                    kind: 'appointment',
                    starts_at: new Date('2014-08-11 10:30'),
                    ends_at: new Date('2014-08-11 11:30'),
                },
          ])
}