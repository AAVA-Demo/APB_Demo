(function(){
'use strict';
angular.module('creditCardApp').factory('UserProfileFactory',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){
return{getUserProfile:function(){
return $http.get(API_ENDPOINTS.userProfile).then(function(response){
return response.data;
}).catch(function(error){
toastr.error('Failed to load user profile');
return $q.reject(error);
});
}};
}]);