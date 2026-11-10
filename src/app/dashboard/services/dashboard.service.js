(function(){
'use strict';
angular.module('app.creditCard.dashboard').service('DashboardService',DashboardService);
DashboardService.$inject=['$q','CreditCardDataService','TransactionService','KpiAggregationFactory'];
function DashboardService($q,CreditCardDataService,TransactionService,KpiAggregationFactory){
var service={getKpiData:getKpiData};
return service;
function getKpiData(userId){
var promises={
cards:CreditCardDataService.getAllCards(userId),
monthlySpend:TransactionService.getMonthlySpend(userId)
};
return $q.all(promises).then(function(results){
var kpis=KpiAggregationFactory.calculateKpis(results.cards,results.monthlySpend);
return kpis;
}).catch(function(error){
return $q.reject(error);
});}
}
})();