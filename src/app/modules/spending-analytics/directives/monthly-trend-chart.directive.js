(function() {
'use strict';
angular.module('spendingAnalytics.module')
.directive('monthlyTrendChart', [function() {
return {
restrict: 'E',
scope: {
monthlyData: '='
},
template: '<canvas id="monthlyTrendChart" width="400" height="150"></canvas>',
link: function(scope, element) {
scope.$watch('monthlyData', function(data) {
if (data && data.length > 0) {
var ctx = element.find('canvas')[0].getContext('2d');
var labels = data.map(function(d) { return d.month; });
var values = data.map(function(d) { return d.totalSpend; });
new Chart(ctx, {
type: 'line',
data: {
labels: labels,
datasets: [{
label: 'Monthly Spend',
data: values,
borderColor: 'rgb(75, 192, 192)',
backgroundColor: 'rgba(75, 192, 192, 0.2)',
tension: 0.1
}]
},
options: {
responsive: true,
maintainAspectRatio: true,
scales: {
y: {beginAtZero: true}
}
}
});
}
});
}
};
}]);
})();