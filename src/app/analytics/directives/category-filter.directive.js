(function(){'use strict';angular.module('analyticsModule').directive('categoryFilter',function(){return{restrict:'E',scope:{categories:'=',selectedCategories:'=',onChange:'&'},template:'<div class="form-group">'+
'<label>Categories</label>'+
'<div ng-repeat="category in categories" class="checkbox">'+
'<label><input type="checkbox" ng-model="categorySelection[category]" ng-change="updateSelection()"> {{category}}</label>'+
'</div>'+
'</div>',link:function(scope){scope.categorySelection={};scope.categories.forEach(function(cat){scope.categorySelection[cat]=scope.selectedCategories.indexOf(cat)!==-1;});scope.updateSelection=function(){scope.selectedCategories=[];for(var cat in scope.categorySelection){if(scope.categorySelection[cat]){scope.selectedCategories.push(cat);}}if(scope.selectedCategories.length===0){scope.selectedCategories=['all'];scope.categorySelection['all']=true;}scope.onChange();};}};});})();