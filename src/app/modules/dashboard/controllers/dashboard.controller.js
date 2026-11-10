(function(){
'use strict';
angular.module('app.dashboard').controller('DashboardController',['$scope','CreditCardService','DataRefreshFactory','$interval',function($scope,CreditCardService,DataRefreshFactory,$interval){
var vm=this;
vm.kpis={};
vm.cards=[];
vm.loading=true;
vm.error=null;
var refreshPromise=null;
var userId='user123';
function loadDashboardData(){
CreditCardService.getDashboardKPIs(userId).then(function(data){
vm.kpis={
monthlySpend:data.monthlySpend,
totalCreditLimit:data.totalCreditLimit,
availableCredit:data.availableCredit,
outstandingAmount:data.outstandingAmount
};
vm.cards=data.cards;
vm.loading=false;
},function(error){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
}
vm.init=function(){
loadDashboardData();
refreshPromise=DataRefreshFactory.startRefresh(loadDashboardData,30000);
};
$scope.$on('$destroy',function(){
DataRefreshFactory.stopRefresh(refreshPromise);
});
vm.init();
}]);
})();