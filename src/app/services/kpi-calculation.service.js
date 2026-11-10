(function(){
'use strict';
angular.module('creditCardApp')
.service('KpiCalculationService',[function(){
this.calculateKpis=function(cards){
if(!cards||!cards.length){
return{totalCreditLimit:0,totalAvailableCredit:0,totalOutstanding:0,totalMonthlySpend:0,numberOfCards:0,cards:[]};
}
var kpis=cards.reduce(function(acc,card){
acc.totalCreditLimit+=card.creditLimit||0;
acc.totalAvailableCredit+=card.availableCredit||0;
acc.totalOutstanding+=card.outstandingAmount||0;
acc.totalMonthlySpend+=card.monthlySpend||0;
return acc;
},{totalCreditLimit:0,totalAvailableCredit:0,totalOutstanding:0,totalMonthlySpend:0});
kpis.numberOfCards=cards.length;
kpis.cards=cards;
kpis.totalCreditLimit=Number(kpis.totalCreditLimit.toFixed(2));
kpis.totalAvailableCredit=Number(kpis.totalAvailableCredit.toFixed(2));
kpis.totalOutstanding=Number(kpis.totalOutstanding.toFixed(2));
kpis.totalMonthlySpend=Number(kpis.totalMonthlySpend.toFixed(2));
return kpis;
};
}]);
})();