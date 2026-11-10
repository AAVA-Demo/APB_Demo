(function(){
'use strict';
angular.module('creditCardApp').service('CreditCardService',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){
const self=this;
self.getCardPortfolio=function(){
return $http.get(API_ENDPOINTS.cards).then(function(response){
const cards=response.data;
const kpis=self.calculateKPIs(cards);
return {kpis:kpis,cards:cards};
}).catch(function(error){
return $q.reject(error);
});
};
self.calculateKPIs=function(cards){
let totalCreditLimit=0,totalAvailableCredit=0,totalOutstanding=0,totalMonthlySpend=0;
cards.forEach(function(card){
totalCreditLimit+=card.creditLimit||0;
totalAvailableCredit+=card.availableCredit||0;
totalOutstanding+=card.outstandingAmount||0;
totalMonthlySpend+=card.monthlySpend||0;
});
return {totalCreditLimit:totalCreditLimit,totalAvailableCredit:totalAvailableCredit,totalOutstanding:totalOutstanding,totalMonthlySpend:totalMonthlySpend,cardCount:cards.length};
};
self.refreshData=function(){
return self.getCardPortfolio();
};
}]);
})();