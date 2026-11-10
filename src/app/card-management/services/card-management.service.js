(function(){
'use strict';
angular.module('app.cardManagement').service('CardManagementService',['AuthFactory','CreditCardFactory','TransactionFactory','$q',function(AuthFactory,CreditCardFactory,TransactionFactory,$q){
var cachedPortfolio=null;
this.getCardPortfolio=function(){
if(cachedPortfolio)return $q.resolve(cachedPortfolio);
var deferred=$q.defer();
AuthFactory.validateUser().then(function(user){
var userId=user.userId||'U001';
CreditCardFactory.getUserCards(userId).then(function(response){
var cards=response.data;
var metricsPromises=cards.map(function(card){
return TransactionFactory.getCardMetrics(card.cardId).then(function(metricsResp){
card.metrics=metricsResp.data;
card.utilizationRate=card.creditLimit>0?((card.outstandingAmount/card.creditLimit)*100).toFixed(2):0;
return card;
});
});
$q.all(metricsPromises).then(function(enrichedCards){
var portfolio={userId:userId,cards:enrichedCards,totalCards:enrichedCards.length};
cachedPortfolio=portfolio;
deferred.resolve(portfolio);
});
},function(error){
deferred.reject(error);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.getCardDetails=function(cardId){
var deferred=$q.defer();
TransactionFactory.getCardTransactions(cardId).then(function(response){
var transactions=response.data;
var totalSpend=transactions.reduce(function(sum,t){return sum+t.amount;},0);
var details={cardId:cardId,transactions:transactions,totalSpend:totalSpend};
deferred.resolve(details);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();