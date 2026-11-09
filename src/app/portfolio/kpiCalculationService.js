(function(){
'use strict';
angular.module('portfolioModule').service('kpiCalculationService',[function(){
this.calculateKPIs=function(cards){
if(!cards||!cards.length){
return{totalCreditLimit:0,totalAvailableCredit:0,totalOutstandingAmount:0,monthlySpend:0,creditUtilization:0,cardCount:0};
}
var totalCreditLimit=0;
var totalAvailableCredit=0;
var totalOutstandingAmount=0;
var monthlySpend=0;
for(var i=0;i<cards.length;i++){
totalCreditLimit+=cards[i].creditLimit||0;
totalAvailableCredit+=cards[i].availableCredit||0;
totalOutstandingAmount+=cards[i].outstandingAmount||0;
monthlySpend+=cards[i].monthlySpend||0;
}
var creditUtilization=totalCreditLimit>0?((totalCreditLimit-totalAvailableCredit)/totalCreditLimit*100):0;
return{totalCreditLimit:totalCreditLimit,totalAvailableCredit:totalAvailableCredit,totalOutstandingAmount:totalOutstandingAmount,monthlySpend:monthlySpend,creditUtilization:creditUtilization,cardCount:cards.length};
};
}]);
})();