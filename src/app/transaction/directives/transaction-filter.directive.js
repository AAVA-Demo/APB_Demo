(function(){'use strict';angular.module('transactionModule').directive('transactionFilter',function(){return{restrict:'E',scope:{filters:'=',cards:'=',onApply:'&',onClear:'&'},template:'<div class="transaction-filter">'+
'<h4>Filter Transactions</h4>'+
'<div class="row">'+
'<div class="col-md-3">'+
'<div class="form-group">'+
'<label>Start Date</label>'+
'<input type="date" class="form-control" ng-model="filters.startDate">'+
'</div>'+
'</div>'+
'<div class="col-md-3">'+
'<div class="form-group">'+
'<label>End Date</label>'+
'<input type="date" class="form-control" ng-model="filters.endDate">'+
'</div>'+
'</div>'+
'<div class="col-md-3">'+
'<div class="form-group">'+
'<label>Min Amount</label>'+
'<input type="number" class="form-control" ng-model="filters.minAmount" placeholder="0.00">'+
'</div>'+
'</div>'+
'<div class="col-md-3">'+
'<div class="form-group">'+
'<label>Max Amount</label>'+
'<input type="number" class="form-control" ng-model="filters.maxAmount" placeholder="0.00">'+
'</div>'+
'</div>'+
'</div>'+
'<div class="row">'+
'<div class="col-md-6">'+
'<div class="form-group">'+
'<label>Credit Card</label>'+
'<select class="form-control" ng-model="selectedCard" ng-change="updateCardFilter()">'+
'<option value="">All Cards</option>'+
'<option ng-repeat="card in cards" value="{{card.cardId}}">{{card.cardName}} (****{{card.lastFourDigits}})</option>'+
'</select>'+
'</div>'+
'</div>'+
'<div class="col-md-6">'+
'<div class="form-group">'+
'<label>&nbsp;</label><br>'+
'<button class="btn btn-primary" ng-click="onApply()"><i class="fa fa-check"></i> Apply Filters</button>'+
'<button class="btn btn-default" ng-click="onClear()" style="margin-left:10px;"><i class="fa fa-times"></i> Clear</button>'+
'</div>'+
'</div>'+
'</div>'+
'</div>',link:function(scope){scope.selectedCard='';scope.updateCardFilter=function(){if(scope.selectedCard){scope.filters.cardIds=[scope.selectedCard];}else{scope.filters.cardIds=[];}};}};});})();