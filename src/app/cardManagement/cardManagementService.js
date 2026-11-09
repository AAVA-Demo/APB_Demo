(function(){
'use strict';
angular.module('creditCardApp').service('cardManagementService',['$q','creditCardDataFactory','transactionDataFactory','displayFormattingService',function($q,creditCardDataFactory,transactionDataFactory,displayFormattingService){
const self=this;
self.getCardPortfolio=function(){
return $q.all({
cards:creditCardDataFactory.fetchCards(),
spending:transactionDataFactory.fetchCardWiseSpending()
}).then(function(results){
return displayFormattingService.formatCardPortfolio(results.cards,results.spending);
});
};
self.getCardDetails=function(cardId){
return $q.all({
card:creditCardDataFactory.fetchCardById(cardId),
spending:transactionDataFactory.fetchCardWiseSpending()
}).then(function(results){
const spendingData=results.spending.find(s=>s.cardId===cardId)||{cardId:cardId,currentMonthSpend:0,lastMonthSpend:0,yearToDateSpend:0,transactionCount:0};
return{
card:results.card,
spending:spendingData
};
});
};
}]);
})();