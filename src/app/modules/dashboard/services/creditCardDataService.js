(function(){
'use strict';
angular.module('dashboard').service('creditCardDataService',['$http','$q',function($http,$q){
var service=this;
service.getCreditCards=getCreditCards;
function getCreditCards(){
var deferred=$q.defer();
$http.get('/api/creditcards').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
return service;
}]);
})();