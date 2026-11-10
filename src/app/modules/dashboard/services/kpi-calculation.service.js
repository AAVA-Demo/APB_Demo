(function(){
'use strict';
angular.module('dashboardModule').service('KPICalculationService',[function(){
this.calculateKPIs=function(cards){
var totalMonthlySpend=0;
var totalCreditLimit=0;
var totalAvailableCredit=0;
var totalOutstanding=0;
angular.forEach(cards,function(card){
totalMonthlySpend+=card.monthlySpend||0;
totalCreditLimit+=card.creditLimit||0;
totalAvailableCredit+=card.availableCredit||0;
totalOutstanding+=card.outstandingAmount||0;
});
return{totalMonthlySpend:totalMonthlySpend,totalCreditLimit:totalCreditLimit,totalAvailableCredit:totalAvailableCredit,totalOutstanding:totalOutstanding,cardCount:cards.length,cards:cards};
};
}]);
})();