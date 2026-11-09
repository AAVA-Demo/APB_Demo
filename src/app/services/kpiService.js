(function(){
'use strict';
angular.module('creditCardApp').service('kpiService',[function(){
this.calculateKPIs=function(cards){
if(!cards||!cards.length){
return{totalCreditLimit:0,totalAvailableCredit:0,totalOutstandingAmount:0,monthlySpend:0,cardCount:0,lastUpdated:new Date()};
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
return{totalCreditLimit:totalCreditLimit,totalAvailableCredit:totalAvailableCredit,totalOutstandingAmount:totalOutstandingAmount,monthlySpend:monthlySpend,cardCount:cards.length,lastUpdated:new Date()};
};
}]);
})();