(function() {
'use strict';
angular.module('app.analytics')
.factory('ChartConfigFactory', [function() {
return {
getChartConfig: function(chartType) {
var baseConfig = {
responsive: true,
maintainAspectRatio: true,
legend: {
display: true
}
};
if (chartType === 'pie') {
baseConfig.tooltips = {
callbacks: {
label: function(tooltipItem, data) {
var label = data.labels[tooltipItem.index] || '';
var value = data.datasets[0].data[tooltipItem.index] || 0;
return label + ': $' + value.toFixed(2);
}
}
};
} else if (chartType === 'line' || chartType === 'bar') {
baseConfig.scales = {
yAxes: [{
ticks: {
beginAtZero: true,
callback: function(value) {
return '$' + value;
}
}
}]
};
}
return baseConfig;
}
};
}]);
})();