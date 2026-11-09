(function(){
'use strict';
angular.module('creditCardApp').controller('DashboardController',['$scope','KPIService','DataRefreshService','AuthService',function($scope,KPIService,DataRefreshService,AuthService){
var vm=this;
vm.kpis=null;
vm.loading=true;
vm.init=function(){
if(!AuthService.validateSession()){
return;
}
KPIService.getKPIs().then(function(kpiData){
vm.kpis=kpiData;
vm.loading=false;
$scope.$apply();
});
DataRefreshService.startPolling(function(kpiData){
vm.kpis=kpiData;
$scope.$apply();
});
};
$scope.$on('$destroy',function(){
DataRefreshService.stopPolling();
});
vm.init();
}]);