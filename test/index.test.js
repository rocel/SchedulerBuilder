import {
  SchedulerBuilder,
  DAY
} from "../src";

describe("SchedulerBuilder", () => {
  it("initialize", () => {
    expect(new SchedulerBuilder()).toBeDefined();
  });

  describe("from date", () => {
    it("Gives the correct date for the next monday from given date", () => {
      const builder = new SchedulerBuilder()
        .from("2018-04-10T00:00:00Z") // 10th of april 2018 is a Tuesday
        .every(DAY.MONDAY);

      expect(
        builder._getNextFromIoWeekday(DAY.MONDAY).format("YYYY-MM-DD")
      ).toEqual("2018-04-16"); // 16th of april 2018 is a Monday
    });

    it("Computes the number of given weekday between 2 dates", () => {
      const builder = new SchedulerBuilder()
        .from("2018-04-10T00:00:00Z")
        .to("2018-06-10T00:00:00Z")
        .every(DAY.MONDAY);
      expect(builder._getRepeat(DAY.MONDAY)).toBe(8);
    });
  });

  describe("build", () => {
    it("Gives the correct schedule for a single day", () => {
      const schedule = new SchedulerBuilder()
        .from("2018-04-10T00:00:00Z")
        .to("2018-06-10T00:00:00Z")
        .every(DAY.MONDAY)
        .at("14")
        .build();
      expect(schedule).toEqual(["R8/2018-04-16T14:00:00.000Z/P0Y0M56DT0H0M"]);
    });

    it("Gives the correct schedule for a single day at a specific time with minutes", () => {
      const schedule = new SchedulerBuilder()
        .from("2018-04-10T00:00:00Z")
        .to("2018-06-10T00:00:00Z")
        .every(DAY.MONDAY)
        .at("14:30")
        .build();
      expect(schedule).toEqual(["R8/2018-04-16T14:30:00.000Z/P0Y0M56DT0H0M"]);
    });

    it("Gives the correct schedule for 2 given days", () => {
      const schedule = new SchedulerBuilder()
        .from("2018-04-10T00:00:00Z")
        .to("2018-06-10T00:00:00Z")
        .every(DAY.MONDAY)
        .and.every(DAY.THURSDAY)
        .at("14")
        .build();
      expect(schedule).toEqual([
        "R8/2018-04-16T14:00:00.000Z/P0Y0M56DT0H0M",
        "R9/2018-04-12T14:00:00.000Z/P0Y0M63DT0H0M"
      ]);
    });

    it('Gives the correct schedule for all "workdays"', () => {
      const schedule = new SchedulerBuilder()
        .from("2018-04-10T00:00:00Z")
        .to("2018-06-10T00:00:00Z")
        .every(DAY.WORKDAYS)
        .at("14")
        .build();
      expect(schedule).toEqual([
        "R8/2018-04-16T14:00:00.000Z/P0Y0M56DT0H0M",
        "R9/2018-04-10T14:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-11T14:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-12T14:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-13T14:00:00.000Z/P0Y0M63DT0H0M"
      ]);
    });

    it('Gives the correct schedule for all "days"', () => {
      const schedule = new SchedulerBuilder()
        .from("2018-04-10T00:00:00Z")
        .to("2018-06-10T00:00:00Z")
        .every(DAY.DAY)
        .at("10:00")
        .build();
      expect(schedule).toEqual([
        "R8/2018-04-16T10:00:00.000Z/P0Y0M56DT0H0M",
        "R9/2018-04-10T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-11T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-12T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-13T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-14T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-15T10:00:00.000Z/P0Y0M63DT0H0M",
      ]);
    });
  });

  describe("unbuild", () => {
    const testIntervalsString = {
      "[1, 2, 3, 4, 5]": [
        "R8/2018-04-16T14:00:00.000Z/P0Y0M56DT0H0M",
        "R9/2018-04-10T14:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-11T14:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-12T14:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-13T14:00:00.000Z/P0Y0M63DT0H0M"
      ],
      "[1, 4]": [
        "R8/2018-04-16T14:00:00.000Z/P0Y0M56DT0H0M",
        "R9/2018-04-12T14:00:00.000Z/P0Y0M63DT0H0M"
      ],
      "[1]": ["R8/2018-04-16T14:30:00.000Z/P0Y0M56DT0H0M"],
      "[1,2,3,4,5,6,7]": [
        "R8/2018-04-16T10:00:00.000Z/P0Y0M56DT0H0M",
        "R9/2018-04-10T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-11T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-12T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-13T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-14T10:00:00.000Z/P0Y0M63DT0H0M",
        "R9/2018-04-15T10:00:00.000Z/P0Y0M63DT0H0M",
      ],
    };

    it("correctly unbuild an intervals array", () => {
      Object.keys(testIntervalsString).forEach(key => {
        expect(
          new SchedulerBuilder().unbuild(testIntervalsString[key])
        ).toEqual(eval(key));
      });
    });

    it("throw and type error if intervals are not an array", () => {
      expect(() => new SchedulerBuilder().unbuild('ahahaha')).toThrow(new TypeError('intervals must be an array of ISO8601 strings'))
    });
  });
});