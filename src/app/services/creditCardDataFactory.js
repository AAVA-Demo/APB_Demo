(function(){
'use strict';
angular.module('creditCardApp').factory('creditCardDataFactory',['$http','$q',function($http,$q){
const BASE_URL='/api/creditcards';
const mockCards=[{id:'1',cardNumber:'****1234',cardHolderName:'John Doe',cardType:'Visa',expiryDate:'12/25',creditLimit:50000,currentBalance:15000,availableCredit:35000,outstandingAmount:15000,status:'Active'},{id:'2',cardNumber:'****5678',cardHolderName:'John Doe',cardType:'MasterCard',expiryDate:'06/26',creditLimit:30000,currentBalance:8000,availableCredit:22000,outstandingAmount:8000,status:'Active'},{id:'3',cardNumber:'****9012',cardHolderName:'John Doe',cardType:'Visa',expiryDate:'09/24',creditLimit:20000,currentBalance:5000,availableCredit:15000,outstandingAmount:5000,status:'Active'}];
return{
fetchCards:function(){
const deferred=$q.defer();
setTimeout(()=>deferred.resolve(mockCards),300);
return deferred.promise;
},
fetchCardById:function(cardId){
const deferred=$q.defer();
const card=mockCards.find(c=>c.id===cardId);
setTimeout(()=>card?deferred.resolve(card):deferred.reject('Card not found'),200);
return deferred.promise;
}
};
}]);
})();