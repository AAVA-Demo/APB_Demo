(function(){
'use strict';
angular.module('creditCardApp').factory('UserProfileFactory',['$http','API_CONFIG','$q',function($http,API_CONFIG,$q){
var factory={};
factory.getCardMapping=function(){
var deferred=$q.defer();
var userId='current';
$http.get(API_CONFIG.baseUrl+API_CONFIG.endpoints.users+'/'+userId+'/cards').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return factory;
}]);
})();