(function(){
'use strict';
angular.module('creditCardApp').controller('dashboardController',['$scope','$interval','kpiAggregationService',function($scope,$interval,kpiAggregationService){
const vm=this;
vm.loading=true;
vm.error=null;
vm.dashboardData=null;
vm.init=function(){
kpiAggregationService.getKPIs().then(function(data){
vm.dashboardData=data;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
};
vm.refresh=function(){
kpiAggregationService.getKPIs().then(function(data){
vm.dashboardData=data;
}).catch(function(err){
console.error('Refresh failed',err);
});
};
vm.init();
const refreshInterval=$interval(vm.refresh,30000);
$scope.$on('$destroy',function(){
$interval.cancel(refreshInterval);
});
}]);
})();