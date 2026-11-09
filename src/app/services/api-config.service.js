(function(){
'use strict';
angular.module('creditCardApp').constant('API_CONFIG',{BASE_URL:'https://api.creditcard.demo',ENDPOINTS:{CARDS:'/api/cards',CARDS_SUMMARY:'/api/cards/summary',TRANSACTIONS:'/api/transactions',TRANSACTIONS_SUMMARY:'/api/transactions/summary',MONTHLY_SUMMARY:'/api/transactions/monthly-summary',ANALYTICS:'/api/analytics/spending',CATEGORIZATION:'/api/categorization'},CACHE_TTL:300000,REFRESH_INTERVAL:60000});
})();