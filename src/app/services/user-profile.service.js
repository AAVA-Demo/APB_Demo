(function(){
'use strict';
angular.module('creditCardApp').factory('UserProfileService',UserProfileService);
UserProfileService.$inject=['$http','$q'];
function UserProfileService($http,$q){
var service={getCardsByUser:getCardsByUser};
return service;
function getCardsByUser(userId){
return $http.get('/api/users/'+userId+'/cards').then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});}
}
})();