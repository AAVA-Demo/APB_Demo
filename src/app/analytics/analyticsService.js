(function(){
'use strict';
angular.module('creditCardApp').service('analyticsService',['$q','transactionDataFactory','categoryClassificationService','dataAggregationService',function($q,transactionDataFactory,categoryClassificationService,dataAggregationService){
const self=this;
self.getSpendingInsights=function(){
return transactionDataFactory.fetchTransactions().then(function(transactions){
const categorized=categoryClassificationService.classifyTransactions(transactions);
const categorySpending=dataAggregationService.aggregateByCategory(categorized);
const monthlyTrends=dataAggregationService.aggregateMonthlyTrends(categorized);
const currentMonth=new Date().getMonth();
const currentYear=new Date().getFullYear();
const currentMonthTransactions=categorized.filter(t=>{
const d=new Date(t.date);
return d.getMonth()===currentMonth&&d.getFullYear()===currentYear;
});
const currentMonthSpend=currentMonthTransactions.reduce((sum,t)=>sum+t.amount,0);
const topCategory=categorySpending.length>0?categorySpending.reduce((max,c)=>c.totalAmount>max.totalAmount?c:max):null;
return{
currentMonthSpend:currentMonthSpend,
categorySpending:categorySpending,
monthlyTrends:monthlyTrends,
topCategory:topCategory?topCategory.category:'N/A'
};
});
};
}]);
})();