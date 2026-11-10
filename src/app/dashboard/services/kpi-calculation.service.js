(function(){
'use strict';
angular.module('creditCardDashboard').service('KPICalculationService',KPICalculationService);
KPICalculationService.$inject=[];
function KPICalculationService(){
var vm=this;
vm.calculateKPIs=calculateKPIs;
function calculateKPIs(cards){
var totalCreditLimit=0,totalOutstanding=0,totalAvailableCredit=0,totalMonthlySpend=0;
cards.forEach(function(card){
card.availableCredit=card.totalCreditLimit-card.outstandingAmount;
card.utilizationPercent=card.totalCreditLimit>0?((card.outstandingAmount/card.totalCreditLimit)*100).toFixed(2):0;
totalCreditLimit+=card.totalCreditLimit;
totalOutstanding+=card.outstandingAmount;
totalAvailableCredit+=card.availableCredit;
totalMonthlySpend+=card.monthlySpend;
});
var aggregateKPIs={totalCards:cards.length,totalCreditLimit:totalCreditLimit,totalOutstanding:totalOutstanding,totalAvailableCredit:totalAvailableCredit,totalMonthlySpend:totalMonthlySpend,averageUtilization:totalCreditLimit>0?((totalOutstanding/totalCreditLimit)*100).toFixed(2):0};
return{cards:cards,kpis:aggregateKPIs};
}
}
})();