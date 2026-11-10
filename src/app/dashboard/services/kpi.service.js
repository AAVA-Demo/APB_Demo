(function(){
'use strict';
angular.module('app.dashboard').service('KPIService',['CreditCardFactory','TransactionFactory','CacheService','$q',function(CreditCardFactory,TransactionFactory,CacheService,$q){
this.getAggregatedKPIs=function(){
var cached=CacheService.get('kpi_data');
if(cached)return $q.resolve(cached);
var deferred=$q.defer();
var kpis={monthlySpend:0,totalCreditLimit:0,totalAvailableCredit:0,totalOutstandingAmount:0,cardCount:0,lastUpdated:new Date()};
$q.all([CreditCardFactory.getAllCards(),TransactionFactory.getMonthlyTransactions()]).then(function(results){
var cards=results[0].data;
var txnData=results[1].data;
kpis.cardCount=cards.length;
cards.forEach(function(card){
kpis.totalCreditLimit+=card.creditLimit;
kpis.totalAvailableCredit+=card.availableCredit;
kpis.totalOutstandingAmount+=card.outstandingAmount;
});
kpis.monthlySpend=txnData.monthlySpend||0;
CacheService.set('kpi_data',kpis);
deferred.resolve(kpis);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();