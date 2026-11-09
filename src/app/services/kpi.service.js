(function(){
'use strict';
angular.module('creditCardApp').service('KPIService',['CardDataFactory','$q',function(CardDataFactory,$q){
var self=this;
self.getKPIs=function(){
var deferred=$q.defer();
CardDataFactory.fetchCards().then(function(cards){
var kpis={
monthlySpend:0,
totalCreditLimit:0,
totalAvailableCredit:0,
totalOutstanding:0,
cardCount:cards.length,
lastRefreshed:new Date()
};
angular.forEach(cards,function(card){
kpis.totalCreditLimit+=card.creditLimit;
kpis.totalAvailableCredit+=card.availableCredit;
kpis.totalOutstanding+=card.outstandingAmount;
kpis.monthlySpend+=card.monthlySpend||0;
});
deferred.resolve({kpis:kpis,cards:cards});
},function(err){
deferred.reject(err);
});
return deferred.promise;
};
}]);
})();