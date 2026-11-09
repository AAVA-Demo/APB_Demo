(function(){
'use strict';
angular.module('app.dashboard').controller('DashboardController',DashboardController);
DashboardController.$inject=['KPIService','$scope','$interval'];
function DashboardController(KPIService,$scope,$interval){
var vm=this;
vm.kpis={};
vm.loading=true;
vm.error=null;
vm.refreshKPIs=refreshKPIs;
function init(){
refreshKPIs();
var refreshInterval=$interval(refreshKPIs,60000);
$scope.$on('$destroy',function(){
$interval.cancel(refreshInterval);
});
}
function refreshKPIs(){
vm.loading=true;
vm.error=null;
KPIService.getKPIs().then(function(data){
vm.kpis=data;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load KPI data. Please try again.';
vm.loading=false;
});
}
init();
}
})();