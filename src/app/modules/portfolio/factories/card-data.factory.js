(function(){
'use strict';
angular.module('portfolioModule').factory('CardDataFactory',['$resource','API_ENDPOINTS',function($resource,API_ENDPOINTS){
return $resource(API_ENDPOINTS.creditCards+'/:cardId',{cardId:'@cardId'},{getCardDetails:{method:'GET'}});
}]);
})();