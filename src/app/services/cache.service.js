(function(){
'use strict';
angular.module('creditCardApp').service('CacheService',['$window',function($window){
var TTL=600000;
this.get=function(key){
var item=$window.localStorage.getItem(key);
if(!item)return null;
var data=JSON.parse(item);
if(Date.now()-data.timestamp>TTL){
$window.localStorage.removeItem(key);
return null;
}
return data.value;
};
this.set=function(key,value){
var item={value:value,timestamp:Date.now()};
$window.localStorage.setItem(key,JSON.stringify(item));
};
this.remove=function(key){
$window.localStorage.removeItem(key);
};
this.getSession=function(key){
var item=$window.sessionStorage.getItem(key);
if(!item)return null;
var data=JSON.parse(item);
if(Date.now()-data.timestamp>TTL){
$window.sessionStorage.removeItem(key);
return null;
}
return data.value;
};
this.setSession=function(key,value){
var item={value:value,timestamp:Date.now()};
$window.sessionStorage.setItem(key,JSON.stringify(item));
};
}]);
})();