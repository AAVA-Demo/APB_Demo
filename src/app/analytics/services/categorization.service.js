(function(){
'use strict';
angular.module('creditCard.analytics').factory('CategorizationService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
const service={};
service.categorizeTransaction=function(transaction){
const deferred=$q.defer();
$http.post(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.CATEGORIZATION,transaction).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();