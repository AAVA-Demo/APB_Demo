(function(){
'use strict';
angular.module('creditCard.dashboard').factory('KPIService',['$q','CreditCardService','TransactionSummaryService',function($q,CreditCardService,TransactionSummaryService){
const service={};
service.getKPIDashboard=function(userId){
const deferred=$q.defer();
$q.all({cardSummaries:CreditCardService.getAllCardSummaries(userId),monthlySpend:TransactionSummaryService.getCurrentMonthSpend(userId)}).then(function(results){
const cardSummaries=results.cardSummaries;
const monthlySpend=results.monthlySpend;
const totalCreditLimit=cardSummaries.reduce((sum,card)=>sum+card.creditLimit,0);
const availableCredit=cardSummaries.reduce((sum,card)=>sum+card.availableCredit,0);
const totalOutstanding=cardSummaries.reduce((sum,card)=>sum+card.outstandingAmount,0);
const creditUtilization=totalCreditLimit>0?((totalOutstanding/totalCreditLimit)*100).toFixed(2):0;
const kpiDashboard={userId:userId,monthlySpend:monthlySpend.totalSpend,totalCreditLimit:totalCreditLimit,availableCredit:availableCredit,totalOutstanding:totalOutstanding,creditUtilization:creditUtilization,lastUpdated:new Date().toISOString()};
deferred.resolve(kpiDashboard);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();