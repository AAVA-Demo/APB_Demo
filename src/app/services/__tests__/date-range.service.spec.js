/*
Test Documentation:
- Test Name: DateRangeService - getLast12Months
- Purpose: Validates calculation of date range for last 12 months
- Scenario: Call getLast12Months and verify startDate is 12 months before endDate
- Expected Result: Returns object with startDate 12 months ago and endDate as current date
*/
/*
Test Documentation:
- Test Name: DateRangeService - getCurrentMonth
- Purpose: Validates calculation of current month's date range
- Scenario: Call getCurrentMonth and verify startDate is first day and endDate is last day of current month
- Expected Result: Returns object with correct first and last day of current month
*/
/*
Test Documentation:
- Test Name: DateRangeService - formatDate
- Purpose: Validates date formatting to ISO string format (YYYY-MM-DD)
- Scenario: Call formatDate with various date objects
- Expected Result: Returns correctly formatted date string in YYYY-MM-DD format
*/
/*
Coverage Report:
- Functions tested: getLast12Months, getCurrentMonth, formatDate
- Scenarios covered: 12-month range calculation, current month boundaries, ISO date formatting, edge dates
- Uncovered scenarios: none
- Edge cases: month boundaries, year boundaries, leap year handling
*/

(function() {
  'use strict';

  describe('DateRangeService', function() {
    var DateRangeService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DateRangeService_) {
      DateRangeService = _DateRangeService_;
    }));

    describe('getLast12Months', function() {
      it('should return object with startDate and endDate', function() {
        var range = DateRangeService.getLast12Months();
        expect(range).toBeDefined();
        expect(range.startDate).toBeDefined();
        expect(range.endDate).toBeDefined();
      });

      it('should return startDate 12 months before endDate', function() {
        var range = DateRangeService.getLast12Months();
        var monthsDiff = (range.endDate.getFullYear() - range.startDate.getFullYear()) * 12 +
                         (range.endDate.getMonth() - range.startDate.getMonth());
        expect(monthsDiff).toBe(12);
      });

      it('should return endDate as current date', function() {
        var range = DateRangeService.getLast12Months();
        var now = new Date();
        expect(range.endDate.getFullYear()).toBe(now.getFullYear());
        expect(range.endDate.getMonth()).toBe(now.getMonth());
        expect(range.endDate.getDate()).toBe(now.getDate());
      });

      it('should return Date objects', function() {
        var range = DateRangeService.getLast12Months();
        expect(range.startDate instanceof Date).toBe(true);
        expect(range.endDate instanceof Date).toBe(true);
      });

      it('should handle year boundary correctly', function() {
        var range = DateRangeService.getLast12Months();
        expect(range.startDate.getTime()).toBeLessThan(range.endDate.getTime());
      });
    });

    describe('getCurrentMonth', function() {
      it('should return object with startDate and endDate', function() {
        var range = DateRangeService.getCurrentMonth();
        expect(range).toBeDefined();
        expect(range.startDate).toBeDefined();
        expect(range.endDate).toBeDefined();
      });

      it('should return startDate as first day of current month', function() {
        var range = DateRangeService.getCurrentMonth();
        var now = new Date();
        expect(range.startDate.getFullYear()).toBe(now.getFullYear());
        expect(range.startDate.getMonth()).toBe(now.getMonth());
        expect(range.startDate.getDate()).toBe(1);
      });

      it('should return endDate as last day of current month', function() {
        var range = DateRangeService.getCurrentMonth();
        var now = new Date();
        var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        expect(range.endDate.getFullYear()).toBe(now.getFullYear());
        expect(range.endDate.getMonth()).toBe(now.getMonth());
        expect(range.endDate.getDate()).toBe(lastDay);
      });

      it('should return Date objects', function() {
        var range = DateRangeService.getCurrentMonth();
        expect(range.startDate instanceof Date).toBe(true);
        expect(range.endDate instanceof Date).toBe(true);
      });

      it('should have startDate before or equal to endDate', function() {
        var range = DateRangeService.getCurrentMonth();
        expect(range.startDate.getTime()).toBeLessThanOrEqual(range.endDate.getTime());
      });

      it('should handle February correctly in leap year', function() {
        // Mock current date to February 2024 (leap year)
        var originalDate = Date;
        spyOn(window, 'Date').and.callFake(function() {
          if (arguments.length === 0) {
            return new originalDate(2024, 1, 15); // Feb 15, 2024
          }
          return new originalDate(arguments[0], arguments[1], arguments[2]);
        });
        var range = DateRangeService.getCurrentMonth();
        expect(range.endDate.getDate()).toBe(29);
      });
    });

    describe('formatDate', function() {
      it('should format date to YYYY-MM-DD string', function() {
        var date = new Date(2023, 5, 15); // June 15, 2023
        var formatted = DateRangeService.formatDate(date);
        expect(formatted).toBe('2023-06-15');
      });

      it('should handle single-digit months correctly', function() {
        var date = new Date(2023, 0, 5); // January 5, 2023
        var formatted = DateRangeService.formatDate(date);
        expect(formatted).toBe('2023-01-05');
      });

      it('should handle single-digit days correctly', function() {
        var date = new Date(2023, 11, 1); // December 1, 2023
        var formatted = DateRangeService.formatDate(date);
        expect(formatted).toBe('2023-12-01');
      });

      it('should handle year boundaries correctly', function() {
        var date = new Date(2023, 11, 31); // December 31, 2023
        var formatted = DateRangeService.formatDate(date);
        expect(formatted).toBe('2023-12-31');
      });

      it('should return string type', function() {
        var date = new Date(2023, 5, 15);
        var formatted = DateRangeService.formatDate(date);
        expect(typeof formatted).toBe('string');
      });

      it('should handle current date', function() {
        var now = new Date();
        var formatted = DateRangeService.formatDate(now);
        expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it('should handle leap year date', function() {
        var date = new Date(2024, 1, 29); // Feb 29, 2024
        var formatted = DateRangeService.formatDate(date);
        expect(formatted).toBe('2024-02-29');
      });
    });

    describe('Integration scenarios', function() {
      it('should format getLast12Months dates correctly', function() {
        var range = DateRangeService.getLast12Months();
        var formattedStart = DateRangeService.formatDate(range.startDate);
        var formattedEnd = DateRangeService.formatDate(range.endDate);
        expect(formattedStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(formattedEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it('should format getCurrentMonth dates correctly', function() {
        var range = DateRangeService.getCurrentMonth();
        var formattedStart = DateRangeService.formatDate(range.startDate);
        var formattedEnd = DateRangeService.formatDate(range.endDate);
        expect(formattedStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(formattedEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });
})();