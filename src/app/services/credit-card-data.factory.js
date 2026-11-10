(function(){
'use strict';
angular.module('creditCardApp').factory('CreditCardDataFactory',CreditCardDataFactory);
CreditCardDataFactory.$inject=['$resource','API_ENDPOINT'];
function CreditCardDataFactory($resource,API_ENDPOINT){
return $resource(API_ENDPOINT+'/cards/:userId',{userId:'@userId'},{fetchCards:{method:'GET',isArray:true,interceptor:{response:function(response){
return response.data||[{cardId:'CC001',cardNumber:'**** 1234',cardType:'Visa',totalCreditLimit:50000,outstandingAmount:15000,monthlySpend:8000},{cardId:'CC002',cardNumber:'**** 5678',cardType:'Mastercard',totalCreditLimit:30000,outstandingAmount:5000,monthlySpend:3500},{cardId:'CC003',cardNumber:'**** 9012',cardType:'Amex',totalCreditLimit:70000,outstandingAmount:25000,monthlySpend:12000}];
}}}});
}
})();