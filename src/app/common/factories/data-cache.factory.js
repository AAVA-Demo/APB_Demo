(function(){
'use strict';
angular.module('creditCardApp').factory('DataCacheFactory',DataCacheFactory);
DataCacheFactory.$inject=['$cacheFactory'];
function DataCacheFactory($cacheFactory){
var cache=$cacheFactory('dataCache');
var ttlMap={};
return{get:get,put:put,remove:remove};
function get(key){
if(ttlMap[key]&&ttlMap[key]<Date.now()){
cache.remove(key);
delete ttlMap[key];
return undefined;
}
return cache.get(key);
}
function put(key,value,ttl){
cache.put(key,value);
if(ttl){
ttlMap[key]=Date.now()+ttl;
}
}
function remove(key){
cache.remove(key);
delete ttlMap[key];
}
}
})();