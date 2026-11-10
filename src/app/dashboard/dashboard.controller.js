(function(){
'use strict';
angular.module('dashboardModule').controller('DashboardController',['DashboardService','$scope','$interval',function(DashboardService,$scope,$interval){
var vm=this;
vm.kpis={};
vm.loading=true;
vm.error=null;
function loadKPIs(){
vm.loading=true;
DashboardService.getKPIs().then(function(kpis){
vm.kpis=kpis;
vm.loading=false;},function(error){
vm.error='Failed to load dashboard data. Please try again.';
vm.loading=false;});}
loadKPIs();
var refreshInterval=$interval(loadKPIs,30000);
$scope.$on('$destroy',function(){
if(refreshInterval){$interval.cancel(refreshInterval);}});
vm.refresh=function(){
loadKPIs();};
}]);
})();