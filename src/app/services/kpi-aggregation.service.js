(function(){
'use strict';
angular.module('dashboardModule').service('KpiAggregationService',['CreditCardFactory','TransactionFactory','$q',function(CreditCardFactory,TransactionFactory,$q){
var self=this;
self.getKpiData=function(){
var deferred=$q.defer();
$q.all([CreditCardFactory.getAllCards(),TransactionFactory.getMonthlyTransactions()]).then(function(results){
var cards=results[0];
var transactions=results[1];
var totalCreditLimit=cards.reduce(function(sum,card){return sum+card.creditLimit;},0);
var outstandingAmount=cards.reduce(function(sum,card){return sum+card.outstandingBalance;},0);
var availableCredit=totalCreditLimit-outstandingAmount;
var monthlySpend=transactions.reduce(function(sum,txn){return sum+txn.amount;},0);
var kpiData={monthlySpend:monthlySpend,totalCreditLimit:totalCreditLimit,availableCredit:availableCredit,outstandingAmount:outstandingAmount,lastUpdated:new Date()};
deferred.resolve(kpiData);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();