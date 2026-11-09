(function(){
'use strict';
angular.module('creditCardApp').service('calculationService',[function(){
const self=this;
self.calculateKPIs=function(cards,transactions){
const monthlySpend=transactions.reduce((sum,t)=>sum+t.amount,0);
const totalCreditLimit=cards.reduce((sum,c)=>sum+c.creditLimit,0);
const totalAvailableCredit=cards.reduce((sum,c)=>sum+c.availableCredit,0);
const totalOutstandingAmount=cards.reduce((sum,c)=>sum+c.outstandingAmount,0);
const cardCount=cards.length;
return{
monthlySpend:monthlySpend,
totalCreditLimit:totalCreditLimit,
totalAvailableCredit:totalAvailableCredit,
totalOutstandingAmount:totalOutstandingAmount,
cardCount:cardCount
};
};
}]);
})();