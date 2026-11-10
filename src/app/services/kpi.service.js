(function(){
'use strict';
angular.module('creditCardApp').factory('KPIService',['$http','$q',function($http,$q){
var service={};
service.getKPIs=function(userId){
var deferred=$q.defer();
$http.get('/api/kpis',{params:{userId:userId}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();