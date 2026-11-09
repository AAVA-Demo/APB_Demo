(function(){
'use strict';
angular.module('cardManagement').service('cardRepositoryService',['$http','$q',function($http,$q){
var service=this;
service.fetchCards=fetchCards;
service.fetchCardById=fetchCardById;
function fetchCards(){
var deferred=$q.defer();
$http.get('/api/cards').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
function fetchCardById(cardId){
var deferred=$q.defer();
$http.get('/api/cards/'+cardId).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
return service;
}]);
})();