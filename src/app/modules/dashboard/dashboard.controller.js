(function(){
'use strict';
angular.module('app.dashboard').controller('DashboardController',['$scope','DashboardDataService',function($scope,DashboardDataService){
const vm=this;
vm.loading=true;
vm.error=null;
vm.kpis=null;
vm.retry=retry;
function init(){
vm.loading=true;
vm.error=null;
DashboardDataService.getKPIs().then(function(data){
vm.kpis=data;
$scope.kpis=data;
vm.loading=false;
}).catch(function(error){
vm.error=error.message||'Failed to load dashboard data';
vm.loading=false;
});
}
function retry(){
init();
}
init();
}]);
})();