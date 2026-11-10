(function(){
'use strict';
angular.module('app.dashboard')
.controller('DashboardController',['$scope','$interval','KpiAggregationService','AuthService',function($scope,$interval,KpiAggregationService,AuthService){
var vm=this;
vm.kpiData=null;
vm.loading=true;
vm.error=null;
vm.lastUpdated=null;
function init(){
if(!AuthService.isAuthenticated()){
vm.error='Authentication required';
vm.loading=false;
return;
}
loadKpis();
var refreshInterval=$interval(function(){
loadKpis();
},30000);
$scope.$on('$destroy',function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
});
}
function loadKpis(){
vm.loading=true;
vm.error=null;
KpiAggregationService.fetchKpis()
.then(function(data){
vm.kpiData=data;
vm.lastUpdated=new Date();
vm.loading=false;
})
.catch(function(err){
vm.error='Failed to load KPI data';
vm.loading=false;
});
}
vm.refresh=function(){
loadKpis();
};
vm.getCreditUtilization=function(){
if(!vm.kpiData||vm.kpiData.totalCreditLimit===0)return 0;
return((vm.kpiData.outstandingAmount/vm.kpiData.totalCreditLimit)*100).toFixed(2);
};
init();
}]);
})();