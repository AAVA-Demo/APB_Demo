(function(){
'use strict';
angular.module('dashboardModule').factory('CreditCardFactory',['$resource','API_ENDPOINTS',function($resource,API_ENDPOINTS){
return $resource(API_ENDPOINTS.creditCards+'/:userId',{userId:'@userId'},{getAllCards:{method:'GET',isArray:true,cache:true}});
}]);
})();