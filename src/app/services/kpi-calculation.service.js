(function(){
'use strict';
angular.module('creditCard.dashboard').service('KPICalculationService',[function(){
this.calculateKPIs=function(cards){
if(!cards||!cards.length)return{totalCreditLimit:0,totalAvailableCredit:0,totalOutstanding:0,totalMonthlySpend:0,creditUtilizationPercentage:0,cards:[]};
const kpis={totalCreditLimit:0,totalAvailableCredit:0,totalOutstanding:0,totalMonthlySpend:0,creditUtilizationPercentage:0,cards:cards};
cards.forEach(function(card){
kpis.totalCreditLimit+=card.creditLimit;
kpis.totalAvailableCredit+=card.availableCredit;
kpis.totalOutstanding+=card.outstandingAmount;
kpis.totalMonthlySpend+=card.monthlySpend;
});
kpis.creditUtilizationPercentage=kpis.totalCreditLimit>0?((kpis.totalOutstanding/kpis.totalCreditLimit)*100).toFixed(2):0;
return kpis;
};
}]);
})();