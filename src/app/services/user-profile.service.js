(function(){
'use strict';
angular.module('creditCardApp').factory('UserProfileService',['$http','API_ENDPOINTS','$q',function($http,API_ENDPOINTS,$q){
return{getUserCardIds:function(){
var deferred=$q.defer();
$http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.userCards).then(function(response){
deferred.resolve(response.data.cardIds||[]);},function(error){
console.error('Error fetching user card IDs:',error);
deferred.reject(error);});
return deferred.promise;}};
}]);
})();