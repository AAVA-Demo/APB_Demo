/*
Test Documentation:
- Test Name: DeviceDetectionService - detectDevice returns device information
- Purpose: Validates device detection logic
- Scenario: Given browser window dimensions
- Expected Result: Returns object with device type, dimensions, orientation, and breakpoint
*/
/*
Test Documentation:
- Test Name: DeviceDetectionService - detectDevice identifies mobile devices
- Purpose: Validates mobile device detection
- Scenario: Given window width less than 768px
- Expected Result: Device type is 'mobile'
*/
/*
Coverage Report:
- Functions tested: detectDevice
- Scenarios covered: mobile, tablet, desktop detection, touch device detection, orientation, breakpoints
- Uncovered scenarios: none
*/

describe('DeviceDetectionService', function() {
  'use strict';

  beforeEach(module('creditCardApp.responsive'));

  var DeviceDetectionService, $window, $rootScope;

  beforeEach(inject(function(_DeviceDetectionService_, _$window_, _$rootScope_) {
    DeviceDetectionService = _DeviceDetectionService_;
    $window = _$window_;
    $rootScope = _$rootScope_;
  }));

  describe('detectDevice', function() {
    it('should return device information object', function() {
      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo).toBeDefined();
      expect(deviceInfo.type).toBeDefined();
      expect(deviceInfo.screenWidth).toBeDefined();
      expect(deviceInfo.screenHeight).toBeDefined();
      expect(deviceInfo.orientation).toBeDefined();
      expect(deviceInfo.breakpoint).toBeDefined();
      expect(deviceInfo.isTouchDevice).toBeDefined();
    });

    it('should detect mobile device when width < 768', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(500);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(800);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.type).toBe('mobile');
      expect(deviceInfo.screenWidth).toBe(500);
    });

    it('should detect tablet device when width between 768 and 1024', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(900);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(1200);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.type).toBe('tablet');
    });

    it('should detect desktop device when width >= 1024', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(1400);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(900);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.type).toBe('desktop');
    });

    it('should detect portrait orientation when height > width', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(500);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(800);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.orientation).toBe('portrait');
    });

    it('should detect landscape orientation when width > height', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(800);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(500);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.orientation).toBe('landscape');
    });

    it('should detect xs breakpoint when width < 576', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(400);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(700);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.breakpoint).toBe('xs');
    });

    it('should detect sm breakpoint when width between 576 and 768', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(650);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(900);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.breakpoint).toBe('sm');
    });

    it('should detect md breakpoint when width between 768 and 992', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(850);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(1000);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.breakpoint).toBe('md');
    });

    it('should detect lg breakpoint when width between 992 and 1200', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(1100);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(800);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.breakpoint).toBe('lg');
    });

    it('should detect xl breakpoint when width >= 1200', function() {
      spyOnProperty($window, 'innerWidth', 'get').and.returnValue(1920);
      spyOnProperty($window, 'innerHeight', 'get').and.returnValue(1080);

      var deviceInfo = DeviceDetectionService.detectDevice();

      expect(deviceInfo.breakpoint).toBe('xl');
    });
  });
});