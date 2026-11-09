(function(){
'use strict';
angular.module('dashboard').service('dashboardOrchestrationService',['$q','creditCardDataService','transactionService','kpiCalculationFactory',function($q,creditCardDataService,transactionService,kpiCalculationFactory){
var service=this;
service.loadDashboard=loadDashboard;
function loadDashboard(){
var deferred=$q.defer();
$q.all({
cards:creditCardDataService.getCreditCards(),
transactions:transactionService.getMonthlyTransactions()
}).then(function(results){
var kpis=kpiCalculationFactory.calculateKPIs(results.cards,results.transactions);
deferred.resolve(kpis);
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
return service;
}]);
})();