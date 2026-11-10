(function(){
'use strict';
angular.module('creditCardDashboard').service('CardManagementService',CardManagementService);
CardManagementService.$inject=['CreditCardDataFactory','KPICalculationService','AuthService','$q'];
function CardManagementService(CreditCardDataFactory,KPICalculationService,AuthService,$q){
var vm=this;
vm.getCardPortfolio=getCardPortfolio;
function getCardPortfolio(){
var deferred=$q.defer();
if(!AuthService.validateSession()){
deferred.reject('Session invalid');
return deferred.promise;
}
CreditCardDataFactory.fetchCards({userId:'user123'}).$promise.then(function(cards){
var enrichedCards=KPICalculationService.calculateKPIs(cards);
deferred.resolve(enrichedCards);
},function(err){
deferred.reject(err);
});
return deferred.promise;
}
}
})();