# doctolib-test
Doctolib hiring test exercice

`https://doctolib.github.io/job-applications/`

## Technical Test @ Doctolib
The goal is to write an algorithm that checks the availabilities of an agenda depending of the events attached to it. The main method has a start date for input and is looking for the availabilities of the next 7 days.

They are two kinds of events:
- `opening`, are the openings for a specific day and they can be recurring week by week.
- `appointment`, times when the doctor is already booked.

Your Mission:
- must pass the unit tests below
- add tests for edge cases
- be pragmatic about performance
- read our values : `[careers.doctolib.fr/engineering/](https://about.doctolib.fr/careers/engineering.html)
- SQLite compatible
- DO NOT host your project on public repositories!
  - Send us a Zip file containing your rails project, or your Javascript project without node_modules

### Coding in Ruby?
- Must run with `ruby 2.6.6`
- Must run with `rails 6.0.2.2`
- Don’t add any gems
- Stick to `event.rb` and `event_test.rb` files

#### To init the project:
```shell
$ rails _6.0.2.2_ new doctolib-test --api --skip-action-mailer --skip-action-mailbox --skip-active-storage --skip-action-cable --skip-system-test --skip-puma
$ cd doctolib-test/
$ bundle exec rails g model event starts_at:datetime ends_at:datetime kind:string weekly_recurring:boolean --skip-fixture
$ bin/setup
```

#### Basic unit test
```ruby
# test/models/event_test.rb

require 'test_helper'

class EventTest < ActiveSupport::TestCase

  test "one simple test example" do

    Event.create kind: 'opening', starts_at: DateTime.parse("2014-08-04 09:30"), ends_at: DateTime.parse("2014-08-04 12:30"), weekly_recurring: true
    Event.create kind: 'appointment', starts_at: DateTime.parse("2014-08-11 10:30"), ends_at: DateTime.parse("2014-08-11 11:30")

    availabilities = Event.availabilities DateTime.parse("2014-08-10")
    assert_equal '2014/08/10', availabilities[0][:date]
    assert_equal [], availabilities[0][:slots]
    assert_equal '2014/08/11', availabilities[1][:date]
    assert_equal ["9:30", "10:00", "11:30", "12:00"], availabilities[1][:slots]
    assert_equal [], availabilities[2][:slots]
    assert_equal '2014/08/16', availabilities[6][:date]
    assert_equal 7, availabilities.length
  end

end
```

### Coding in Javascript?
- in modern JavaScript with [knex](https://www.npmjs.com/package/knex-orm) to interact with database

#### To init the project:
- [Download the project](https://doctolib.github.io/job-applications/doctolib-test.zip)
- Install [node](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/)
- Run `yarn && yarn test`, focus on `src` folder, you are ready!

#### Basic unit test
```js
// getAvailabilities.test.js

import knex from 'knexClient'
import getAvailabilities from './getAvailabilities'

describe('getAvailabilities', () => {
  beforeEach(() => knex('events').truncate())

  describe('simple case', () => {
    beforeEach(async () => {
      await knex('events').insert([
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
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))
      expect(availabilities.length).toBe(7)
      expect(String(availabilities[0].date)).toBe(String(new Date('2014-08-10')))
      expect(availabilities[0].slots).toEqual([])
      expect(String(availabilities[1].date)).toBe(String(new Date('2014-08-11')))
      expect(availabilities[1].slots).toEqual(['9:30', '10:00', '11:30', '12:00'])
      expect(availabilities[2].slots).toEqual([])
      expect(String(availabilities[6].date)).toBe(String(new Date('2014-08-16')))
    })
  })
})
```
