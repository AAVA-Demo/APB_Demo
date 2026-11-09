/*
Test Documentation:
- Test Name: UserService - getCurrentUser method
- Purpose: Validates retrieval of current user profile
- Scenario: Service returns current authenticated user information
- Expected Result: Promise resolves with user object containing userId, name, and email
*/
/*
Test Documentation:
- Test Name: UserService - getUserId method
- Purpose: Validates retrieval of current user ID
- Scenario: Service returns user identifier for authenticated user
- Expected Result: Returns string user ID
*/
/*
Coverage Report:
- Functions tested: getCurrentUser, getUserId
- Scenarios covered: user profile retrieval, user ID extraction, promise resolution
- Uncovered scenarios: user profile update, multiple users, user not found
*/

describe('UserService', function() {
  'use strict';
  
  var UserService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_UserService_, _$q_, _$rootScope_) {
    UserService = _UserService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCurrentUser method', function() {
    it('should return a promise', function() {
      var result = UserService.getCurrentUser();
      
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });
    
    it('should resolve with user object', function() {
      var user;
      UserService.getCurrentUser().then(function(data) {
        user = data;
      });
      
      $rootScope.$apply();
      
      expect(user).toBeDefined();
      expect(typeof user).toBe('object');
    });
    
    it('should return user with userId property', function() {
      var user;
      UserService.getCurrentUser().then(function(data) {
        user = data;
      });
      
      $rootScope.$apply();
      
      expect(user.userId).toBeDefined();
      expect(typeof user.userId).toBe('string');
      expect(user.userId).toBe('user-001');
    });
    
    it('should return user with name property', function() {
      var user;
      UserService.getCurrentUser().then(function(data) {
        user = data;
      });
      
      $rootScope.$apply();
      
      expect(user.name).toBeDefined();
      expect(typeof user.name).toBe('string');
      expect(user.name).toBe('John Doe');
    });
    
    it('should return user with email property', function() {
      var user;
      UserService.getCurrentUser().then(function(data) {
        user = data;
      });
      
      $rootScope.$apply();
      
      expect(user.email).toBeDefined();
      expect(typeof user.email).toBe('string');
      expect(user.email).toBe('john.doe@example.com');
    });
    
    it('should return complete user object with all properties', function() {
      var user;
      UserService.getCurrentUser().then(function(data) {
        user = data;
      });
      
      $rootScope.$apply();
      
      expect(user).toEqual({
        userId: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com'
      });
    });
    
    it('should return same user on multiple calls', function() {
      var user1, user2;
      
      UserService.getCurrentUser().then(function(data) {
        user1 = data;
      });
      $rootScope.$apply();
      
      UserService.getCurrentUser().then(function(data) {
        user2 = data;
      });
      $rootScope.$apply();
      
      expect(user1).toEqual(user2);
      expect(user1.userId).toBe(user2.userId);
    });
  });
  
  describe('getUserId method', function() {
    it('should return user ID as string', function() {
      var userId = UserService.getUserId();
      
      expect(userId).toBeDefined();
      expect(typeof userId).toBe('string');
    });
    
    it('should return correct user ID', function() {
      var userId = UserService.getUserId();
      
      expect(userId).toBe('user-001');
    });
    
    it('should return non-empty user ID', function() {
      var userId = UserService.getUserId();
      
      expect(userId.length).toBeGreaterThan(0);
    });
    
    it('should return same user ID on multiple calls', function() {
      var userId1 = UserService.getUserId();
      var userId2 = UserService.getUserId();
      
      expect(userId1).toBe(userId2);
    });
    
    it('should return user ID matching getCurrentUser result', function() {
      var userId = UserService.getUserId();
      var user;
      
      UserService.getCurrentUser().then(function(data) {
        user = data;
      });
      $rootScope.$apply();
      
      expect(userId).toBe(user.userId);
    });
  });
  
  describe('service initialization', function() {
    it('should be defined and injectable', function() {
      expect(UserService).toBeDefined();
    });
    
    it('should have getCurrentUser method', function() {
      expect(UserService.getCurrentUser).toBeDefined();
      expect(typeof UserService.getCurrentUser).toBe('function');
    });
    
    it('should have getUserId method', function() {
      expect(UserService.getUserId).toBeDefined();
      expect(typeof UserService.getUserId).toBe('function');
    });
  });
  
  describe('edge cases', function() {
    it('should handle synchronous getUserId calls', function() {
      var userId1 = UserService.getUserId();
      var userId2 = UserService.getUserId();
      var userId3 = UserService.getUserId();
      
      expect(userId1).toBe('user-001');
      expect(userId2).toBe('user-001');
      expect(userId3).toBe('user-001');
    });
    
    it('should handle rapid getCurrentUser calls', function() {
      var users = [];
      
      for (var i = 0; i < 5; i++) {
        UserService.getCurrentUser().then(function(data) {
          users.push(data);
        });
      }
      
      $rootScope.$apply();
      
      expect(users.length).toBe(5);
      users.forEach(function(user) {
        expect(user.userId).toBe('user-001');
      });
    });
  });
});