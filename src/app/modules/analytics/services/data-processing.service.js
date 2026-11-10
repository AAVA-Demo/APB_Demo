(function(){
'use strict';
angular.module('analyticsModule').service('DataProcessingService',[function(){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
this.processData=function(transactions,kpis){
var categorySpends=this.groupByCategory(transactions);
var monthlyTrends=this.groupByMonth(transactions);
var cardWiseSpends=this.groupByCard(transactions);
return{categorySpends:categorySpends,monthlyTrends:monthlyTrends,cardWiseSpends:cardWiseSpends,categories:categories};
};
this.groupByCategory=function(transactions){
var categoryMap={};
categories.forEach(function(cat){
categoryMap[cat]={category:cat,amount:0,percentage:0,transactionCount:0};
});
var totalAmount=0;
transactions.forEach(function(txn){
var cat=txn.category||'Miscellaneous';
if(!categoryMap[cat]){
categoryMap[cat]={category:cat,amount:0,percentage:0,transactionCount:0};
}
categoryMap[cat].amount+=txn.amount;
categoryMap[cat].transactionCount++;
totalAmount+=txn.amount;
});
var result=[];
for(var key in categoryMap){
if(categoryMap[key].amount>0){
categoryMap[key].percentage=(categoryMap[key].amount/totalAmount)*100;
result.push(categoryMap[key]);
}
}
return result;
};
this.groupByMonth=function(transactions){
var monthMap={};
transactions.forEach(function(txn){
var date=new Date(txn.date);
var monthKey=date.getFullYear()+'-'+(date.getMonth()+1);
if(!monthMap[monthKey]){
monthMap[monthKey]={month:date.toLocaleString('default',{month:'short'}),year:date.getFullYear(),totalSpend:0,categoryBreakdown:[]};
}
monthMap[monthKey].totalSpend+=txn.amount;
});
var result=[];
for(var key in monthMap){
result.push(monthMap[key]);
}
return result.sort(function(a,b){return new Date(a.year,a.month)-new Date(b.year,b.month);});
};
this.groupByCard=function(transactions){
var cardMap={};
transactions.forEach(function(txn){
if(!cardMap[txn.cardId]){
cardMap[txn.cardId]={cardId:txn.cardId,cardLast4:txn.cardLast4||'****',totalSpend:0,categoryBreakdown:[]};
}
cardMap[txn.cardId].totalSpend+=txn.amount;
});
var result=[];
for(var key in cardMap){
result.push(cardMap[key]);
}
return result;
};
}]);
})();