(function() {
'use strict';
angular.module('spendingAnalytics.module')
.directive('categoryBreakdownChart', [function() {
return {
restrict: 'E',
scope: {
categoryData: '='
},
template: '<canvas id="categoryBreakdownChart" width="400" height="200"></canvas>',
link: function(scope, element) {
scope.$watch('categoryData', function(data) {
if (data && data.length > 0) {
var ctx = element.find('canvas')[0].getContext('2d');
var labels = data.map(function(d) { return d.category; });
var values = data.map(function(d) { return d.amount; });
var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
new Chart(ctx, {
type: 'doughnut',
data: {
labels: labels,
datasets: [{
data: values,
backgroundColor: colors
}]
},
options: {
responsive: true,
maintainAspectRatio: true,
legend: {
position: 'bottom'
}
}
});
}
});
}
};
}]);
})();