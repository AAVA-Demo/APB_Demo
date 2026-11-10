(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$window', function($window) {
    const STORAGE_KEY = 'cc_user_id';
    const TOKEN_KEY = 'cc_auth_token';
    this.getUserId = function() {
      return $window.localStorage.getItem(STORAGE_KEY);
    };
    this.setUserId = function(userId) {
      $window.localStorage.setItem(STORAGE_KEY, userId);
    };
    this.getToken = function() {
      return $window.localStorage.getItem(TOKEN_KEY) || 'mock-jwt-token';
    };
    this.setToken = function(token) {
      $window.localStorage.setItem(TOKEN_KEY, token);
    };
    this.isAuthenticated = function() {
      return !!this.getUserId();
    };
  }]);
})();