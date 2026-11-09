(function(){
'use strict';
angular.module('creditCardApp').factory('CardDataFactory',['$http','API_CONFIG','$q',function($http,API_CONFIG,$q){
var factory={};
factory.getCardDetails=function(cardIds){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+API_CONFIG.endpoints.cards,{params:{ids:cardIds.join(',')}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return factory;
}]);
})();