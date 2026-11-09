angular.module('kpiModule').service('kpiService',['transactionProcessingService','cardDataRepositoryService','calculationEngineService','$q',function(transactionProcessingService,cardDataRepositoryService,calculationEngineService,$q){
var service=this;
service.getKPIs=function(){
var deferred=$q.defer();
$q.all([
transactionProcessingService.getMonthlyTransactions(),
cardDataRepositoryService.getCardSummary()
]).then(function(results){
var transactionSummary=results[0];
var cardSummary=results[1];
var kpiData=calculationEngineService.calculateKPIs(transactionSummary,cardSummary);
deferred.resolve(kpiData);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);