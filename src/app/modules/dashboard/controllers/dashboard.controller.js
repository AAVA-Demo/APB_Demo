(function() {
'use strict';
angular.module('dashboard.module')
.controller('DashboardController', ['$scope', '$interval', 'KPIAggregationService', 'AuthService', function($scope, $interval, KPIAggregationService, AuthService) {
var vm = this;
vm.kpis = null;
vm.loading = true;
vm.error = null;
vm.lastUpdated = null;
var refreshInterval;
function loadKPIs() {
vm.loading = true;
AuthService.validateSession().then(function() {
return KPIAggregationService.getKPIs('user123');
}).then(function(kpiData) {
vm.kpis = kpiData;
vm.lastUpdated = new Date();
vm.loading = false;
vm.error = null;
}).catch(function(error) {
vm.error = 'Failed to load dashboard data: ' + (error.message || error);
vm.loading = false;
});
}
vm.refresh = function() {
loadKPIs();
};
loadKPIs();
refreshInterval = $interval(function() {
loadKPIs();
}, 30000);
$scope.$on('$destroy', function() {
if (refreshInterval) {
$interval.cancel(refreshInterval);
}
});
}]);
})();