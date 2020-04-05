import getAvailabilities from '../src/getAvailabilities'
import { truncate, seed } from './fixtures'

describe('getAvailabilities', () => {

  beforeEach(async () => await truncate().then(seed()))

  describe('simple cases', () => {

    it('should have correct number of availabilities', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))
      
      expect(availabilities).toHaveLength(7)
    })

    it('first availability date should be at given start date', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))

      expect(String(availabilities[0].date)).toBe(String(new Date('2014-08-10')))
    })

    it('first availability day should have no slots', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))

      expect(availabilities[0].slots).toEqual([])
    })

    it('second availability date should be on next day of given start date', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))

      expect(String(availabilities[1].date)).toBe(String(new Date('2014-08-11')))
    })

    it('second availability day should give 4 slots', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))

      expect(availabilities[1].slots).toEqual(['9:30', '10:00', '11:30', '12:00'])
    })

    it('third availability day should have no slots', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))

      expect(availabilities[2].slots).toEqual([])
    })

    it('seventh availability day should be six day after given start date', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))

      expect(String(availabilities[6].date)).toBe(String(new Date('2014-08-16')))
    })
  })

  describe('edge cases', () => {

    it('should not have more than 7 days on availabilities', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))

      expect(availabilities[7]).toBeUndefined()
    })

    it('should not have availabilities before openings start', async () => {
      const availabilities = await getAvailabilities(new Date('1992-03-02'))

      expect(availabilities).toHaveLength(0)
    })
  })
})
