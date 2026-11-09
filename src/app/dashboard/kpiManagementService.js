angular.module('dashboardModule').service('kpiManagementService',['creditCardService','transactionService','$q',function(creditCardService,transactionService,$q){
var service=this;
service.getKPIs=function(){
var deferred=$q.defer();
$q.all([
creditCardService.getAggregatedData(),
transactionService.getMonthlySpend()
]).then(function(results){
var cardData=results[0];
var transactionData=results[1];
var kpiData={
monthlySpend:parseFloat(transactionData.monthlySpend).toFixed(2),
totalCreditLimit:parseFloat(cardData.totalLimit).toFixed(2),
availableCredit:parseFloat(cardData.totalLimit-cardData.totalBalance).toFixed(2),
outstandingAmount:parseFloat(cardData.totalBalance).toFixed(2),
lastUpdated:new Date()
};
deferred.resolve(kpiData);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);