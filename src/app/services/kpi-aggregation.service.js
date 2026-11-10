(function(){
'use strict';
angular.module('creditCardApp')
.service('KpiAggregationService',['$q','CreditCardApiService','KpiCalculatorFactory','AuthService',function($q,CreditCardApiService,KpiCalculatorFactory,AuthService){
var self=this;
self.fetchKpis=function(){
var deferred=$q.defer();
var user=AuthService.getUser();
if(!user){
deferred.reject('User not authenticated');
return deferred.promise;
}
CreditCardApiService.getCards(user.userId)
.then(function(cards){
var kpiData=KpiCalculatorFactory.calculateKpis(cards);
deferred.resolve(kpiData);
})
.catch(function(err){
deferred.reject(err);
});
return deferred.promise;
};
}]);
})();