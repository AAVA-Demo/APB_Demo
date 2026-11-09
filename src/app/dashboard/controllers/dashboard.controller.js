(function(){
'use strict';
angular.module('creditCard.dashboard').controller('DashboardController',['$scope','$interval','KPIService','API_CONFIG',function($scope,$interval,KPIService,API_CONFIG){
const vm=this;
vm.kpiData=null;
vm.loading=false;
vm.error=null;
vm.userId='user123';
vm.loadDashboard=function(){
vm.loading=true;
vm.error=null;
KPIService.getKPIDashboard(vm.userId).then(function(data){
vm.kpiData=data;
vm.loading=false;
},function(error){
vm.error='Failed to load dashboard data. Please try again.';
vm.loading=false;
});
};
vm.refresh=function(){
vm.loadDashboard();
};
vm.loadDashboard();
const refreshInterval=$interval(function(){
vm.loadDashboard();
},API_CONFIG.REFRESH_INTERVAL);
$scope.$on('$destroy',function(){
if(refreshInterval)$interval.cancel(refreshInterval);
});
}]);
})();