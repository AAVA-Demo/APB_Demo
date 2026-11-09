(function(){
'use strict';
angular.module('dashboardModule').controller('DashboardController',['DashboardService','AuthService','$scope','$interval',function(DashboardService,AuthService,$scope,$interval){
const vm=this;
vm.kpiData={};
vm.loading=true;
vm.error=null;
function loadKPIs(){
if(!AuthService.validateSession()){
vm.error='Session invalid. Please login.';
vm.loading=false;
return;
}
const userId=AuthService.getUserId();
DashboardService.loadKPIs(userId).then(function(data){
vm.kpiData=data;
vm.loading=false;
},function(err){
vm.error='Failed to load KPI data.';
vm.loading=false;
});
}
loadKPIs();
const refreshInterval=$interval(loadKPIs,60000);
$scope.$on('$destroy',function(){
$interval.cancel(refreshInterval);
});
}]);
})();