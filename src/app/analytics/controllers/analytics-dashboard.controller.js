(function() {
  'use strict';
  angular.module('analyticsModule')
    .controller('AnalyticsDashboardController', ['$scope', 'AnalyticsService', 'AnalyticsDataFactory', 'CategoryService', 'NotificationService', AnalyticsDashboardController]);

  function AnalyticsDashboardController($scope, AnalyticsService, AnalyticsDataFactory, CategoryService, NotificationService) {
    var vm = this;
    vm.currentView = 'monthly';
    vm.chartData = null;
    vm.chartType = 'line';
    vm.loading = true;
    vm.error = null;
    vm.categories = CategoryService.getCategories();

    vm.init = function() {
      vm.loadMonthlyTrends();
    };

    vm.switchView = function(view) {
      vm.currentView = view;
      vm.loading = true;
      
      switch(view) {
        case 'monthly':
          vm.loadMonthlyTrends();
          break;
        case 'card':
          vm.loadCardWiseSpending();
          break;
        case 'category':
          vm.loadCategorySpending();
          break;
      }
    };

    vm.loadMonthlyTrends = function() {
      vm.chartType = 'line';
      AnalyticsService.getMonthlyTrends()
        .then(function(data) {
          vm.chartData = AnalyticsDataFactory.formatMonthlyTrends(data);
          vm.loading = false;
          vm.error = null;
        })
        .catch(function(error) {
          vm.loading = false;
          vm.error = 'Failed to load monthly trends.';
          NotificationService.error('Failed to load analytics data');
        });
    };

    vm.loadCardWiseSpending = function() {
      vm.chartType = 'bar';
      AnalyticsService.getCardWiseSpending()
        .then(function(data) {
          vm.chartData = AnalyticsDataFactory.formatCardWiseSpending(data);
          vm.loading = false;
          vm.error = null;
        })
        .catch(function(error) {
          vm.loading = false;
          vm.error = 'Failed to load card-wise spending.';
          NotificationService.error('Failed to load analytics data');
        });
    };

    vm.loadCategorySpending = function() {
      vm.chartType = 'pie';
      AnalyticsService.getCategorySpending()
        .then(function(data) {
          vm.chartData = AnalyticsDataFactory.formatCategorySpending(data);
          vm.loading = false;
          vm.error = null;
        })
        .catch(function(error) {
          vm.loading = false;
          vm.error = 'Failed to load category spending.';
          NotificationService.error('Failed to load analytics data');
        });
    };

    vm.init();
  }
})();