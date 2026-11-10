(function(){
'use strict';
angular.module('creditCardApp').factory('CategoryFilterFactory',[function(){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
return{
getCategories:function(){
return categories;
},
filterByCategory:function(data,category){
if(!category)return data;
return data.filter(function(item){
return item.category===category;
});
}
};
}]);
})();