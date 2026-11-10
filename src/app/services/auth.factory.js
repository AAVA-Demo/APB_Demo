(function(){
'use strict';
angular.module('creditCardApp').factory('AuthFactory',['$http','$q',function($http,$q){
var API_BASE='/api';
return{
validateUser:function(){
var deferred=$q.defer();
$http.get(API_BASE+'/auth/validate').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
};
}]);
})();