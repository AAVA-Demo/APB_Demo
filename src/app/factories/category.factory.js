(function(){
'use strict';
angular.module('creditCardApp').factory('CategoryFactory',['$http','API_CONFIG','$q','$cacheFactory',function($http,API_CONFIG,$q,$cacheFactory){
var factory={};
var cache=$cacheFactory('categoryCache');
factory.getCategoryMappings=function(){
var deferred=$q.defer();
var cached=cache.get('mappings');
if(cached){
deferred.resolve(cached);
}else{
$http.get(API_CONFIG.baseUrl+API_CONFIG.endpoints.categories).then(function(response){
var mappings={};
response.data.forEach(function(cat){
mappings[cat.categoryId]=cat.categoryName;
});
cache.put('mappings',mappings);
deferred.resolve(mappings);
},function(error){
deferred.reject(error);
});
}
return deferred.promise;
};
return factory;
}]);
})();