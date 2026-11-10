(function(){
'use strict';
angular.module('creditCardApp').service('DataAggregationService',['TrendDataFactory',function(TrendDataFactory){
var vm=this;
vm.computeMonthlyRollups=function(transactions,cards){
var monthMap=new Map();
angular.forEach(transactions,function(txn){
var d=new Date(txn.transactionDate);
var monthKey=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
if(!monthMap.has(monthKey)){
monthMap.set(monthKey,{month:monthKey,totalSpend:0,cardWiseSpend:{},transactionCount:0});
}
var monthData=monthMap.get(monthKey);
monthData.totalSpend+=txn.amount;
monthData.transactionCount++;
if(!monthData.cardWiseSpend[txn.cardId]){
monthData.cardWiseSpend[txn.cardId]=0;
}
monthData.cardWiseSpend[txn.cardId]+=txn.amount;
});
var monthlySpends=[];
monthMap.forEach(function(val){
monthlySpends.push(val);
});
monthlySpends.sort(function(a,b){
return a.month.localeCompare(b.month);
});
return monthlySpends;
};
vm.filterByCards=function(monthlySpends,selectedCards){
if(!selectedCards||selectedCards.length===0){
return monthlySpends;
}
var filtered=[];
angular.forEach(monthlySpends,function(ms){
var filteredMonth={month:ms.month,totalSpend:0,cardWiseSpend:{},transactionCount:ms.transactionCount};
angular.forEach(selectedCards,function(cardId){
if(ms.cardWiseSpend[cardId]){
filteredMonth.totalSpend+=ms.cardWiseSpend[cardId];
filteredMonth.cardWiseSpend[cardId]=ms.cardWiseSpend[cardId];
}
});
filtered.push(filteredMonth);
});
return filtered;
};
}]);
})();