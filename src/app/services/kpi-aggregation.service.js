(function(){
'use strict';
angular.module('creditCardDashboardModule').service('KpiAggregationService',['CardDataFactory','$q',function(CardDataFactory,$q){
var service=this;
service.getConsolidatedKpis=function(){
var deferred=$q.defer();
CardDataFactory.getAllCards().then(function(cards){
var kpis={totalCreditLimit:0,totalAvailableCredit:0,totalOutstandingAmount:0,totalMonthlySpend:0,cardCount:cards.length};
cards.forEach(function(card){
kpis.totalCreditLimit+=card.creditLimit||0;
kpis.totalAvailableCredit+=card.availableCredit||0;
kpis.totalOutstandingAmount+=card.outstandingAmount||0;
kpis.totalMonthlySpend+=card.monthlySpend||0;
});
deferred.resolve(kpis);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();