(function(){
'use strict';
angular.module('trendAnalysisModule').controller('TrendAnalysisController',['TransactionHistoryService','CardManagementService','DataAggregationService','TrendDataFactory','AuthService','$scope',function(TransactionHistoryService,CardManagementService,DataAggregationService,TrendDataFactory,AuthService,$scope){
var vm=this;
vm.trendData={months:[],monthlySpends:[],selectedCards:[],cardDetails:[],chartData:{}};
vm.momComparison=null;
vm.loading=true;
vm.error=null;
vm.allMonthlySpends=[];
vm.onCardSelectionChange=function(){
var filtered=DataAggregationService.filterByCards(vm.allMonthlySpends,vm.trendData.selectedCards);
vm.trendData.monthlySpends=filtered;
vm.momComparison=TrendDataFactory.computeMoMComparison(filtered);
vm.updateChartData();
};
vm.updateChartData=function(){
var labels=[];
var data=[];
angular.forEach(vm.trendData.monthlySpends,function(ms){
labels.push(ms.month);
data.push(ms.totalSpend);
});
vm.trendData.chartData={labels:labels,datasets:[{label:'Monthly Spend',data:data,borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]};
};
vm.init=function(){
vm.loading=true;
var userId=AuthService.getUserId();
var transactionsPromise=TransactionHistoryService.fetchHistoricalTransactions(userId,12);
var cardsPromise=CardManagementService.fetchUserCards(userId);
Promise.all([transactionsPromise,cardsPromise]).then(function(results){
var transactions=results[0];
var cards=results[1];
vm.trendData.cardDetails=cards;
vm.allMonthlySpends=DataAggregationService.computeMonthlyRollups(transactions,cards);
vm.trendData.monthlySpends=vm.allMonthlySpends;
vm.momComparison=TrendDataFactory.computeMoMComparison(vm.allMonthlySpends);
vm.updateChartData();
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load trend analysis data';
vm.loading=false;
});
};
vm.init();
}]);
})();