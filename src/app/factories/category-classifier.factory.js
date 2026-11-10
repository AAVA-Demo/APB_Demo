(function(){
'use strict';
angular.module('creditCardApp')
.factory('CategoryClassifierFactory',[function(){
var categoryMap=new Map([
['Food & Dining','Food & Dining'],
['Fuel','Fuel'],
['Shopping','Shopping'],
['Travel','Travel'],
['Entertainment','Entertainment'],
['Utilities','Utilities'],
['Healthcare','Healthcare'],
['Education','Education'],
['Miscellaneous','Miscellaneous']
]);
return{
classify:function(transaction){
if(transaction.category&&categoryMap.has(transaction.category)){
return transaction.category;
}
return'Miscellaneous';
}
};
}]);
})();