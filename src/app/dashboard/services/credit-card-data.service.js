(function(){
'use strict';
angular.module('dashboardModule').service('CreditCardDataService',['$http','$q',function($http,$q){
var vm=this;
var cache=null;
var cacheTime=null;
var cacheDuration=30000;
vm.getAllCards=function(){
var deferred=$q.defer();
var now=new Date().getTime();
if(cache&&cacheTime&&(now-cacheTime)<cacheDuration){
deferred.resolve(cache);
return deferred.promise;
}
$http.get('/api/cards').then(function(response){
cache=response.data;
cacheTime=now;
deferred.resolve(cache);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
vm.clearCache=function(){
cache=null;
cacheTime=null;
};
}]);
})();