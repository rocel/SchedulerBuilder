# SchedulerBuilder
This is a simple _ISO8601_ repeating interval builder for the `<repeat>/<start>/<duration>` notation only.

# HOW TO USE
```
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

console.log(schedule); // prints 'R8/2018-04-16T14:00:00.000Z/P0Y0M22DT0H0M'
```