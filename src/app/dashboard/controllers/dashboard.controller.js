(function(){
'use strict';
angular.module('creditCardDashboard').controller('DashboardController',DashboardController);
DashboardController.$inject=['CardManagementService','$scope','$interval'];
function DashboardController(CardManagementService,$scope,$interval){
var vm=this;
vm.cards=[];
vm.kpis={};
vm.loading=true;
vm.error=null;
vm.refreshData=refreshData;
activate();
function activate(){
loadPortfolio();
var refreshInterval=$interval(function(){
refreshData();
},30000);
$scope.$on('$destroy',function(){
$interval.cancel(refreshInterval);
});
}
function loadPortfolio(){
vm.loading=true;
CardManagementService.getCardPortfolio().then(function(data){
vm.cards=data.cards;
vm.kpis=data.kpis;
vm.loading=false;
},function(err){
vm.error='Failed to load card portfolio';
vm.loading=false;
});
}
function refreshData(){
CardManagementService.getCardPortfolio().then(function(data){
vm.cards=data.cards;
vm.kpis=data.kpis;
});
}
}
})();