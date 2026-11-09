(function(){
'use strict';
angular.module('dashboard').controller('dashboardController',['$scope','$interval','dashboardOrchestrationService',function($scope,$interval,dashboardOrchestrationService){
var vm=this;
vm.kpis=null;
vm.loading=true;
vm.error=null;
vm.refreshDashboard=refreshDashboard;
function init(){
loadDashboard();
var refreshInterval=$interval(function(){
loadDashboard();
},300000);
$scope.$on('$destroy',function(){
$interval.cancel(refreshInterval);
});
}
function loadDashboard(){
vm.loading=true;
vm.error=null;
dashboardOrchestrationService.loadDashboard().then(function(data){
vm.kpis=data;
vm.loading=false;
},function(error){
vm.error='Failed to load dashboard. Please try again.';
vm.loading=false;
});
}
function refreshDashboard(){
loadDashboard();
}
init();
}]);
})();