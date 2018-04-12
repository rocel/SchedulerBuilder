import moment from 'moment'

export const DAY = Object.freeze({
    "MONDAY": 1,
    "TUESDAY": 2,
    "WEDNESDAY": 3,
    "THURSDAY": 4,
    "FRIDAY": 5,
    "SATURDAY": 6,
    "SUNDAY": 7,
    "WORKDAY": [1, 2, 3, 4, 5],
    "WORKDAYS": [1, 2, 3, 4, 5],
    "WEEKEND": [6, 7],
    "DAY": [1, 2, 3, 4, 5, 6, 7],
})

export class SchedulerBuilder {
    constructor() {
        this.day = []
        this.and = this
    }

    from(from) {
        this.from = moment(from).utc().startOf('day')
        return this
    }

    to(to) {
        this.to = moment(to).utc().endOf('day')
        return this
    }

    every(day) {
        if (Array.isArray(day)) { // for WORKDAYS
            this.day = this.day.concat(day)
        } else {
            this.day.push(day)
        }

        return this
    }

    at(time) {
        this.time = moment(time, 'HH:mmZZ')
        return this
    }

    _getNextFromIoWeekday(day) {
        const isoWeekdayToFind = moment().day(day).isoWeekday()
        const next = this.from.clone()
        while (isoWeekdayToFind !== next.isoWeekday()) {
            next.add(1, 'day')
        }
        return next
    }

    _getRepeat(day) {
        const isoWeekday = moment().day(day).isoWeekday()
        const nbDays = this.to.diff(this.from, 'days')
        let start = this.from.clone()
        let repeat = 0
        const d = []
        for (let i = 0; i <= nbDays; i++) {
            d.push(start.format('DD-MM'))
            if (isoWeekday === start.isoWeekday()) {
                repeat++
            }
            start.add(1, 'day')
        }
        return repeat
    }

    _parseTime(time) {
        return {
            hour: time.get('hour'),
            minute: time.get('minute')
        }
    }

    checks() {
        // this.to must be after this.from
        if (!this.to.isAfter(this.from)) {
            throw new Error('The to date must be later than the from')
        }
    }

    build() {
        this.checks()
        const str = []
        for (let day of this.day) {
            const repeat = this._getRepeat(day)
            const computedDuration = repeat * 7
            const duration = `P0Y0M${computedDuration}DT0H0M`
            const nextWeekDay = this._getNextFromIoWeekday(day).clone()
            const time = this._parseTime(this.time)
            const start = nextWeekDay.set('hour', time.hour).set('minute', time.minute).toISOString()
            str.push(`R${repeat}/${start}/${duration}`)
        }
        return str
    }

    unbuild(intervals) {
        if (!Array.isArray(intervals)) throw new TypeError('intervals must be an array of ISO8601 strings');
        return intervals.map(interval => moment(interval.split('/')[1]).isoWeekday());
    }

}