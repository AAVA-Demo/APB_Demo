(function(){
'use strict';
angular.module('transactionModule').service('TransactionCacheService',['$cacheFactory',function($cacheFactory){
var cache=$cacheFactory('transactionCache',{capacity:10});
this.get=function(key){
return cache.get(key);
};
this.put=function(key,value){
cache.put(key,value);
};
this.remove=function(key){
cache.remove(key);
};
this.removeAll=function(){
cache.removeAll();
};
}]);
})();