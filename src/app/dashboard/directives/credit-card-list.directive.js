(function(){'use strict';angular.module('dashboardModule').directive('creditCardList',function(){return{restrict:'E',scope:{cards:'='},template:'<div>'+
'<div ng-repeat="card in cards" class="credit-card-item">'+
'<h4>{{card.cardName}} <span class="pull-right">****{{card.lastFourDigits}}</span></h4>'+
'<p><span ng-class="{\"status-active\":card.status===\"active\",\"status-blocked\":card.status===\"blocked\"}"><i class="fa fa-circle"></i> {{card.status | uppercase}}</span></p>'+
'<div class="card-details">'+
'<span><strong>Credit Limit:</strong> ${{card.creditLimit | number:2}}</span>'+
'<span><strong>Available:</strong> ${{card.availableCredit | number:2}}</span>'+
'<span><strong>Outstanding:</strong> ${{card.outstandingBalance | number:2}}</span>'+
'</div>'+
'</div>'+
'<div ng-if="cards.length===0" class="alert alert-info">No credit cards found.</div>'+
'</div>'};});})();