(function(){
'use strict';
angular.module('portfolioModule').service('CardAnalyticsService',[function(){
const self=this;
self.computeMetrics=function(card,transactions){
let totalSpend=0;
let transactionCount=transactions.length;
angular.forEach(transactions,function(txn){
totalSpend+=txn.amount||0;
});
const avgTransactionAmount=transactionCount>0?totalSpend/transactionCount:0;
const utilizationRate=card.creditLimit>0?((card.currentBalance/card.creditLimit)*100).toFixed(2):0;
return{cardId:card.cardId,totalSpend:totalSpend,utilizationRate:parseFloat(utilizationRate),transactionCount:transactionCount,avgTransactionAmount:avgTransactionAmount};
};
}]);
})();