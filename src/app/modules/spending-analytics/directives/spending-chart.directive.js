(function() {
'use strict';
angular.module('spendingAnalytics.module')
.directive('spendingChart', [function() {
return {
restrict: 'E',
scope: {
chartData: '='
},
template: '<canvas id="spendingChart" width="400" height="200"></canvas>',
link: function(scope, element) {
scope.$watch('chartData', function(newData) {
if (newData) {
var ctx = element.find('canvas')[0].getContext('2d');
new Chart(ctx, {
type: 'bar',
data: newData,
options: {
responsive: true,
maintainAspectRatio: true,
scales: {
yAxes: [{ticks: {beginAtZero: true}}]
}
}
});
}
});
}
};
}]);
})();