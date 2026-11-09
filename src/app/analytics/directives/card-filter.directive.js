(function(){'use strict';angular.module('analyticsModule').directive('cardFilter',function(){return{restrict:'E',scope:{cards:'=',selectedCards:'=',onChange:'&'},template:'<div class="form-group">'+
'<label>Credit Cards</label>'+
'<div ng-repeat="card in cards" class="checkbox">'+
'<label><input type="checkbox" ng-model="cardSelection[card.cardId]" ng-change="updateSelection()"> {{card.cardName}} (****{{card.lastFourDigits}})</label>'+
'</div>'+
'</div>',link:function(scope){scope.cardSelection={};scope.$watch('cards',function(cards){if(cards&&cards.length>0){cards.forEach(function(card){scope.cardSelection[card.cardId]=scope.selectedCards.indexOf(card.cardId)!==-1;});}});scope.updateSelection=function(){scope.selectedCards=[];for(var cardId in scope.cardSelection){if(scope.cardSelection[cardId]){scope.selectedCards.push(cardId);}}scope.onChange();};}};});})();