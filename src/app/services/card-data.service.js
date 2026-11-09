(function(){
'use strict';
angular.module('creditCardApp').service('CardDataService',CardDataService);
CardDataService.$inject=['$http','$q','API_BASE_URL'];
function CardDataService($http,$q,API_BASE_URL){
var service=this;
service.getAllCardBalances=getAllCardBalances;
function getAllCardBalances(){
return $http.get(API_BASE_URL+'/cards/balances').then(function(response){
return response.data||mockCardBalances();
}).catch(function(err){
return mockCardBalances();
});
}
function mockCardBalances(){
return[{cardId:'card-001',creditLimit:50000,availableCredit:35000,outstandingAmount:15000},{cardId:'card-002',creditLimit:30000,availableCredit:28000,outstandingAmount:2000},{cardId:'card-003',creditLimit:75000,availableCredit:50000,outstandingAmount:25000}];
}
}
})();