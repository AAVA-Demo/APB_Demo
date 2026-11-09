(function(){
'use strict';
angular.module('creditCard.management').directive('cardTile',function(){
return{
restrict:'E',
scope:{
card:'=',
onSelect:'&'
},
templateUrl:'src/app/modules/card-management/views/card-tile.template.html'
};
});
})();