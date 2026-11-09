angular.module('portfolioModule').service('aggregationService',[function(){
var service=this;
service.calculatePortfolioSummary=function(cards){
var totalCreditLimit=cards.reduce(function(sum,card){return sum+card.creditLimit;},0);
var totalAvailableCredit=cards.reduce(function(sum,card){return sum+card.availableCredit;},0);
var totalOutstandingAmount=cards.reduce(function(sum,card){return sum+card.outstandingAmount;},0);
var utilizationRate=totalCreditLimit>0?(totalOutstandingAmount/totalCreditLimit)*100:0;
return{
totalCards:cards.length,
totalCreditLimit:totalCreditLimit.toFixed(2),
totalAvailableCredit:totalAvailableCredit.toFixed(2),
totalOutstandingAmount:totalOutstandingAmount.toFixed(2),
utilizationRate:utilizationRate.toFixed(2)
};
};
}]);