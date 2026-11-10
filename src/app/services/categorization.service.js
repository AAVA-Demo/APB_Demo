(function(){
'use strict';
angular.module('creditCardApp').service('CategorizationService',['ApiService','$q',function(ApiService,$q){
var self=this;
self.getCategories=function(){
return ApiService.get('/api/categories').then(function(categories){
return categories||['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
}).catch(function(error){
console.error('Failed to fetch categories:',error);
return['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
});
};
}]);
})();