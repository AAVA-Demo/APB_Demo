(function(){
'use strict';
angular.module('creditCard.transactions').factory('TransactionFactory',[function(){
return{
formatDate:function(date){
if(!date)return'';
var d=new Date(date);
return(d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
},formatCurrency:function(amount){
if(!amount)return'$0.00';
return'$'+amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g,'$&,');
},getStatusClass:function(status){
var classes={posted:'label-success',pending:'label-warning',declined:'label-danger'};
return classes[status]||'label-default';
}
};
}]);
})();