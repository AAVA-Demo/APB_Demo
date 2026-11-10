(function(){'use strict';angular.module('analyticsModule').directive('dateRangeFilter',function(){return{restrict:'E',scope:{dateRange:'=',onApply:'&'},template:'<div class="filter-section">'+
'<div class="row">'+
'<div class="col-md-4">'+
'<label>Start Date</label>'+
'<input type="date" class="form-control" ng-model="dateRange.startDate">'+
'</div>'+
'<div class="col-md-4">'+
'<label>End Date</label>'+
'<input type="date" class="form-control" ng-model="dateRange.endDate">'+
'</div>'+
'<div class="col-md-4">'+
'<label>&nbsp;</label>'+
'<button class="btn btn-primary btn-block" ng-click="onApply()">Apply Filter</button>'+
'</div>'+
'</div>'+
'</div>',link:function(scope,element,attrs){}}};});})();