(function(){
'use strict';
angular.module('creditCardApp').constant('API_CONFIG',{BASE_URL:'https://api.creditcard.demo',ENDPOINTS:{PORTFOLIO:'/api/dashboard/portfolio',CARDS:'/api/cards',TRANSACTIONS:'/api/transactions',ANALYTICS:'/api/analytics/spending'},TIMEOUT:10000,CACHE_TTL:300000});
})();