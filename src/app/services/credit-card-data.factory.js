(function(){
'use strict';
angular.module('creditCardApp')
.factory('CreditCardDataFactory',['$http','$q',function($http,$q){
var mockCards=[
{cardId:'CC001',cardName:'Platinum Rewards',cardNumber:'****1234',creditLimit:50000,availableCredit:35000,outstandingAmount:15000,monthlySpend:8500,issuer:'Bank A'},
{cardId:'CC002',cardName:'Gold Cashback',cardNumber:'****5678',creditLimit:30000,availableCredit:22000,outstandingAmount:8000,monthlySpend:4200,issuer:'Bank B'},
{cardId:'CC003',cardName:'Travel Elite',cardNumber:'****9012',creditLimit:75000,availableCredit:60000,outstandingAmount:15000,monthlySpend:6300,issuer:'Bank C'}
];
return{
fetchAllCards:function(){
return $q.resolve(angular.copy(mockCards));
}
};
}]);
})();