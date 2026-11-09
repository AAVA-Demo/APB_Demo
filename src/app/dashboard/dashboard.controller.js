(function(){
'use strict';
angular.module('app.dashboard').controller('DashboardController',['$scope','$q','CreditCardService','TransactionService','DataRefreshFactory',function($scope,$q,CreditCardService,TransactionService,DataRefreshFactory){
const vm=this;
vm.loading=true;
vm.error=null;
vm.dashboardData={totalCreditLimit:0,totalAvailableCredit:0,totalOutstanding:0,totalMonthlySpend:0,cards:[]};
vm.loadDashboardData=function(){
vm.loading=true;
vm.error=null;
$q.all([CreditCardService.getCards(),TransactionService.getMonthlyData()]).then(function(results){
const cards=results[0]||CreditCardService.getMockCards();
const monthlyData=results[1]||{monthlySpend:12700};
vm.dashboardData.cards=cards;
vm.dashboardData.totalCreditLimit=cards.reduce(function(sum,card){return sum+card.creditLimit;},0);
vm.dashboardData.totalAvailableCredit=cards.reduce(function(sum,card){return sum+card.availableCredit;},0);
vm.dashboardData.totalOutstanding=cards.reduce(function(sum,card){return sum+card.outstandingAmount;},0);
vm.dashboardData.totalMonthlySpend=monthlyData.monthlySpend||cards.reduce(function(sum,card){return sum+card.monthlySpend;},0);
vm.loading=false;
},function(error){
vm.error='Failed to load dashboard data. Please try again.';
vm.loading=false;
const cards=CreditCardService.getMockCards();
vm.dashboardData.cards=cards;
vm.dashboardData.totalCreditLimit=cards.reduce(function(sum,card){return sum+card.creditLimit;},0);
vm.dashboardData.totalAvailableCredit=cards.reduce(function(sum,card){return sum+card.availableCredit;},0);
vm.dashboardData.totalOutstanding=cards.reduce(function(sum,card){return sum+card.outstandingAmount;},0);
vm.dashboardData.totalMonthlySpend=cards.reduce(function(sum,card){return sum+card.monthlySpend;},0);
});
};
vm.loadDashboardData();
DataRefreshFactory.startRefresh(vm.loadDashboardData,10000);
$scope.$on('$destroy',function(){
DataRefreshFactory.stopRefresh();
});
}]);
})();