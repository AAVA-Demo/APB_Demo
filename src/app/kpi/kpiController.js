angular.module('kpiModule').controller('KPIController',['$scope','$interval','kpiService',function($scope,$interval,kpiService){
var vm=this;
vm.kpiData={};
vm.loading=true;
vm.error=null;
function loadKPIs(){
vm.loading=true;
kpiService.getKPIs().then(function(data){
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