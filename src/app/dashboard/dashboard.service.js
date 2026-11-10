(function(){
'use strict';
angular.module('dashboardModule').service('DashboardService',['CreditCardDataService','TransactionService','$q',function(CreditCardDataService,TransactionService,$q){
this.getKPIs=function(){
var deferred=$q.defer();
$q.all({cardData:CreditCardDataService.getAllCards(),transactionData:TransactionService.getMonthlyTransactions()}).then(function(results){
var cardData=results.cardData;
var transactionData=results.transactionData;
var kpis={monthlySpend:transactionData.monthlySpend||0,totalCreditLimit:cardData.totalCreditLimit||0,outstandingAmount:cardData.totalOutstanding||0,availableCredit:(cardData.totalCreditLimit||0)-(cardData.totalOutstanding||0),lastUpdated:new Date()};
deferred.resolve(kpis);},function(error){
console.error('Error fetching KPIs:',error);
deferred.reject(error);});
return deferred.promise;};
}]);
})();