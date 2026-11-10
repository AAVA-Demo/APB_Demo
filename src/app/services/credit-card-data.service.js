(function(){
'use strict';
angular.module('creditCardApp').factory('CreditCardDataService',['$http','API_ENDPOINTS','$q',function($http,API_ENDPOINTS,$q){
return{getAllCards:function(){
var deferred=$q.defer();
$http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.cards).then(function(response){
var cards=response.data.cards||[];
var totalLimit=cards.reduce(function(sum,card){return sum+(card.creditLimit||0);},0);
var totalOutstanding=cards.reduce(function(sum,card){return sum+(card.currentBalance||0);},0);
deferred.resolve({cards:cards,totalCreditLimit:totalLimit,totalOutstanding:totalOutstanding});},function(error){
console.error('Error fetching cards:',error);
deferred.reject(error);});
return deferred.promise;}};
}]);
})();