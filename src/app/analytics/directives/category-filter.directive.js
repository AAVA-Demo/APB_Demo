(function(){
'use strict';
angular.module('app.creditCard.analytics').directive('categoryFilter',categoryFilter);
function categoryFilter(){
return{
restrict:'E',
scope:{selectedCategories:'='},
template:'<div class="form-group"><label>Select Categories:</label><div class="checkbox" ng-repeat="cat in categories"><label><input type="checkbox" ng-model="selection[cat]" ng-change="updateSelection()"> {{cat}}</label></div></div>',
link:function(scope){
scope.categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
scope.selection={};
scope.categories.forEach(function(cat){
scope.selection[cat]=scope.selectedCategories.indexOf(cat)!==-1;
});
scope.updateSelection=function(){
scope.selectedCategories=[];
scope.categories.forEach(function(cat){
if(scope.selection[cat]){
scope.selectedCategories.push(cat);
}
});
};
}
};
}
})();