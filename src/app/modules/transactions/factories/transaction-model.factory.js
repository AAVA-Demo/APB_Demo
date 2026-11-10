(function(){
'use strict';
angular.module('creditCard.transactions').factory('TransactionModelFactory',[function(){
function Transaction(data){
this.transactionId=data.transactionId||'';
this.date=new Date(data.date);
this.amount=parseFloat(data.amount)||0;
this.merchant=data.merchant||'';
this.category=data.category||'';
this.cardId=data.cardId||'';
this.cardName=data.cardName||'';
this.status=data.status||'posted';
}
return{create:function(data){return new Transaction(data);}};
}]);
})();