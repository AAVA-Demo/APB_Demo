(function(){
'use strict';
angular.module('creditCardApp').directive('cardMaskDirective',[function(){
return{
restrict:'A',
link:function(scope,element,attrs){
var text=element.text();
if(text&&text.indexOf('*')>-1){
element.css({'font-family':'monospace','letter-spacing':'2px'});
}
}
};
}]);
})();