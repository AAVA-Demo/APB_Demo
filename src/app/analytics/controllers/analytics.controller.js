(function() {
  'use strict';
  angular.module('analyticsModule')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', 'ChartConfigFactory', function($scope, AnalyticsService, ChartConfigFactory) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.categoryData = [];
      vm.monthlyData = [];
      vm.selectedCategory = null;
      vm.dateRange = {
        from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        to: new Date()
      };
      vm.categoryChartLabels = [];
      vm.categoryChartData = [];
      vm.categoryChartColors = [];
      vm.categoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'right' },
        onClick: function(event, elements) {
          if (elements.length > 0) {
            var index = elements[0]._index;
            vm.onCategoryClick(vm.categoryData[index]);
            $scope.$apply();
          }
        }
      };
      vm.monthlyChartLabels = [];
      vm.monthlyChartData = [[]];
      vm.monthlyChartSeries = ['Monthly Spend'];
      vm.monthlyChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true }
          }]
        }
      };
      function loadAnalytics() {
        vm.loading = true;
        var dateRangeParam = {
          from: vm.dateRange.from.toISOString().split('T')[0],
          to: vm.dateRange.to.toISOString().split('T')[0]
        };
        AnalyticsService.getSpendingAnalytics(dateRangeParam).then(function(data) {
          vm.categoryData = data.categoryBreakdown || [];
          vm.monthlyData = data.monthlyTrends || [];
          prepareCategoryChart();
          prepareMonthlyChart();
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
        });
      }
      function prepareCategoryChart() {
        vm.categoryChartLabels = [];
        vm.categoryChartData = [];
        vm.categoryChartColors = [];
        vm.categoryData.forEach(function(item) {
          vm.categoryChartLabels.push(item.category);
          vm.categoryChartData.push(item.totalAmount);
          vm.categoryChartColors.push(getCategoryColor(item.category));
        });
      }
      function prepareMonthlyChart() {
        vm.monthlyChartLabels = [];
        vm.monthlyChartData = [[]];
        vm.monthlyData.forEach(function(item) {
          vm.monthlyChartLabels.push(item.month);
          vm.monthlyChartData[0].push(item.totalSpend);
        });
      }
      function getCategoryColor(category) {
        var colorMap = {
          'Food & Dining': '#FF6384',
          'Fuel': '#36A2EB',
          'Shopping': '#FFCE56',
          'Travel': '#4BC0C0',
          'Entertainment': '#9966FF',
          'Utilities': '#FF9F40',
          'Healthcare': '#FF6384',
          'Education': '#C9CBCF',
          'Miscellaneous': '#4D5360'
        };
        return colorMap[category] || '#CCCCCC';
      }
      vm.onCategoryClick = function(categoryItem) {
        vm.selectedCategory = categoryItem;
      };
      vm.closeCategoryDetail = function() {
        vm.selectedCategory = null;
      };
      vm.refreshAnalytics = function() {
        loadAnalytics();
      };
      loadAnalytics();
    }]);
})();