/*
Test Documentation:
- Test Name: CategorizationService Unit Tests
- Purpose: Validate category mappings retrieval with API integration and default fallback
- Scenario: Tests cover successful API calls, error handling, and default category list fallback
- Expected Result: Category mappings are retrieved correctly from API or default list
*/

(function() {
  'use strict';

  describe('CategorizationService', function() {
    var CategorizationService, $httpBackend, $rootScope, AuthService;

    beforeEach(module('app.analytics'));

    beforeEach(function() {
      AuthService = {
        isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
        getToken: jasmine.createSpy('getToken').and.returnValue('test-token')
      };
      
      module(function($provide) {
        $provide.value('AuthService', AuthService);
      });
    });

    beforeEach(inject(function(_CategorizationService_, _$httpBackend_, _$rootScope_) {
      CategorizationService = _CategorizationService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCategoryMappings', function() {
      it('should retrieve categories from API successfully', function() {
        var mockResponse = ['Food & Dining', 'Fuel', 'Shopping', 'Travel'];
        
        $httpBackend.expectGET('/api/categories').respond(200, mockResponse);
        
        var result;
        CategorizationService.getCategoryMappings().then(function(categories) {
          result = categories;
        });
        
        $httpBackend.flush();
        
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(4);
      });

      it('should return default categories when API returns empty data', function() {
        $httpBackend.expectGET('/api/categories').respond(200, null);
        
        var result;
        CategorizationService.getCategoryMappings().then(function(categories) {
          result = categories;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBe(9);
        expect(result).toContain('Food & Dining');
        expect(result).toContain('Miscellaneous');
      });

      it('should fallback to default categories on API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/categories').respond(500, 'Server Error');
        
        var result;
        CategorizationService.getCategoryMappings().then(function(categories) {
          result = categories;
        });
        
        $httpBackend.flush();
        
        expect(console.error).toHaveBeenCalledWith('Error fetching categories:', jasmine.any(Object));
        expect(result).toBeDefined();
        expect(result.length).toBe(9);
      });

      it('should return all nine default categories', function() {
        $httpBackend.expectGET('/api/categories').respond(200, null);
        
        var result;
        CategorizationService.getCategoryMappings().then(function(categories) {
          result = categories;
        });
        
        $httpBackend.flush();
        
        var expectedCategories = [
          'Food & Dining',
          'Fuel',
          'Shopping',
          'Travel',
          'Entertainment',
          'Utilities',
          'Healthcare',
          'Education',
          'Miscellaneous'
        ];
        
        expectedCategories.forEach(function(cat) {
          expect(result).toContain(cat);
        });
      });

      it('should handle 404 error gracefully', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/categories').respond(404, 'Not Found');
        
        var result;
        CategorizationService.getCategoryMappings().then(function(categories) {
          result = categories;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBe(9);
      });

      it('should handle network timeout', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/categories').respond(-1, '');
        
        var result;
        CategorizationService.getCategoryMappings().then(function(categories) {
          result = categories;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCategoryMappings
- Scenarios covered:
  * Successful API retrieval
  * Empty API response with default fallback
  * API error with default fallback
  * All nine default categories validation
  * 404 error handling
  * Network timeout handling
- Uncovered scenarios: None - all category retrieval paths tested
- Edge cases: Empty response, server errors, 404 errors, network failures
*/