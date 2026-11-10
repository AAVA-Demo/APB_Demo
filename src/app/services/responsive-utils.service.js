(function() {
  'use strict';
  angular.module('creditCardApp.responsive')
    .factory('ResponsiveUtilsService', ['DeviceDetectionService', function(DeviceDetectionService) {
      function getBreakpoint(width) {
        if (width < 576) return 'xs';
        if (width < 768) return 'sm';
        if (width < 992) return 'md';
        if (width < 1200) return 'lg';
        return 'xl';
      }
      function isBreakpoint(breakpoint) {
        var deviceInfo = DeviceDetectionService.detectDevice();
        return deviceInfo.breakpoint === breakpoint;
      }
      return {
        getBreakpoint: getBreakpoint,
        isBreakpoint: isBreakpoint
      };
    }]);
})();