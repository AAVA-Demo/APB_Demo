(function(){
'use strict';
angular.module('dashboardModule').controller('DashboardController',['KpiAggregationService','$scope','$interval',function(KpiAggregationService,$scope,$interval){
var vm=this;
vm.kpiData={};
vm.loading=true;
vm.error=null;
function loadKpiData(){
vm.loading=true;
KpiAggregationService.getKpiData().then(function(data){
vm.kpiData=data;
vm.loading=false;
},function(error){
vm.error='Failed to load KPI data';
vm.loading=false;
});
}
loadKpiData();
var refreshInterval=$interval(loadKpiData,60000);
$scope.$on('$destroy',function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
});
}]);
})();