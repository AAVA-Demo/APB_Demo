(function(){
'use strict';
angular.module('creditCardApp').service('CreditCardService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
var self=this;
self.getDashboardKPIs=function(userId){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/creditcards/dashboard',{params:{userId:userId}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
self.getCardList=function(userId){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/creditcards',{params:{userId:userId}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();