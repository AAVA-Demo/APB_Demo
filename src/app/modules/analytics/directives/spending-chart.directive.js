(function() {
'use strict';
angular.module('app.analytics')
.directive('spendingChart', ['ChartConfigFactory', function(ChartConfigFactory) {
return {
restrict: 'E',
scope: {
chartType: '=',
chartData: '=',
chartLabels: '=',
chartSeries: '='
},
template: '<canvas id="chart-{{$id}}" class="chart chart-{{chartType}}" chart-data="chartData" chart-labels="chartLabels" chart-series="chartSeries" chart-options="chartOptions"></canvas>',
link: function(scope, element, attrs) {
scope.chartOptions = ChartConfigFactory.getChartConfig(scope.chartType);
}
};
}]);
})();