(function(){
'use strict';
angular.module('app.dashboard').controller('DashboardController',['$scope','KPIService','RefreshService',function($scope,KPIService,RefreshService){
var vm=this;
vm.kpis={};
vm.cards=[];
vm.loading=true;
vm.error=null;
function init(){
loadKPIs();
RefreshService.startAutoRefresh(loadKPIs);
$scope.$on('$destroy',function(){
RefreshService.stopAutoRefresh();
});
}
function loadKPIs(){
vm.loading=true;
KPIService.getKPIs().then(function(data){
vm.kpis=data.kpis;
vm.cards=data.cards;
vm.loading=false;
},function(err){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
}
init();
}]);
})();