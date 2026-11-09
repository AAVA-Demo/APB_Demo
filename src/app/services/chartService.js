(function(){
'use strict';
angular.module('creditCardApp').service('chartService',['categoryService',function(categoryService){
this.processData=function(transactions){
var monthlyTrends={};
var cardWiseSpend={};
var categoryWiseSpend={};
for(var i=0;i<transactions.length;i++){
var t=transactions[i];
var month=new Date(t.transactionDate).toISOString().substring(0,7);
if(!monthlyTrends[month])monthlyTrends[month]=0;
monthlyTrends[month]+=t.amount;
if(!cardWiseSpend[t.cardId])cardWiseSpend[t.cardId]=0;
cardWiseSpend[t.cardId]+=t.amount;
var cat=categoryService.categorize(t);
if(!categoryWiseSpend[cat])categoryWiseSpend[cat]=0;
categoryWiseSpend[cat]+=t.amount;
}
var monthlyTrendsArray=[];
for(var m in monthlyTrends){
monthlyTrendsArray.push({month:m,totalSpend:monthlyTrends[m]});
}
monthlyTrendsArray.sort(function(a,b){return a.month.localeCompare(b.month);});
var cardWiseSpendArray=[];
for(var c in cardWiseSpend){
cardWiseSpendArray.push({cardId:c,totalSpend:cardWiseSpend[c]});
}
var categoryWiseSpendArray=[];
for(var cat in categoryWiseSpend){
categoryWiseSpendArray.push({category:cat,totalSpend:categoryWiseSpend[cat]});
}
return{monthlyTrends:monthlyTrendsArray,cardWiseSpend:cardWiseSpendArray,categoryWiseSpend:categoryWiseSpendArray};
};
}]);
})();