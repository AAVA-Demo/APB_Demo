(function(){
'use strict';
angular.module('creditCardApp').service('CategoryService',[function(){
const categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
this.getCategories=function(){
return categories;
};
this.isValidCategory=function(category){
return categories.indexOf(category)!==-1;
};
}]);
})();