(function(){
'use strict';
angular.module('creditCardApp').factory('CreditCardFactory',['$http','API_CONFIG','$q',function($http,API_CONFIG,$q){
var factory={};
factory.getAllCards=function(){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+API_CONFIG.endpoints.cards).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return factory;
}]);
})();