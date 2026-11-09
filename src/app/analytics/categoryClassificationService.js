(function(){
'use strict';
angular.module('creditCardApp').service('categoryClassificationService',[function(){
const self=this;
const validCategories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
self.classifyTransactions=function(transactions){
return transactions.map(t=>{
if(!validCategories.includes(t.category)){
t.category='Miscellaneous';
}
return t;
});
};
}]);
})();