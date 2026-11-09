(function(){'use strict';angular.module('cardManagementModule').directive('cardSummary',[function(){return{restrict:'E',scope:{card:'=',onSelect:'&'},template:'<div class="card-tile" ng-click="selectCard()">'+
'<div class="card-number">{{card.cardType}} ****{{card.cardNumber.slice(-4)}}</div>'+
'<div>Credit Limit: ${{card.creditLimit | number:2}}</div>'+
'<div>Available: ${{card.availableCredit | number:2}}</div>'+
'<div>Outstanding: ${{card.outstandingAmount | number:2}}</div>'+
'<div>Monthly Spend: ${{card.monthlySpend | number:2}}</div>'+
'</div>',link:function(scope){scope.selectCard=function(){if(scope.onSelect){scope.onSelect({cardId:scope.card.cardId});}};}};}]);})();