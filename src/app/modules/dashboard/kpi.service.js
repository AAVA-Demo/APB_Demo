(function(){
'use strict';
angular.module('app.dashboard').service('KPIService',KPIService);
KPIService.$inject=['CardDataService','TransactionService','DataCacheFactory','$q'];
function KPIService(CardDataService,TransactionService,DataCacheFactory,$q){
var service=this;
service.getKPIs=getKPIs;
function getKPIs(){
var cached=DataCacheFactory.get('dashboard-kpis');
if(cached){
return $q.resolve(cached);
}
return $q.all({balances:CardDataService.getAllCardBalances(),spend:TransactionService.getMonthlySpend()}).then(function(results){
var kpis=aggregateKPIs(results.balances,results.spend);
DataCacheFactory.put('dashboard-kpis',kpis,60000);
return kpis;
});
}
function aggregateKPIs(balances,spend){
var totals=balances.reduce(function(acc,card){
acc.totalCreditLimit+=card.creditLimit||0;
acc.availableCredit+=card.availableCredit||0;
acc.totalOutstanding+=card.outstandingAmount||0;
return acc;
},{totalCreditLimit:0,availableCredit:0,totalOutstanding:0});
return{totalCreditLimit:totals.totalCreditLimit,availableCredit:totals.availableCredit,totalOutstanding:totals.totalOutstanding,monthlySpend:spend.totalSpend||0,utilizationRate:totals.totalCreditLimit>0?(totals.totalOutstanding/totals.totalCreditLimit*100).toFixed(2):0,lastUpdated:new Date()};
}
}
})();