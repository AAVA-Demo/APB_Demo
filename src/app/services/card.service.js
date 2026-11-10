(function(){
'use strict';
angular.module('creditCardApp').factory('CardService',['$http','$q',function($http,$q){
var service={};
service.getCards=function(userId){
var deferred=$q.defer();
$http.get('/api/cards',{params:{userId:userId}}).then(function(response){
deferred.resolve(response.data.cards||[]);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();