(function() {
'use strict';
angular.module('app.analytics')
.controller('AnalyticsController', ['TransactionAnalyticsService', '$scope', '$filter', function(TransactionAnalyticsService, $scope, $filter) {
var vm = this;
vm.analyticsData = null;
vm.loading = true;
vm.error = null;
vm.categoryChartData = [];
vm.categoryChartLabels = [];
vm.trendChartData = [];
vm.trendChartLabels = [];
vm.trendChartSeries = ['Total Spend'];
function loadAnalytics() {
vm.loading = true;
TransactionAnalyticsService.getSpendingInsights().then(function(data) {
vm.analyticsData = data;
prepareCategoryChart(data.currentMonthSpending);
prepareTrendChart(data.monthlyTrends);
vm.loading = false;
}).catch(function(err) {
vm.error = 'Failed to load analytics data';
vm.loading = false;
console.error('Analytics Load Error:', err);
});
}
function prepareCategoryChart(categorySpending) {
vm.categoryChartLabels = [];
vm.categoryChartData = [];
if (categorySpending && categorySpending.length > 0) {
categorySpending.forEach(function(cat) {
vm.categoryChartLabels.push(cat.category);
vm.categoryChartData.push(cat.amount);
});
}
}
function prepareTrendChart(monthlyTrends) {
vm.trendChartLabels = [];
vm.trendChartData = [[]];
if (monthlyTrends && monthlyTrends.length > 0) {
monthlyTrends.forEach(function(trend) {
vm.trendChartLabels.push(trend.month);
vm.trendChartData[0].push(trend.totalSpend);
});
}
}
loadAnalytics();
}]);
})();