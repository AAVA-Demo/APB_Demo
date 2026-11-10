(function() {
  'use strict';
  angular.module('creditCardApp.responsive')
    .directive('touchFriendly', ['DeviceDetectionService', function(DeviceDetectionService) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var deviceInfo = DeviceDetectionService.detectDevice();
          if (deviceInfo.isTouchDevice) {
            element.css({
              'min-width': '44px',
              'min-height': '44px',
              'padding': '12px',
              'cursor': 'pointer'
            });
            element.on('touchstart', function() {
              element.addClass('touch-active');
            });
            element.on('touchend', function() {
              element.removeClass('touch-active');
            });
          }
        }
      };
    }]);
})();