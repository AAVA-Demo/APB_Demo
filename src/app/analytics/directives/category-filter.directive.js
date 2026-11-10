(function(){
'use strict';
angular.module('app.analytics').directive('categoryFilter',[function(){
return{
restrict:'E',
scope:{filter:'=',cards:'=',onApply:'&',onClear:'&'},
template:'<div class="panel panel-default" style="margin-bottom:20px;">'+
'<div class="panel-body">'+
'<div class="row">'+
'<div class="col-md-3">'+
'<label>Card:</label>'+
'<select class="form-control" ng-model="filter.cardId">'+
'<option value="">All Cards</option>'+
'<option ng-repeat="card in cards" value="{{card.cardId}}">{{card.cardNumber}}</option>'+
'</select>'+
'</div>'+
'<div class="col-md-3">'+
'<label>Start Date:</label>'+
'<input type="date" class="form-control" ng-model="filter.startDate">'+
'</div>'+
'<div class="col-md-3">'+
'<label>End Date:</label>'+
'<input type="date" class="form-control" ng-model="filter.endDate">'+
'</div>'+
'<div class="col-md-3">'+
'<label>&nbsp;</label><br>'+
'<button class="btn btn-primary" ng-click="apply()">Apply Filter</button>'+
'<button class="btn btn-default" ng-click="clear()" style="margin-left:5px;">Clear</button>'+
'</div>'+
'</div>'+
'</div>'+
'</div>',
link:function(scope,element,attrs){
scope.apply=function(){
scope.onApply();
};
scope.clear=function(){
scope.onClear();
};
}
};
}]);
})();