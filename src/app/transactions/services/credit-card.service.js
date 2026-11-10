(function(){
'use strict';
angular.module('transactionModule').service('CreditCardService',['$http','$q',function($http,$q){
var vm=this;
vm.getCardFilterParams=function(cardId){
var deferred=$q.defer();
$http.get('/api/cards/'+cardId+'/filter-params').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
vm.getAllCards=function(){
var deferred=$q.defer();
$http.get('/api/cards').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();