/*
Test Documentation:
- Test Name: ResponsiveUtilsService - getBreakpoint returns correct breakpoint for width
- Purpose: Validates breakpoint calculation logic
- Scenario: Given various screen widths
- Expected Result: Returns correct Bootstrap breakpoint (xs, sm, md, lg, xl)
*/
/*
Test Documentation:
- Test Name: ResponsiveUtilsService - isBreakpoint checks current breakpoint
- Purpose: Validates breakpoint matching
- Scenario: Given current device info
- Expected Result: Returns true if breakpoint matches, false otherwise
*/
/*
Coverage Report:
- Functions tested: getBreakpoint, isBreakpoint
- Scenarios covered: all breakpoint ranges, breakpoint matching
- Uncovered scenarios: none
*/

describe('ResponsiveUtilsService', function() {
  'use strict';

  beforeEach(module('creditCardApp.responsive'));

  var ResponsiveUtilsService, DeviceDetectionService;

  beforeEach(inject(function(_ResponsiveUtilsService_, _DeviceDetectionService_) {
    ResponsiveUtilsService = _ResponsiveUtilsService_;
    DeviceDetectionService = _DeviceDetectionService_;
  }));

  describe('getBreakpoint', function() {
    it('should return xs for width < 576', function() {
      expect(ResponsiveUtilsService.getBreakpoint(400)).toBe('xs');
      expect(ResponsiveUtilsService.getBreakpoint(575)).toBe('xs');
    });

    it('should return sm for width between 576 and 768', function() {
      expect(ResponsiveUtilsService.getBreakpoint(576)).toBe('sm');
      expect(ResponsiveUtilsService.getBreakpoint(650)).toBe('sm');
      expect(ResponsiveUtilsService.getBreakpoint(767)).toBe('sm');
    });

    it('should return md for width between 768 and 992', function() {
      expect(ResponsiveUtilsService.getBreakpoint(768)).toBe('md');
      expect(ResponsiveUtilsService.getBreakpoint(850)).toBe('md');
      expect(ResponsiveUtilsService.getBreakpoint(991)).toBe('md');
    });

    it('should return lg for width between 992 and 1200', function() {
      expect(ResponsiveUtilsService.getBreakpoint(992)).toBe('lg');
      expect(ResponsiveUtilsService.getBreakpoint(1100)).toBe('lg');
      expect(ResponsiveUtilsService.getBreakpoint(1199)).toBe('lg');
    });

    it('should return xl for width >= 1200', function() {
      expect(ResponsiveUtilsService.getBreakpoint(1200)).toBe('xl');
      expect(ResponsiveUtilsService.getBreakpoint(1920)).toBe('xl');
      expect(ResponsiveUtilsService.getBreakpoint(3840)).toBe('xl');
    });
  });

  describe('isBreakpoint', function() {
    it('should return true when current breakpoint matches', function() {
      spyOn(DeviceDetectionService, 'detectDevice').and.returnValue({
        breakpoint: 'md'
      });

      expect(ResponsiveUtilsService.isBreakpoint('md')).toBe(true);
    });

    it('should return false when current breakpoint does not match', function() {
      spyOn(DeviceDetectionService, 'detectDevice').and.returnValue({
        breakpoint: 'md'
      });

      expect(ResponsiveUtilsService.isBreakpoint('lg')).toBe(false);
    });
  });
});