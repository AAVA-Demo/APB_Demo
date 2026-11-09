(function(){
'use strict';
angular.module('cardManagement').service('cardSpendService',['$http','$q',function($http,$q){
var service=this;
service.getCardSpending=getCardSpending;
function getCardSpending(cardId){
var deferred=$q.defer();
$http.get('/api/cards/'+cardId+'/spending').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
return service;
}]);
})();