(function(){
'use strict';
angular.module('analyticsModule').controller('analyticsController',['transactionService','chartService','$scope',function(transactionService,chartService,$scope){
var vm=this;
vm.transactions=[];
vm.analyticsData={};
vm.loading=true;
vm.error=null;
vm.selectedCard=null;
vm.dateFrom=null;
vm.dateTo=null;
vm.applyFilter=function(){
var filtered=vm.transactions;
if(vm.selectedCard){
filtered=filtered.filter(function(t){return t.cardId===vm.selectedCard;});
}
if(vm.dateFrom){
filtered=filtered.filter(function(t){return new Date(t.transactionDate)>=new Date(vm.dateFrom);});
}
if(vm.dateTo){
filtered=filtered.filter(function(t){return new Date(t.transactionDate)<=new Date(vm.dateTo);});
}
vm.analyticsData=chartService.processData(filtered);
$scope.$broadcast('analytics:dataUpdated',vm.analyticsData);
};
function init(){
transactionService.getTransactions().then(function(transactions){
vm.transactions=transactions;
vm.analyticsData=chartService.processData(transactions);
vm.loading=false;
$scope.$broadcast('analytics:dataUpdated',vm.analyticsData);
},function(error){
vm.error='Failed to load analytics data';
vm.loading=false;
});
}
init();
}]);
})();