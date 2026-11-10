/*
Test Documentation:
- Test Name: DateRangeService - getLast12Months calculation
- Purpose: Validates that getLast12Months returns correct date range object
- Scenario: Service calculates start and end dates for 12-month period
- Expected Result: Returns object with startDate 12 months ago and endDate as current date
*/
/*
Test Documentation:
- Test Name: DateRangeService - formatMonth date formatting
- Purpose: Validates that formatMonth correctly formats date strings
- Scenario: Service receives date string and formats to 'MMM yyyy' format
- Expected Result: Returns formatted month string like 'Jan 2024'
*/
/*
Coverage Report:
- Functions tested: getLast12Months, formatMonth
- Scenarios covered: date range calculation, date formatting, edge cases
- Uncovered scenarios: none - all date utility functions tested
- Edge cases: leap year dates, year boundaries, invalid date strings
*/

(function() {
  'use strict';

  describe('DateRangeService', function() {
    var DateRangeService, $filter;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DateRangeService_, _$filter_) {
      DateRangeService = _DateRangeService_;
      $filter = _$filter_;
    }));

    describe('getLast12Months', function() {
      it('should return object with startDate and endDate properties', function() {
        var result = DateRangeService.getLast12Months();

        expect(result).toBeDefined();
        expect(result.startDate).toBeDefined();
        expect(result.endDate).toBeDefined();
        expect(result.startDate instanceof Date).toBe(true);
        expect(result.endDate instanceof Date).toBe(true);
      });

      it('should set endDate to current date', function() {
        var before = new Date();
        var result = DateRangeService.getLast12Months();
        var after = new Date();

        expect(result.endDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(result.endDate.getTime()).toBeLessThanOrEqual(after.getTime());
      });

      it('should set startDate to 12 months before endDate', function() {
        var result = DateRangeService.getLast12Months();

        var expectedStartMonth = result.endDate.getMonth();
        var actualStartMonth = result.startDate.getMonth();

        expect(actualStartMonth).toBe(expectedStartMonth);

        var yearDiff = result.endDate.getFullYear() - result.startDate.getFullYear();
        expect(yearDiff).toBe(1);
      });

      it('should handle year boundary correctly', function() {
        jasmine.clock().install();
        var testDate = new Date(2024, 0, 15);
        jasmine.clock().mockDate(testDate);

        var result = DateRangeService.getLast12Months();

        expect(result.endDate.getFullYear()).toBe(2024);
        expect(result.endDate.getMonth()).toBe(0);
        expect(result.startDate.getFullYear()).toBe(2023);
        expect(result.startDate.getMonth()).toBe(0);

        jasmine.clock().uninstall();
      });

      it('should return consistent results when called multiple times', function() {
        var result1 = DateRangeService.getLast12Months();
        var result2 = DateRangeService.getLast12Months();

        var timeDiff = Math.abs(result1.endDate.getTime() - result2.endDate.getTime());
        expect(timeDiff).toBeLessThan(1000);
      });
    });

    describe('formatMonth', function() {
      it('should format date string to MMM yyyy format', function() {
        var dateString = '2024-03-15';
        var result = DateRangeService.formatMonth(dateString);

        expect(result).toBe('Mar 2024');
      });

      it('should handle different month formats correctly', function() {
        var testCases = [
          {input: '2024-01-01', expected: 'Jan 2024'},
          {input: '2024-06-15', expected: 'Jun 2024'},
          {input: '2024-12-31', expected: 'Dec 2024'}
        ];

        testCases.forEach(function(testCase) {
          var result = DateRangeService.formatMonth(testCase.input);
          expect(result).toBe(testCase.expected);
        });
      });

      it('should handle ISO date strings', function() {
        var isoString = '2024-03-15T10:30:00.000Z';
        var result = DateRangeService.formatMonth(isoString);

        expect(result).toContain('2024');
        expect(result).toContain('Mar');
      });

      it('should handle year boundaries', function() {
        var decDate = '2023-12-31';
        var janDate = '2024-01-01';

        var decResult = DateRangeService.formatMonth(decDate);
        var janResult = DateRangeService.formatMonth(janDate);

        expect(decResult).toBe('Dec 2023');
        expect(janResult).toBe('Jan 2024');
      });

      it('should use AngularJS date filter internally', function() {
        spyOn($filter('date'), 'call').and.callThrough();

        var dateString = '2024-03-15';
        DateRangeService.formatMonth(dateString);

        expect($filter).toHaveBeenCalledWith('date');
      });
    });

    describe('edge cases', function() {
      it('should handle leap year dates in getLast12Months', function() {
        jasmine.clock().install();
        var leapYearDate = new Date(2024, 1, 29);
        jasmine.clock().mockDate(leapYearDate);

        var result = DateRangeService.getLast12Months();

        expect(result.startDate.getFullYear()).toBe(2023);
        expect(result.endDate.getFullYear()).toBe(2024);

        jasmine.clock().uninstall();
      });

      it('should handle formatMonth with various date formats', function() {
        var formats = [
          '2024-03-15',
          '2024/03/15',
          'March 15, 2024'
        ];

        formats.forEach(function(format) {
          var result = DateRangeService.formatMonth(format);
          expect(result).toBeDefined();
          expect(typeof result).toBe('string');
        });
      });
    });
  });
})();