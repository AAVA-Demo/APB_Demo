(function(){'use strict';angular.module('cardManagementModule').directive('cardFilter',function(){return{restrict:'E',scope:{filterCriteria:'=',onApply:'&'},template:'<div class="filter-section">'+
'<div class="row">'+
'<div class="col-md-3">'+
'<label>Status</label>'+
'<select class="form-control" ng-model="filterCriteria.status">'+
'<option value="">All</option>'+
'<option value="Active">Active</option>'+
'<option value="Blocked">Blocked</option>'+
'</select>'+
'</div>'+
'<div class="col-md-3">'+
'<label>Min Balance</label>'+
'<input type="number" class="form-control" ng-model="filterCriteria.minBalance" placeholder="Min">'+
'</div>'+
'<div class="col-md-3">'+
'<label>Max Balance</label>'+
'<input type="number" class="form-control" ng-model="filterCriteria.maxBalance" placeholder="Max">'+
'</div>'+
'<div class="col-md-3">'+
'<label>&nbsp;</label>'+
'<button class="btn btn-primary btn-block" ng-click="onApply()">Apply Filter</button>'+
'</div>'+
'</div>'+
'</div>',link:function(scope,element,attrs){}}};});})();