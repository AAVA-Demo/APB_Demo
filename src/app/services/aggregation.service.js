(function(){
'use strict';
angular.module('creditCardApp').service('AggregationService',[function(){
var self=this;
self.aggregateByMonth=function(transactions){
var monthMap={};
transactions.forEach(function(t){
var date=new Date(t.transactionDate);
var monthKey=date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0');
if(!monthMap[monthKey]){
monthMap[monthKey]={month:monthKey,totalSpend:0};
}
monthMap[monthKey].totalSpend+=t.amount;
});
var result=Object.keys(monthMap).map(function(key){return monthMap[key];});
return result.sort(function(a,b){return a.month.localeCompare(b.month);});
};
self.aggregateByCard=function(transactions){
var cardMap={};
transactions.forEach(function(t){
if(!cardMap[t.cardId]){
cardMap[t.cardId]={cardId:t.cardId,cardName:t.cardName||t.cardId,totalSpend:0};
}
cardMap[t.cardId].totalSpend+=t.amount;
});
return Object.keys(cardMap).map(function(key){return cardMap[key];});
};
self.aggregateByCategory=function(transactions){
var categoryMap={};
var total=0;
transactions.forEach(function(t){
if(!categoryMap[t.category]){
categoryMap[t.category]={category:t.category,amount:0,transactionCount:0};
}
categoryMap[t.category].amount+=t.amount;
categoryMap[t.category].transactionCount++;
total+=t.amount;
});
var result=Object.keys(categoryMap).map(function(key){
var cat=categoryMap[key];
cat.percentage=total>0?(cat.amount/total*100).toFixed(2):0;
return cat;
});
return result.sort(function(a,b){return b.amount-a.amount;});
};
}]);
})();