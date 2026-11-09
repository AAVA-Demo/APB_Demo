(function(){
'use strict';
angular.module('creditCard.management').factory('TransactionAnalyticsFactory',['$resource','API_BASE_URL',function($resource,API_BASE_URL){
return{
getCardSpending:function(params){
return $resource(API_BASE_URL+'/analytics/card/:cardId/spending',{cardId:'@cardId'}).get(params);
}
};
}]);
})();