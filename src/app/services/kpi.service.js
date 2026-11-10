(function(){
'use strict';
angular.module('creditCardApp').service('KPIService',['CreditCardDataFactory','$q','$cacheFactory',function(CreditCardDataFactory,$q,$cacheFactory){
const self=this;
const cache=$cacheFactory('kpiCache');
const CACHE_KEY='kpiData';
const CACHE_TTL=300000;
self.getKPIs=function(){
const cached=cache.get(CACHE_KEY);
if(cached&&(Date.now()-cached.timestamp)<CACHE_TTL){
return $q.resolve(cached.data);
}
return CreditCardDataFactory.fetchCardSummary().then(function(cardSummary){
const kpi=self.computeKPIs(cardSummary);
cache.put(CACHE_KEY,{data:kpi,timestamp:Date.now()});
return kpi;
});
};
self.refreshKPIs=function(){
cache.remove(CACHE_KEY);
return self.getKPIs();
};
self.computeKPIs=function(cardSummary){
let totalCreditLimit=0;
let availableCredit=0;
let outstandingAmount=0;
cardSummary.cards.forEach(function(card){
totalCreditLimit+=card.creditLimit;
availableCredit+=card.availableCredit;
outstandingAmount+=card.currentBalance;
});
return{
monthlySpend:cardSummary.aggregatedSpend.currentMonth,
totalCreditLimit:totalCreditLimit,
availableCredit:availableCredit,
outstandingAmount:outstandingAmount,
lastUpdated:new Date()
};
};
}]);
})();