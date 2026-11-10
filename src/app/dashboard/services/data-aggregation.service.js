(function(){
'use strict';
angular.module('dashboardModule').service('DataAggregationService',['CreditCardDataService','$q',function(CreditCardDataService,$q){
var vm=this;
vm.getKPIs=function(){
var deferred=$q.defer();
CreditCardDataService.getAllCards().then(function(cards){
var kpis={
totalCreditLimit:0,
totalAvailableCredit:0,
totalOutstanding:0,
totalMonthlySpend:0,
creditUtilization:0
};
angular.forEach(cards,function(card){
kpis.totalCreditLimit+=card.creditLimit||0;
kpis.totalAvailableCredit+=card.availableCredit||0;
kpis.totalOutstanding+=card.outstandingAmount||0;
kpis.totalMonthlySpend+=card.monthlySpend||0;
});
if(kpis.totalCreditLimit>0){
kpis.creditUtilization=((kpis.totalCreditLimit-kpis.totalAvailableCredit)/kpis.totalCreditLimit*100).toFixed(2);
}
deferred.resolve(kpis);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();