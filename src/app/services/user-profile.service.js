(function(){
'use strict';
angular.module('creditCardApp').service('UserProfileService',['$http','$q','API_BASE_URL',function($http,$q,API_BASE_URL){
const self=this;
self.getLinkedCardIds=function(){
const deferred=$q.defer();
$http.get(API_BASE_URL+'/user/profile/cards').then(function(response){
deferred.resolve(response.data||[]);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();