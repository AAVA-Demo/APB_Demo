(function() {
  'use strict';
  angular.module('creditCardApp.responsive')
    .factory('DeviceDetectionService', ['$window', '$rootScope', function($window, $rootScope) {
      var debounceTimer;
      function detectDevice() {
        var width = $window.innerWidth;
        var height = $window.innerHeight;
        var isTouchDevice = 'ontouchstart' in $window || navigator.maxTouchPoints > 0;
        var type = 'desktop';
        if (width < 768) {
          type = 'mobile';
        } else if (width < 1024) {
          type = 'tablet';
        }
        var orientation = width > height ? 'landscape' : 'portrait';
        var breakpoint = 'xl';
        if (width < 576) breakpoint = 'xs';
        else if (width < 768) breakpoint = 'sm';
        else if (width < 992) breakpoint = 'md';
        else if (width < 1200) breakpoint = 'lg';
        return {
          type: type,
          screenWidth: width,
          screenHeight: height,
          orientation: orientation,
          breakpoint: breakpoint,
          isTouchDevice: isTouchDevice
        };
      }
      angular.element($window).on('resize', function() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          var deviceInfo = detectDevice();
          $rootScope.$broadcast('deviceInfoUpdated', deviceInfo);
        }, 250);
      });
      return {
        detectDevice: detectDevice
      };
    }]);
})();