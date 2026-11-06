(function(){
'use strict';
angular.module('creditCardDashboardModule').factory('CardDataFactory',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
var factory={};
factory.getAllCards=function(){
var deferred=$q.defer();
$http.get(API_CONFIG.endpoints.cards).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return factory;
}]);
})();