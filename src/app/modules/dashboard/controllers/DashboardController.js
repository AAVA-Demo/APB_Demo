(function(){
'use strict';
angular.module('creditCardDashboard').controller('DashboardController',['$scope','KpiAggregationService','DataRefreshService',function($scope,KpiAggregationService,DataRefreshService){
var vm=this;
vm.kpis={};
vm.cards=[];
vm.loading=true;
vm.lastUpdated=null;
function loadDashboard(){
vm.loading=true;
KpiAggregationService.fetchKPIs().then(function(data){
vm.kpis=data.kpis;
vm.cards=data.cards;
vm.lastUpdated=new Date();
vm.loading=false;
},function(error){
vm.loading=false;
console.error('Failed to load dashboard:',error);
});
}
loadDashboard();
DataRefreshService.startAutoRefresh(function(){
KpiAggregationService.fetchKPIs().then(function(data){
vm.kpis=data.kpis;
vm.cards=data.cards;
vm.lastUpdated=new Date();
$scope.$apply();
});
});
$scope.$on('$destroy',function(){
DataRefreshService.stopAutoRefresh();
});
}]);
})();