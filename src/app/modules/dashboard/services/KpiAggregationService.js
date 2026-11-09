(function(){
'use strict';
angular.module('creditCardDashboard').service('KpiAggregationService',['ApiService','$q',function(ApiService,$q){
this.fetchKPIs=function(){
var deferred=$q.defer();
ApiService.getCreditCards().then(function(cards){
var kpis={
totalMonthlySpend:0,
totalCreditLimit:0,
totalAvailableCredit:0,
totalOutstandingAmount:0,
cardCount:cards.length,
lastUpdated:new Date()
};
cards.forEach(function(card){
kpis.totalMonthlySpend+=card.monthlySpend||0;
kpis.totalCreditLimit+=card.creditLimit||0;
kpis.totalAvailableCredit+=card.availableCredit||0;
kpis.totalOutstandingAmount+=card.outstandingAmount||0;
});
deferred.resolve({kpis:kpis,cards:cards});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();