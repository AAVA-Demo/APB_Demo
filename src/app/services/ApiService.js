(function(){
'use strict';
angular.module('creditCardApp').service('ApiService',['$http','$q',function($http,$q){
var baseUrl='/api';
this.getCreditCards=function(){
var deferred=$q.defer();
$http.get(baseUrl+'/creditcards').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.getTransactions=function(params){
var deferred=$q.defer();
$http.get(baseUrl+'/transactions',{params:params}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.getCardDetails=function(){
return this.getCreditCards();
};
}]);
})();