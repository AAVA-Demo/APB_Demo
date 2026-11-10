(function(){
'use strict';
angular.module('dashboardModule').controller('DashboardController',['$scope','KPIService','CardService','RefreshService','AuthService',function($scope,KPIService,CardService,RefreshService,AuthService){
var vm=this;
vm.kpis={};
vm.cards=[];
vm.loading=true;
vm.error=null;
function init(){
var userId=AuthService.getUserId();
if(!userId){
vm.error='User not authenticated';
vm.loading=false;
return;
}
KPIService.getKPIs(userId).then(function(kpiData){
vm.kpis=kpiData;
return CardService.getCards(userId);
}).then(function(cardData){
vm.cards=cardData;
vm.loading=false;
RefreshService.startPolling(function(updatedKpis){
vm.kpis=updatedKpis;
$scope.$apply();
});
}).catch(function(error){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
}
$scope.$on('$destroy',function(){
RefreshService.stopPolling();
});
init();
}]);
})();