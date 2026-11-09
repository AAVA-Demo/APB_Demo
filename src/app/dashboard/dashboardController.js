(function(){
'use strict';
angular.module('dashboardModule').controller('dashboardController',['cardDataService','kpiService','refreshService','$scope',function(cardDataService,kpiService,refreshService,$scope){
var vm=this;
vm.kpis={};
vm.cards=[];
vm.loading=true;
vm.error=null;
function loadDashboard(){
cardDataService.getDashboardData().then(function(data){
vm.cards=data.cards||[];
vm.kpis=kpiService.calculateKPIs(vm.cards);
vm.loading=false;
},function(error){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
}
$scope.$on('dashboard:refresh',function(event,data){
vm.cards=data.cards||[];
vm.kpis=kpiService.calculateKPIs(vm.cards);
});
refreshService.startPolling();
$scope.$on('$destroy',function(){
refreshService.stopPolling();
});
loadDashboard();
}]);
})();