(function(){
'use strict';
angular.module('dashboardModule').factory('CardFactory',[function(){
return{
createCard:function(data){
return angular.extend({cardId:'',userId:'',cardNumber:'',cardType:'',creditLimit:0,availableCredit:0,outstandingAmount:0,monthlySpend:0,lastUpdated:new Date()},data);
}
};
}]);
})();