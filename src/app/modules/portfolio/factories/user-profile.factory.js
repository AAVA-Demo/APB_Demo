(function(){
'use strict';
angular.module('portfolioModule').factory('UserProfileFactory',['$resource','API_ENDPOINTS',function($resource,API_ENDPOINTS){
return $resource(API_ENDPOINTS.userProfile+'/:userId/cards',{userId:'@userId'},{getUserCards:{method:'GET',isArray:true}});
}]);
})();