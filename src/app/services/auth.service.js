(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$window',function($window){
const TOKEN_KEY='cc_auth_token';
this.authenticate=function(){
const token='mock_jwt_token_'+Date.now();
$window.sessionStorage.setItem(TOKEN_KEY,token);
};
this.isAuthenticated=function(){
return!!$window.sessionStorage.getItem(TOKEN_KEY);
};
this.getToken=function(){
return $window.sessionStorage.getItem(TOKEN_KEY);
};
this.getAuthHeaders=function(){
const token=this.getToken();
return token?{'Authorization':'Bearer '+token}:{};
};
this.logout=function(){
$window.sessionStorage.removeItem(TOKEN_KEY);
};
}]);
})();