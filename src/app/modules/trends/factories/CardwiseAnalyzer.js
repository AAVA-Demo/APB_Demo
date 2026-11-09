(function(){
'use strict';
angular.module('spendTrendsModule').factory('CardwiseAnalyzer',[function(){
return{
analyzeByCard:function(transactions,cards){
var cardMap={};
cards.forEach(function(card){
cardMap[card.cardId]={cardId:card.cardId,cardName:card.cardType+' - '+card.cardNumber,totalSpend:0,monthlyData:{}};
});
transactions.forEach(function(txn){
if(cardMap[txn.cardId]){
cardMap[txn.cardId].totalSpend+=txn.amount;
var date=new Date(txn.transactionDate);
var monthKey=date.getFullYear()+'-'+(''+(date.getMonth()+1)).padStart(2,'0');
if(!cardMap[txn.cardId].monthlyData[monthKey]){
cardMap[txn.cardId].monthlyData[monthKey]={month:monthKey,spend:0};
}
cardMap[txn.cardId].monthlyData[monthKey].spend+=txn.amount;
}
});
var cardSpendSummary=Object.keys(cardMap).map(function(key){
var card=cardMap[key];
card.monthlyData=Object.values(card.monthlyData).sort(function(a,b){
return a.month.localeCompare(b.month);
});
return card;
});
return cardSpendSummary;
}
};
}]);
})();