(function(){
'use strict';
angular.module('creditCardApp').filter('categoryName',function(){
const categoryMap={'FOOD':'Food & Dining','FUEL':'Fuel','SHOPPING':'Shopping','TRAVEL':'Travel','ENTERTAINMENT':'Entertainment','UTILITIES':'Utilities','HEALTHCARE':'Healthcare','EDUCATION':'Education','MISC':'Miscellaneous'};
return function(input){
return categoryMap[input]||input;
};
});
})();