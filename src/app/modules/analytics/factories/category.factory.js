(function(){
'use strict';
angular.module('creditCard.analytics').factory('CategoryFactory',[function(){
var categories=[{id:'food',name:'Food & Dining',color:'#FF6384'},{id:'fuel',name:'Fuel',color:'#36A2EB'},{id:'shopping',name:'Shopping',color:'#FFCE56'},{id:'travel',name:'Travel',color:'#4BC0C0'},{id:'entertainment',name:'Entertainment',color:'#9966FF'},{id:'utilities',name:'Utilities',color:'#FF9F40'},{id:'healthcare',name:'Healthcare',color:'#E7E9ED'},{id:'education',name:'Education',color:'#C9CBCF'},{id:'misc',name:'Miscellaneous',color:'#8E8E8E'}];
return{
getCategories:function(){
return categories;
},getCategoryColor:function(categoryName){
var cat=categories.find(function(c){
return c.name===categoryName;
});
return cat?cat.color:'#8E8E8E';
}
};
}]);
})();