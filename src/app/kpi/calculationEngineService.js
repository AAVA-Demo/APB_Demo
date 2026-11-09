angular.module('kpiModule').service('calculationEngineService',[function(){
var service=this;
service.calculateKPIs=function(transactionSummary,cardSummary){
var monthlySpend=parseFloat(transactionSummary.total||0).toFixed(2);
var totalCreditLimit=parseFloat(cardSummary.totalLimit||0).toFixed(2);
var outstandingAmount=parseFloat(cardSummary.totalOutstanding||0).toFixed(2);
var availableCredit=(parseFloat(totalCreditLimit)-parseFloat(outstandingAmount)).toFixed(2);
return{
monthlySpend:monthlySpend,
totalCreditLimit:totalCreditLimit,
availableCredit:availableCredit,
outstandingAmount:outstandingAmount,
lastUpdated:new Date()
};
};
}]);