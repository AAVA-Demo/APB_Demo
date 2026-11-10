(function() {
  'use strict';
  angular.module('dashboard')
    .controller('dashboardController', ['$scope', '$interval', 'creditCardService', 'kpiService', 'authService', function($scope, $interval, creditCardService, kpiService, authService) {
      var vm = this;
      vm.kpis = {};
      vm.cards = [];
      vm.loading = true;
      vm.init = function() {
        if (!authService.validateSession()) {
          window.location.href = '/#/login';
          return;
        }
        vm.loadDashboard();
        $interval(vm.loadDashboard, 30000);
      };
      vm.loadDashboard = function() {
        creditCardService.getAllCards().then(function(cards) {
          vm.cards = cards;
          vm.kpis = kpiService.calculateKPIs(cards);
          vm.loading = false;
        }).catch(function(err) {
          console.error('Error loading dashboard:', err);
          vm.loading = false;
        });
      };
      vm.refreshData = function() {
        creditCardService.invalidateCache();
        vm.loading = true;
        vm.loadDashboard();
      };
      vm.init();
    }]);