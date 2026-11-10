(function(){
'use strict';
angular.module('creditCardApp').service('CategoryService',[function(){
var self=this;
self.categories=[
{categoryId:'food',categoryName:'Food & Dining',icon:'fa-cutlery',color:'#FF6384'},
{categoryId:'fuel',categoryName:'Fuel',icon:'fa-car',color:'#36A2EB'},
{categoryId:'shopping',categoryName:'Shopping',icon:'fa-shopping-cart',color:'#FFCE56'},
{categoryId:'travel',categoryName:'Travel',icon:'fa-plane',color:'#4BC0C0'},
{categoryId:'entertainment',categoryName:'Entertainment',icon:'fa-film',color:'#9966FF'},
{categoryId:'utilities',categoryName:'Utilities',icon:'fa-bolt',color:'#FF9F40'},
{categoryId:'healthcare',categoryName:'Healthcare',icon:'fa-heartbeat',color:'#FF6384'},
{categoryId:'education',categoryName:'Education',icon:'fa-graduation-cap',color:'#C9CBCF'},
{categoryId:'miscellaneous',categoryName:'Miscellaneous',icon:'fa-ellipsis-h',color:'#4BC0C0'}
];
self.getCategories=function(){
return self.categories;
};
self.getCategoryByName=function(name){
return self.categories.find(function(c){return c.categoryName===name;});
};
self.getCategoryColor=function(name){
var cat=self.getCategoryByName(name);
return cat?cat.color:'#CCCCCC';
};
}]);
})();