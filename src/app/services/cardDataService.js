(function(){
'use strict';
angular.module('creditCardApp').factory('cardDataService',['$http','$q',function($http,$q){
var cache=null;
var cacheTime=0;
var CACHE_DURATION=30000;
function getAllCards(){
var now=Date.now();
if(cache&&(now-cacheTime)<CACHE_DURATION){
return $q.resolve(cache);
}
return $http.get('/api/cards').then(function(response){
cache=response.data;
cacheTime=now;
return cache;
},function(error){
return $q.reject(error);
});
}
function getCardById(cardId){
return $http.get('/api/cards/'+cardId).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function getDashboardData(){
return $http.get('/api/dashboard').then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
return{getAllCards:getAllCards,getCardById:getCardById,getDashboardData:getDashboardData};
}]);
})();