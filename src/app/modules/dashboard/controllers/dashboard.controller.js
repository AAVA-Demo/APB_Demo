(function(){
'use strict';
angular.module('creditCard.dashboard').controller('DashboardController',['$scope','$interval','KPIService',function($scope,$interval,KPIService){
const vm=this;
vm.kpis={};
vm.loading=true;
vm.error=null;
vm.loadKPIs=function(){
vm.loading=true;
vm.error=null;
KPIService.getKPIs().then(function(data){
vm.kpis=data;
vm.loading=false;
},function(err){
vm.error='Failed to load KPI data. Please try again.';
vm.loading=false;
});
};
vm.loadKPIs();
const refreshInterval=$interval(function(){
vm.loadKPIs();
},30000);
$scope.$on('$destroy',function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
});
}]);
})();