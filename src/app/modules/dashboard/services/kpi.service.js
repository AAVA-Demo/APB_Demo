(function(){
'use strict';
angular.module('creditCard.dashboard').service('KPIService',['$q','CreditCardDataFactory',function($q,CreditCardDataFactory){
const self=this;
self.getKPIs=function(){
const deferred=$q.defer();
const promises={
balances:CreditCardDataFactory.getCardBalances().$promise,
transactions:CreditCardDataFactory.getTransactions({month:'current'}).$promise
};
$q.all(promises).then(function(results){
const balances=results.balances;
const transactions=results.transactions;
const kpis=self.calculateKPIs(balances,transactions);
deferred.resolve(kpis);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
self.calculateKPIs=function(balances,transactions){
let totalCreditLimit=0;
let outstandingAmount=0;
balances.forEach(function(card){
totalCreditLimit+=card.creditLimit||0;
outstandingAmount+=card.balance||0;
});
const availableCredit=totalCreditLimit-outstandingAmount;
let monthlySpend=0;
transactions.forEach(function(txn){
monthlySpend+=txn.amount||0;
});
return{
monthlySpend:monthlySpend,
totalCreditLimit:totalCreditLimit,
availableCredit:availableCredit,
outstandingAmount:outstandingAmount,
lastUpdated:new Date()
};
};
}]);
})();