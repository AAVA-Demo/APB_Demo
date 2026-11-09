(function(){
'use strict';
angular.module('dashboardModule').service('KPICalculationService',[function(){
const self=this;
self.calculate=function(cards,spendData){
let totalCreditLimit=0;
let outstandingAmount=0;
let availableCredit=0;
angular.forEach(cards,function(card){
totalCreditLimit+=card.creditLimit||0;
outstandingAmount+=card.currentBalance||0;
availableCredit+=card.availableCredit||0;
});
const monthlySpend=spendData.totalSpend||0;
return{monthlySpend:monthlySpend,totalCreditLimit:totalCreditLimit,availableCredit:availableCredit,outstandingAmount:outstandingAmount,lastUpdated:new Date()};
};
}]);
})();