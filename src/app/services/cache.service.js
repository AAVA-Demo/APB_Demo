(function(){
'use strict';
angular.module('creditCardApp').service('CacheService',['$cacheFactory','API_CONFIG',function($cacheFactory,API_CONFIG){
const vm=this;
vm.cardCache=$cacheFactory('cardCache',{capacity:50});
vm.transactionCache=$cacheFactory('transactionCache',{capacity:100});
vm.get=function(cacheName,key){
const cache=vm[cacheName];
return cache?cache.get(key):null;
};
vm.put=function(cacheName,key,value){
const cache=vm[cacheName];
if(cache)cache.put(key,value);
};
vm.remove=function(cacheName,key){
const cache=vm[cacheName];
if(cache)cache.remove(key);
};
vm.removeAll=function(cacheName){
const cache=vm[cacheName];
if(cache)cache.removeAll();
};
}]);
})();