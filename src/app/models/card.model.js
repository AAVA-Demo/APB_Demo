(function(){
'use strict';
function Card(data){
this.cardId=data.cardId||'';
this.cardName=data.cardName||'';
this.creditLimit=data.creditLimit||0;
this.availableCredit=data.availableCredit||0;
this.outstandingAmount=data.outstandingAmount||0;
this.monthlySpend=data.monthlySpend||0;
}
if(typeof module!=='undefined'&&module.exports){
module.exports=Card;
}
})();