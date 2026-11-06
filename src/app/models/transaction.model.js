(function(){
'use strict';
function Transaction(data){
this.transactionId=data.transactionId||'';
this.cardId=data.cardId||'';
this.date=data.date?new Date(data.date):new Date();
this.amount=data.amount||0;
this.category=data.category||'';
this.description=data.description||'';
}
if(typeof module!=='undefined'&&module.exports){
module.exports=Transaction;
}
})();