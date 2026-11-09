/*
Test Documentation:
- Test Name: DateTimeService Unit Tests
- Purpose: Validate date/time service functionality including timestamp formatting and date range calculations
- Scenario: Tests cover timestamp formatting, date formatting, and 12-month date range generation
- Expected Result: All date/time operations should produce correctly formatted outputs with accurate calculations
*/

(function() {
  'use strict';

  describe('DateTimeService', function() {
    var DateTimeService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DateTimeService_) {
      DateTimeService = _DateTimeService_;
    }));

    describe('formatTimestamp', function() {
      it('should format timestamp to readable date-time string', function() {
        var timestamp = new Date('2024-01-15T14:30:00').getTime();
        var formatted = DateTimeService.formatTimestamp(timestamp);

        expect(formatted).toContain('Jan');
        expect(formatted).toContain('15');
        expect(formatted).toContain('2024');
        expect(formatted).toMatch(/\d{1,2}:\d{2}/);
      });

      it('should handle ISO string timestamp', function() {
        var timestamp = '2024-03-20T09:15:30Z';
        var formatted = DateTimeService.formatTimestamp(timestamp);

        expect(formatted).toContain('Mar');
        expect(formatted).toContain('20');
        expect(formatted).toContain('2024');
      });

      it('should format midnight timestamp correctly', function() {
        var timestamp = new Date('2024-06-01T00:00:00').getTime();
        var formatted = DateTimeService.formatTimestamp(timestamp);

        expect(formatted).toContain('Jun');
        expect(formatted).toContain('1');
        expect(formatted).toContain('2024');
        expect(formatted).toMatch(/12:00 AM|00:00/);
      });

      it('should format end of day timestamp correctly', function() {
        var timestamp = new Date('2024-12-31T23:59:59').getTime();
        var formatted = DateTimeService.formatTimestamp(timestamp);

        expect(formatted).toContain('Dec');
        expect(formatted).toContain('31');
        expect(formatted).toContain('2024');
      });

      it('should handle invalid timestamp gracefully', function() {
        var formatted = DateTimeService.formatTimestamp('invalid-date');

        expect(formatted).toBeDefined();
      });
    });

    describe('formatDate', function() {
      it('should format date without time component', function() {
        var timestamp = new Date('2024-05-10T14:30:00').getTime();
        var formatted = DateTimeService.formatDate(timestamp);

        expect(formatted).toContain('May');
        expect(formatted).toContain('10');
        expect(formatted).toContain('2024');
        expect(formatted).not.toMatch(/\d{1,2}:\d{2}/);
      });

      it('should format first day of year', function() {
        var timestamp = new Date('2024-01-01T00:00:00').getTime();
        var formatted = DateTimeService.formatDate(timestamp);

        expect(formatted).toContain('Jan');
        expect(formatted).toContain('1');
        expect(formatted).toContain('2024');
      });

      it('should format last day of year', function() {
        var timestamp = new Date('2024-12-31T23:59:59').getTime();
        var formatted = DateTimeService.formatDate(timestamp);

        expect(formatted).toContain('Dec');
        expect(formatted).toContain('31');
        expect(formatted).toContain('2024');
      });

      it('should handle leap year date', function() {
        var timestamp = new Date('2024-02-29T12:00:00').getTime();
        var formatted = DateTimeService.formatDate(timestamp);

        expect(formatted).toContain('Feb');
        expect(formatted).toContain('29');
        expect(formatted).toContain('2024');
      });
    });

    describe('getLast12Months', function() {
      it('should return date range for last 12 months', function() {
        var dateRange = DateTimeService.getLast12Months();

        expect(dateRange).toBeDefined();
        expect(dateRange.startDate).toBeDefined();
        expect(dateRange.endDate).toBeDefined();
      });

      it('should return start date 12 months before end date', function() {
        var dateRange = DateTimeService.getLast12Months();
        var start = new Date(dateRange.startDate);
        var end = new Date(dateRange.endDate);

        var monthDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

        expect(monthDiff).toBe(12);
      });

      it('should return ISO formatted date strings', function() {
        var dateRange = DateTimeService.getLast12Months();

        expect(dateRange.startDate).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
        expect(dateRange.endDate).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
      });

      it('should return valid date objects when parsed', function() {
        var dateRange = DateTimeService.getLast12Months();
        var start = new Date(dateRange.startDate);
        var end = new Date(dateRange.endDate);

        expect(start.toString()).not.toBe('Invalid Date');
        expect(end.toString()).not.toBe('Invalid Date');
        expect(start.getTime()).toBeLessThan(end.getTime());
      });

      it('should return end date close to current date', function() {
        var dateRange = DateTimeService.getLast12Months();
        var end = new Date(dateRange.endDate);
        var now = new Date();

        var timeDiff = Math.abs(now.getTime() - end.getTime());
        var secondsDiff = timeDiff / 1000;

        expect(secondsDiff).toBeLessThan(60);
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: formatTimestamp, formatDate, getLast12Months
- Scenarios covered:
  * Timestamp formatting with date and time
  * Date formatting without time component
  * ISO string timestamp handling
  * Midnight and end-of-day timestamps
  * First and last day of year
  * Leap year date handling
  * Invalid timestamp handling
  * 12-month date range calculation
  * ISO format validation
  * Date range validation
- Uncovered scenarios: Timezone conversion (uses browser locale), custom format strings
- Edge cases tested: Invalid dates, leap years, year boundaries, midnight times
*/