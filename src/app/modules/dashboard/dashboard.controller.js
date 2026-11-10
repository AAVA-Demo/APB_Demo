(function(){
'use strict';
angular.module('dashboardModule').controller('DashboardController',['KPIService','AuthService','$scope','$interval','kpiData',function(KPIService,AuthService,$scope,$interval,kpiData){
const vm=this;
vm.kpis=kpiData;
vm.loading=false;
vm.error=null;
const refreshInterval=$interval(function(){
KPIService.refreshKPIs().then(function(updatedKpis){
vm.kpis=updatedKpis;
}).catch(function(err){
vm.error='Failed to refresh KPIs';
});
},300000);
$scope.$on('$destroy',function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
});
vm.formatCurrency=function(amount){
return '₹'+amount.toLocaleString('en-IN');
};
vm.getCreditUtilization=function(){
if(vm.kpis.totalCreditLimit===0)return 0;
return Math.round((vm.kpis.outstandingAmount/vm.kpis.totalCreditLimit)*100);
};
}]);
})();