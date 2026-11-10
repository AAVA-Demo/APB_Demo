(function(){
'use strict';
angular.module('dashboardModule').controller('DashboardController',['DashboardService','AuthService','$scope','$interval','NotificationService',function(DashboardService,AuthService,$scope,$interval,NotificationService){
var vm=this;
vm.kpis=null;
vm.loading=true;
vm.refreshInterval=null;
var userContext=AuthService.getUserContext();
function loadDashboard(){
vm.loading=true;
DashboardService.loadDashboard(userContext.userId).then(function(kpis){
vm.kpis=kpis;
$scope.$apply();
vm.loading=false;
},function(error){
NotificationService.error('Failed to load dashboard data');
vm.loading=false;
});
}
vm.refresh=function(){
DashboardService.refreshDashboard(userContext.userId).then(function(kpis){
vm.kpis=kpis;
$scope.$apply();
NotificationService.success('Dashboard refreshed successfully');
},function(error){
NotificationService.error('Failed to refresh dashboard');
});
};
loadDashboard();
vm.refreshInterval=$interval(function(){
DashboardService.refreshDashboard(userContext.userId).then(function(kpis){
vm.kpis=kpis;
});
},60000);
$scope.$on('$destroy',function(){
if(vm.refreshInterval){
$interval.cancel(vm.refreshInterval);
}
});
}]);
})();