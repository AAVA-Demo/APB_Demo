(function(){
'use strict';
angular.module('creditCard.analytics').factory('DataAggregationFactory',[function(){
const categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
function aggregateByCategory(transactions){
const categoryMap={};
categories.forEach(function(cat){categoryMap[cat]=0;});
transactions.forEach(function(txn){if(categoryMap[txn.category]!==undefined)categoryMap[txn.category]+=txn.amount;});
const total=Object.values(categoryMap).reduce(function(sum,amt){return sum+amt;},0);
return categories.map(function(cat){return{category:cat,amount:categoryMap[cat],percentage:total>0?((categoryMap[cat]/total)*100).toFixed(2):0};});
}
function aggregateByMonth(transactions){
const monthMap={};
transactions.forEach(function(txn){
const date=new Date(txn.date);
const key=date.getFullYear()+'-'+(date.getMonth()+1);
if(!monthMap[key])monthMap[key]={month:date.toLocaleString('default',{month:'short'}),year:date.getFullYear(),amount:0};
monthMap[key].amount+=txn.amount;
});
return Object.values(monthMap).sort(function(a,b){return(a.year*12+parseInt(a.month))-(b.year*12+parseInt(b.month));});
}
function aggregateByCard(transactions){
const cardMap={};
transactions.forEach(function(txn){
if(!cardMap[txn.cardId])cardMap[txn.cardId]={cardId:txn.cardId,cardName:txn.cardName,amount:0};
cardMap[txn.cardId].amount+=txn.amount;
});
return Object.values(cardMap);
}
return{aggregateByCategory:aggregateByCategory,aggregateByMonth:aggregateByMonth,aggregateByCard:aggregateByCard};
}]);
})();