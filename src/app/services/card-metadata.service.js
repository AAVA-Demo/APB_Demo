(function(){
'use strict';
angular.module('creditCardApp').factory('CardMetadataService',['$http','$q',function($http,$q){
var service={};
service.fetchCardList=function(userId){
var deferred=$q.defer();
$http.get('/api/cards/metadata',{params:{userId:userId}}).then(function(response){
deferred.resolve(response.data.cards||[]);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();