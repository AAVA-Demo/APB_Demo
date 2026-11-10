(function(){
'use strict';
angular.module('dashboardModule').factory('CreditCardDataFactory',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
return{fetchCreditCards:function(userId){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/creditcards',{params:{userId:userId},timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);
},function(error){
if(error.status===-1){
var mockData=[{cardId:'card-001',cardNumber:'4111111111111111',cardLast4:'1111',cardType:'Visa',creditLimit:10000,currentBalance:3500,availableCredit:6500,outstandingAmount:3500,monthlySpend:1200},{cardId:'card-002',cardNumber:'5500000000000004',cardLast4:'0004',cardType:'MasterCard',creditLimit:15000,currentBalance:5000,availableCredit:10000,outstandingAmount:5000,monthlySpend:1800}];
deferred.resolve(mockData);
}else{
deferred.reject(error);}
});
return deferred.promise;
}};
}]);
})();