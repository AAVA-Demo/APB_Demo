(function(){
'use strict';
angular.module('spendTrendsModule').controller('TrendAnalysisController',['$scope','TransactionHistoryService','CardManagementService','TimeSeriesAggregator','CardwiseAnalyzer',function($scope,TransactionHistoryService,CardManagementService,TimeSeriesAggregator,CardwiseAnalyzer){
var vm=this;
vm.monthlyTrends=[];
vm.cardSpendSummary=[];
vm.cards=[];
vm.selectedCard=null;
vm.loading=true;
function loadTrends(){
vm.loading=true;
var transactionsPromise=TransactionHistoryService.getTransactionHistory(12);
var cardsPromise=CardManagementService.getCardDetails();
Promise.all([transactionsPromise,cardsPromise]).then(function(results){
var transactions=results[0];
var cards=results[1];
vm.cards=cards;
vm.monthlyTrends=TimeSeriesAggregator.aggregateByMonth(transactions);
vm.cardSpendSummary=CardwiseAnalyzer.analyzeByCard(transactions,cards);
vm.loading=false;
$scope.$apply();
}).catch(function(error){
vm.loading=false;
console.error('Failed to load trends:',error);
$scope.$apply();
});
}
vm.filterByCard=function(cardId){
vm.selectedCard=cardId;
};
loadTrends();
}]);
})();