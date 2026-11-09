(function(){
'use strict';
angular.module('creditCardApp').service('CardComparisonService',['CreditCardDataService','TransactionService','$q',function(CreditCardDataService,TransactionService,$q){
var self=this;
self.compareCards=function(cardIds){
var promises=cardIds.map(function(id){
return CreditCardDataService.fetchAllCards('user123').then(function(cards){
var card=cards.find(function(c){return c.cardId===id;});
return{
cardId:id,
cardName:card?card.cardType+' '+card.lastFourDigits:'Unknown',
utilizationRate:card?card.utilizationRate:0,
monthlySpend:card?card.monthlySpend:0,
availableCredit:card?card.availableCredit:0
};
});
});
return $q.all(promises);
};
}]);
})();