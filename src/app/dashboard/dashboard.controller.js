(function(){
'use strict';
angular.module('creditCardApp')
.controller('DashboardController',['DashboardAggregationService','$scope','$interval',function(DashboardAggregationService,$scope,$interval){
var vm=this;
vm.kpis={};
vm.loading=true;
vm.error=null;
function loadDashboard(){
vm.loading=true;
DashboardAggregationService.loadDashboard().then(function(kpis){
vm.kpis=kpis;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
}
loadDashboard();
var refreshInterval=$interval(loadDashboard,120000);
$scope.$on('$destroy',function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
});
}]);
})();