(function(){
'use strict';
angular.module('creditCard.management').factory('CardDataFactory',['$resource','API_BASE_URL',function($resource,API_BASE_URL){
return{
getCardDetails:function(params){
return $resource(API_BASE_URL+'/cards/:cardId',{cardId:'@cardId'}).get(params);
}
};
}]);
})();