(function(){
'use strict';
angular.module('creditCard.portfolio').factory('PortfolioService',['$q','CardDataService','TransactionService',function($q,CardDataService,TransactionService){
const service={};
service.getPortfolioSummary=function(userId){
const deferred=$q.defer();
CardDataService.getUserCards(userId).then(function(cards){
const spendingPromises=cards.map(card=>TransactionService.getCardSpending(card.cardId));
$q.all(spendingPromises).then(function(spendingData){
const cardSpendingMap=new Map();
spendingData.forEach((spending,index)=>{
cardSpendingMap.set(cards[index].cardId,spending);
});
const totalCreditLimit=cards.reduce((sum,card)=>sum+card.creditLimit,0);
const totalAvailableCredit=cards.reduce((sum,card)=>sum+card.availableCredit,0);
const totalOutstanding=cards.reduce((sum,card)=>sum+card.outstandingAmount,0);
const portfolioSummary={userId:userId,cards:cards,cardSpending:cardSpendingMap,totalCreditLimit:totalCreditLimit,totalAvailableCredit:totalAvailableCredit,totalOutstanding:totalOutstanding};
deferred.resolve(portfolioSummary);
},function(error){
deferred.reject(error);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();