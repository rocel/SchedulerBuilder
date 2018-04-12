import {
  SchedulerBuilder,
  DAY
} from './src'


const schedule = new SchedulerBuilder()
  .from('2018-04-10T00:00:00Z')
  .to('2018-06-10T00:00:00Z')
  .every(DAY.MONDAY)
  .at('14')
  .build()

console.log(schedule);