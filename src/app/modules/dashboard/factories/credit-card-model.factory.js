(function(){
'use strict';
angular.module('creditCard.dashboard').factory('CreditCardModelFactory',[function(){
function CreditCard(data){
this.cardId=data.cardId||'';
this.cardName=data.cardName||'';
this.cardType=data.cardType||'';
this.creditLimit=parseFloat(data.creditLimit)||0;
this.currentBalance=parseFloat(data.currentBalance)||0;
this.availableCredit=this.creditLimit-this.currentBalance;
this.monthlySpend=parseFloat(data.monthlySpend)||0;
this.outstandingAmount=parseFloat(data.outstandingAmount)||0;
}
return{create:function(data){return new CreditCard(data);}};
}]);
})();