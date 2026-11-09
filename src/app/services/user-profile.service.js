(function(){
'use strict';
angular.module('creditCardApp').service('UserProfileService',['$http','API_ENDPOINTS',function($http,API_ENDPOINTS){var self=this;self.getUserProfile=function(){return $http.get(API_ENDPOINTS.userProfile).then(function(response){return response.data;}).catch(function(error){console.error('Error fetching user profile:',error);throw error;});};}]);
})();