(function(){
'use strict';
angular.module('analyticsModule').factory('CategoryFactory',['$resource','API_ENDPOINTS',function($resource,API_ENDPOINTS){
return $resource(API_ENDPOINTS.categories,{},{getCategoryDefinitions:{method:'GET',isArray:true,cache:true}});
}]);
})();