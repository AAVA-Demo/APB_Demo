(function(){
'use strict';
angular.module('creditCardApp')
.service('UserProfileService',['$q','AuthService',function($q,AuthService){
var self=this;
self.getCurrentUser=function(){
var deferred=$q.defer();
var user=AuthService.getUser();
if(user){
deferred.resolve(user);
}else{
AuthService.authenticate().then(function(authData){
deferred.resolve(authData.user);
}).catch(function(err){
deferred.reject(err);
});
}
return deferred.promise;
};
}]);
})();