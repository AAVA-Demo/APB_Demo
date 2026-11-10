(function(){
'use strict';
angular.module('app.creditCard.multiCard').service('CardManagementService',CardManagementService);
CardManagementService.$inject=['$http','$q','UserProfileService','TransactionService','CreditCardDataService'];
function CardManagementService($http,$q,UserProfileService,TransactionService,CreditCardDataService){
var cache={};
var cacheTTL=300000;
var service={getUserCards:getUserCards};
return service;
function getUserCards(userId){
var cacheKey='cards_'+userId;
var cached=cache[cacheKey];
if(cached&&(Date.now()-cached.timestamp)<cacheTTL){
return $q.resolve(cached.data);}
return UserProfileService.getCardsByUser(userId).then(function(cardList){
var promises=cardList.map(function(card){
return enrichCardData(card);
});
return $q.all(promises);
}).then(function(enrichedCards){
cache[cacheKey]={data:enrichedCards,timestamp:Date.now()};
return enrichedCards;
}).catch(function(error){
return $q.reject(error);
});}
function enrichCardData(card){
var promises={
details:CreditCardDataService.getCardDetails(card.cardId),
transactions:TransactionService.getCardTransactions(card.cardId,'12months')
};
return $q.all(promises).then(function(results){
var enriched=angular.extend({},card,results.details);
enriched.monthlyTrends=calculateMonthlyTrends(results.transactions);
return enriched;
});}
function calculateMonthlyTrends(transactions){
var trends={};
transactions.forEach(function(txn){
var month=txn.transactionDate.substring(0,7);
if(!trends[month]){trends[month]={totalSpend:0,transactionCount:0};}
trends[month].totalSpend+=txn.amount;
trends[month].transactionCount++;
});
return Object.keys(trends).map(function(month){
return{month:month,totalSpend:trends[month].totalSpend,transactionCount:trends[month].transactionCount};
});}
}
})();