angular.module('dashboardModule').controller('DashboardController',['$scope','$interval','kpiManagementService',function($scope,$interval,kpiManagementService){
var vm=this;
vm.kpiData={};
vm.loading=true;
vm.error=null;
function loadKPIs(){
vm.loading=true;
kpiManagementService.getKPIs().then(function(data){
vm.kpiData=data;
vm.loading=false;
},function(error){
vm.error='Failed to load KPI data';
vm.loading=false;
});
}
loadKPIs();
var refreshInterval=$interval(loadKPIs,300000);
$scope.$on('$destroy',function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
});
}]);