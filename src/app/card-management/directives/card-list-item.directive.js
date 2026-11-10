(function(){
'use strict';
angular.module('cardManagementModule').directive('cardListItem',[function(){
return{restrict:'E',scope:{card:'='},template:'<div class="panel panel-default card-list-item"><div class="panel-body"><h4>{{card.cardHolderName}}</h4><p><strong>Card:</strong> {{card.cardNumber}}</p><p><strong>Issuer:</strong> {{card.issuer}}</p><p><strong>Credit Limit:</strong> ${{card.creditLimit | number:2}}</p><p><strong>Current Balance:</strong> ${{card.currentBalance | number:2}}</p><p><strong>Available:</strong> ${{card.availableBalance | number:2}}</p><a href="#/cards/{{card.cardId}}" class="btn btn-primary btn-sm">View Details</a></div></div>'};
}]);
})();