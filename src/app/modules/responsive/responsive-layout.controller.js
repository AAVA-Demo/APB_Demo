(function() {
  'use strict';
  angular.module('creditCardApp.responsive')
    .controller('ResponsiveLayoutController', ['$scope', '$window', 'DeviceDetectionService', 'ResponsiveUtilsService', function($scope, $window, DeviceDetectionService, ResponsiveUtilsService) {
      var vm = this;
      vm.deviceInfo = {};
      vm.layoutConfig = {};
      function init() {
        vm.deviceInfo = DeviceDetectionService.detectDevice();
        vm.layoutConfig = calculateLayoutConfig(vm.deviceInfo);
        $scope.$on('deviceInfoUpdated', function(event, deviceInfo) {
          vm.deviceInfo = deviceInfo;
          vm.layoutConfig = calculateLayoutConfig(deviceInfo);
          $scope.$apply();
        });
      }
      function calculateLayoutConfig(deviceInfo) {
        var breakpoint = ResponsiveUtilsService.getBreakpoint(deviceInfo.screenWidth);
        var config = {
          containerWidth: '100%',
          columnCount: 12,
          fontSize: '16px',
          spacing: '15px'
        };
        if (breakpoint === 'xs') {
          config.columnCount = 1;
          config.fontSize = '14px';
          config.spacing = '10px';
        } else if (breakpoint === 'sm') {
          config.columnCount = 2;
          config.fontSize = '15px';
          config.spacing = '12px';
        } else if (breakpoint === 'md') {
          config.columnCount = 3;
        } else if (breakpoint === 'lg') {
          config.columnCount = 4;
        } else if (breakpoint === 'xl') {
          config.columnCount = 4;
          config.fontSize = '18px';
          config.spacing = '20px';
        }
        return config;
      }
      init();
    }]);
})();