(function() {
'use strict';
angular.module('app.dashboard')
.controller('DashboardController', ['KPIService', '$scope', '$interval', function(KPIService, $scope, $interval) {
var vm = this;
vm.kpiData = null;
vm.loading = true;
vm.error = null;
function loadKPIs() {
vm.loading = true;
KPIService.getKPIs().then(function(data) {
vm.kpiData = data;
vm.loading = false;
}).catch(function(err) {
vm.error = 'Failed to load dashboard data';
vm.loading = false;
console.error('KPI Load Error:', err);
});
}
loadKPIs();
var refreshInterval = $interval(loadKPIs, 30000);
$scope.$on('$destroy', function() {
if (refreshInterval) {
$interval.cancel(refreshInterval);
}
});
}]);
})();