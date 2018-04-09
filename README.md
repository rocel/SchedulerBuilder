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

console.log(schedule); // ['R8/2018-04-16T14:00:00.000Z/P0Y0M56DT0H0M']
```

You can also schedule multiple days :
```
const schedule = new SchedulerBuilder()
                .from('2018-04-10T00:00:00Z')
                .to('2018-06-10T00:00:00Z')
                .every(DAY.MONDAY)
                .and
                .every(DAY.THURSDAY)
                .at('14:30')
                .build()
console.log(schedule); // [ 'R8/2018-04-16T14:00:00.000Z/P0Y0M56DT0H0M','R9/2018-04-10T14:00:00.000Z/P0Y0M63DT0H0M' ]
```

See the [DAY](https://github.com/rocel/SchedulerBuilder/blob/master/src/index.js#L3) enum for more information. 