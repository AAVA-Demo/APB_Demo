(function(){
'use strict';
angular.module('creditCard.dashboard').factory('PortfolioFactory',[function(){
return{
calculateKPIs:function(portfolio){
if(!portfolio||!portfolio.cards){
return{totalMonthlySpend:0,totalCreditLimit:0,totalAvailableCredit:0,totalOutstanding:0,creditUtilization:0};
}
var totalMonthlySpend=0;
var totalCreditLimit=0;
var totalAvailableCredit=0;
var totalOutstanding=0;
portfolio.cards.forEach(function(card){
totalMonthlySpend+=card.monthlySpend||0;
totalCreditLimit+=card.creditLimit||0;
totalAvailableCredit+=card.availableCredit||0;
totalOutstanding+=card.outstandingBalance||0;
});
var creditUtilization=totalCreditLimit>0?(totalOutstanding/totalCreditLimit*100):0;
return{totalMonthlySpend:totalMonthlySpend,totalCreditLimit:totalCreditLimit,totalAvailableCredit:totalAvailableCredit,totalOutstanding:totalOutstanding,creditUtilization:creditUtilization.toFixed(2)};
}
};
}]);
})();