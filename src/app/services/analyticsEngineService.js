(function(){
'use strict';
angular.module('creditCardApp').service('analyticsEngineService',['categoryClassificationService',function(categoryClassificationService){
this.processTransactions=function(transactions){
var monthlyTrends={};
var categoryBreakdown={};
var totalSpend=0;
for(var i=0;i<transactions.length;i++){
var t=transactions[i];
var cat=categoryClassificationService.categorize(t);
t.category=cat;
var month=new Date(t.transactionDate).toISOString().substring(0,7);
if(!monthlyTrends[month])monthlyTrends[month]=0;
monthlyTrends[month]+=t.amount;
if(!categoryBreakdown[cat])categoryBreakdown[cat]=0;
categoryBreakdown[cat]+=t.amount;
totalSpend+=t.amount;
}
var monthlyTrendsArray=[];
for(var m in monthlyTrends){
monthlyTrendsArray.push({month:m,totalSpend:monthlyTrends[m]});
}
monthlyTrendsArray.sort(function(a,b){return a.month.localeCompare(b.month);});
var categoryBreakdownArray=[];
for(var c in categoryBreakdown){
categoryBreakdownArray.push({category:c,totalSpend:categoryBreakdown[c],percentage:totalSpend>0?(categoryBreakdown[c]/totalSpend*100):0});
}
categoryBreakdownArray.sort(function(a,b){return b.totalSpend-a.totalSpend;});
var topSpendingCategories=categoryBreakdownArray.slice(0,3).map(function(item){return item.category;});
return{monthlyTrends:monthlyTrendsArray,categoryBreakdown:categoryBreakdownArray,topSpendingCategories:topSpendingCategories,spendingPatterns:'Analysis based on '+transactions.length+' transactions'};
};
}]);
})();