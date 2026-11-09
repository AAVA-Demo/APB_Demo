(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('ApiFactory', ['$http', '$q', function($http, $q) {
      var baseUrl = '/api';
      var authToken = 'mock-auth-token-12345';

      function getHeaders() {
        return {
          'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json'
        };
      }

      function handleError(error) {
        console.error('API Error:', error);
        return $q.reject(error);
      }

      return {
        get: function(endpoint) {
          return $http({
            method: 'GET',
            url: baseUrl + endpoint,
            headers: getHeaders()
          }).then(function(response) {
            return response.data;
          }).catch(handleError);
        },
        post: function(endpoint, data) {
          return $http({
            method: 'POST',
            url: baseUrl + endpoint,
            headers: getHeaders(),
            data: data
          }).then(function(response) {
            return response.data;
          }).catch(handleError);
        },
        put: function(endpoint, data) {
          return $http({
            method: 'PUT',
            url: baseUrl + endpoint,
            headers: getHeaders(),
            data: data
          }).then(function(response) {
            return response.data;
          }).catch(handleError);
        },
        delete: function(endpoint) {
          return $http({
            method: 'DELETE',
            url: baseUrl + endpoint,
            headers: getHeaders()
          }).then(function(response) {
            return response.data;
          }).catch(handleError);
        }
      };
    }])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
        return {
          request: function(config) {
            if (config.url.indexOf('/api/') !== -1 && !config.headers.Authorization) {
              config.headers.Authorization = 'Bearer mock-auth-token-12345';
            }
            return config;
          },
          responseError: function(rejection) {
            if (rejection.status === 401) {
              console.error('Unauthorized access');
            } else if (rejection.status >= 500) {
              console.error('Server error:', rejection.status);
            }
            return $q.reject(rejection);
          },
          response: function(response) {
            if (response.config.url.indexOf('/api/') !== -1 && response.config.method === 'GET') {
              if (!response.data || response.data.error) {
                return $q.reject(response);
              }
            }
            return response;
          }
        };
      }]);
    }]);
})();