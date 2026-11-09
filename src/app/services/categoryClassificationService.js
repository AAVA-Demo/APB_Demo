(function(){
'use strict';
angular.module('creditCardApp').service('categoryClassificationService',[function(){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
this.categorize=function(transaction){
if(!transaction.category||categories.indexOf(transaction.category)===-1){
return'Miscellaneous';
}
return transaction.category;
};
}]);
})();