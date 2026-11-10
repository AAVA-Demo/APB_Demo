(function(){
'use strict';
angular.module('app.creditCard.dashboard').factory('KpiAggregationFactory',KpiAggregationFactory);
function KpiAggregationFactory(){
var factory={calculateKpis:calculateKpis};
return factory;
function calculateKpis(cards,monthlySpend){
var totalCreditLimit=0;
var availableCredit=0;
var outstandingAmount=0;
if(cards&&cards.length>0){
cards.forEach(function(card){
totalCreditLimit+=card.creditLimit||0;
availableCredit+=card.availableCredit||0;
outstandingAmount+=card.balance||0;
});}
var creditUtilization=totalCreditLimit>0?((outstandingAmount/totalCreditLimit)*100).toFixed(2):0;
return{
monthlySpend:monthlySpend?monthlySpend.totalSpend||0:0,
totalCreditLimit:totalCreditLimit,
availableCredit:availableCredit,
outstandingAmount:outstandingAmount,
creditUtilization:parseFloat(creditUtilization),
lastRefreshed:new Date()
};
}
}
})();