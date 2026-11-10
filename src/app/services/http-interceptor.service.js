(function(){
'use strict';
angular.module('creditCardApp').factory('HttpInterceptorService',['$q','AuthService',function($q,AuthService){
return{
request:function(config){
var token=AuthService.getToken();
if(token){
config.headers=config.headers||{};
config.headers.Authorization='Bearer '+token;
}
return config;
},
responseError:function(rejection){
if(rejection.status===401){
toastr.error('Authentication failed. Please login again.');
AuthService.logout();
}else if(rejection.status>=500){
toastr.error('Server error. Please try again later.');
}else if(rejection.status===0){
toastr.error('Network error. Please check your connection.');
}else{
toastr.error('An error occurred: '+(rejection.data?.message||'Unknown error'));
}
return $q.reject(rejection);
}
};
}]);
})();