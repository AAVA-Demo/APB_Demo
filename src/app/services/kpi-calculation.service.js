(function(){
'use strict';
angular.module('creditCardApp').service('KPICalculationService',['CreditCardDataService','TransactionService','$q',function(CreditCardDataService,TransactionService,$q){
var self=this;
self.calculateKPIs=function(userId){
var promises={
balances:CreditCardDataService.getCardBalances(userId),
transactions:TransactionService.getMonthlyTransactions(userId)
};
return $q.all(promises).then(function(results){
var balances=results.balances;
var transactions=results.transactions;
var totalCreditLimit=0;
var availableCredit=0;
var outstandingAmount=0;
balances.forEach(function(card){
totalCreditLimit+=card.creditLimit;
availableCredit+=card.availableCredit;
outstandingAmount+=card.currentBalance;
});
var monthlySpend=0;
transactions.forEach(function(txn){
monthlySpend+=txn.amount;
});
var creditUtilization=totalCreditLimit>0?((totalCreditLimit-availableCredit)/totalCreditLimit*100):0;
return{
monthlySpend:monthlySpend,
totalCreditLimit:totalCreditLimit,
availableCredit:availableCredit,
outstandingAmount:outstandingAmount,
creditUtilization:creditUtilization.toFixed(2),
timestamp:new Date()
};
});
};
}]);
})();