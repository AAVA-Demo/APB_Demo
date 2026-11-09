(function(){
'use strict';
angular.module('creditCardApp').factory('ErrorInterceptor',['$q','$injector',function($q,$injector){
return{responseError:function(rejection){
var toastr=$injector.get('$window').alert;
if(rejection.status===401){
toastr('Authentication failed. Please login again.');
}else if(rejection.status===500){
toastr('Server error. Please try again later.');
}else{
toastr('An error occurred: '+rejection.statusText);
}
console.error('HTTP Error:',rejection);
return $q.reject(rejection);
}};
}]);
})();