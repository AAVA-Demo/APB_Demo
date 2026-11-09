(function(){
'use strict';
angular.module('creditCardApp.kpiDashboard').controller('KPIDashboardController',['KPICalculationService','RealtimeRefreshFactory','AuthService','$scope','$timeout',function(KPICalculationService,RealtimeRefreshFactory,AuthService,$scope,$timeout){
var vm=this;
vm.kpis={};
vm.loading=true;
vm.init=init;
function init(){
var userId=AuthService.getUserId();
loadKPIs(userId);
RealtimeRefreshFactory.startPolling(function(){
loadKPIs(userId);
},60000);
$scope.$on('$destroy',function(){
RealtimeRefreshFactory.stopPolling();
});
}
function loadKPIs(userId){
vm.loading=true;
KPICalculationService.calculateKPIs(userId).then(function(kpis){
vm.kpis=kpis;
vm.loading=false;
},function(error){
toastr.error('Failed to load KPIs');
vm.loading=false;
});
}
vm.init();
}]);
})();