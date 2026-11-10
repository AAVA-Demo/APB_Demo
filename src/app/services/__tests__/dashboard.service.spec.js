/*
Test Documentation:
- Test Name: DashboardService - getCardData success
- Purpose: Validates that getCardData returns card data successfully
- Scenario: Service calls ApiService.get and receives card data
- Expected Result: Returns array of card objects
*/
/*
Test Documentation:
- Test Name: DashboardService - getCardData error handling
- Purpose: Validates error handling when API call fails
- Scenario: ApiService.get rejects with error
- Expected Result: Returns rejected promise and logs error
*/
/*
Test Documentation:
- Test Name: DashboardService - getCardData with empty response
- Purpose: Validates handling of empty card list
- Scenario: API returns null or undefined
- Expected Result: Returns empty array
*/
/*
Coverage Report:
- Functions tested: getCardData
- Scenarios covered: successful data retrieval, error handling, empty response, null/undefined handling
- Uncovered scenarios: none
*/

describe('DashboardService', function() {
  'use strict';
  
  var DashboardService, ApiService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_DashboardService_, _ApiService_, _$q_, _$rootScope_) {
    DashboardService = _DashboardService_;
    ApiService = _ApiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    spyOn(console, 'error');
  }));
  
  describe('getCardData', function() {
    it('should call ApiService.get with correct endpoint', function() {
      var mockCards = [{ cardId: 'card1', cardNumber: '****1234' }];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockCards));
      
      DashboardService.getCardData();
      
      expect(ApiService.get).toHaveBeenCalledWith('/api/cards');
    });
    
    it('should return array of cards on successful API call', function(done) {
      var mockCards = [
        {
          cardId: 'card1',
          cardNumber: '****1234',
          cardType: 'Visa',
          creditLimit: 10000,
          availableCredit: 7000,
          outstandingAmount: 3000,
          monthlySpend: 1500
        },
        {
          cardId: 'card2',
          cardNumber: '****5678',
          cardType: 'Mastercard',
          creditLimit: 5000,
          availableCredit: 3000,
          outstandingAmount: 2000,
          monthlySpend: 800
        },
        {
          cardId: 'card3',
          cardNumber: '****9012',
          cardType: 'American Express',
          creditLimit: 15000,
          availableCredit: 12000,
          outstandingAmount: 3000,
          monthlySpend: 2000
        }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockCards));
      
      DashboardService.getCardData().then(function(result) {
        expect(result).toEqual(mockCards);
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('card1');
        expect(result[1].cardType).toBe('Mastercard');
        expect(result[2].creditLimit).toBe(15000);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when API returns null', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve(null));
      
      DashboardService.getCardData().then(function(result) {
        expect(result).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when API returns undefined', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve(undefined));
      
      DashboardService.getCardData().then(function(result) {
        expect(result).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when API returns empty array', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve([]));
      
      DashboardService.getCardData().then(function(result) {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle API errors and log error message', function(done) {
      var mockError = { status: 500, message: 'Internal Server Error' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));
      
      DashboardService.getCardData().catch(function(error) {
        expect(console.error).toHaveBeenCalledWith('Failed to fetch card data:', mockError);
        expect(error).toEqual(mockError);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle 404 not found errors', function(done) {
      var notFoundError = { status: 404, message: 'Cards not found' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(notFoundError));
      
      DashboardService.getCardData().catch(function(error) {
        expect(error.status).toBe(404);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle 401 unauthorized errors', function(done) {
      var authError = { status: 401, message: 'Unauthorized' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(authError));
      
      DashboardService.getCardData().catch(function(error) {
        expect(error.status).toBe(401);
        expect(console.error).toHaveBeenCalledWith('Failed to fetch card data:', authError);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle network timeout errors', function(done) {
      var timeoutError = { status: -1, message: 'Network timeout' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(timeoutError));
      
      DashboardService.getCardData().catch(function(error) {
        expect(error.status).toBe(-1);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle single card response', function(done) {
      var singleCard = [
        {
          cardId: 'card1',
          cardNumber: '****9999',
          cardType: 'Discover',
          creditLimit: 8000,
          availableCredit: 6000,
          outstandingAmount: 2000,
          monthlySpend: 1200
        }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(singleCard));
      
      DashboardService.getCardData().then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].cardType).toBe('Discover');
        expect(result[0].creditLimit).toBe(8000);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle maximum 10 cards as per NFR', function(done) {
      var tenCards = [];
      for (var i = 1; i <= 10; i++) {
        tenCards.push({
          cardId: 'card' + i,
          cardNumber: '****' + (1000 + i),
          cardType: 'Visa',
          creditLimit: 10000,
          availableCredit: 7000,
          outstandingAmount: 3000,
          monthlySpend: 1500
        });
      }
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(tenCards));
      
      DashboardService.getCardData().then(function(result) {
        expect(result.length).toBe(10);
        expect(result[0].cardId).toBe('card1');
        expect(result[9].cardId).toBe('card10');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle cards with missing optional properties', function(done) {
      var cardsWithMissingProps = [
        {
          cardId: 'card1',
          cardNumber: '****1111'
          // Missing other properties
        },
        {
          cardId: 'card2',
          cardNumber: '****2222',
          creditLimit: 5000
          // Missing other properties
        }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(cardsWithMissingProps));
      
      DashboardService.getCardData().then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card1');
        expect(result[0].cardType).toBeUndefined();
        expect(result[1].creditLimit).toBe(5000);
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle malformed response data', function(done) {
      var malformedData = { error: 'Invalid data structure' };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(malformedData));
      
      DashboardService.getCardData().then(function(result) {
        expect(result).toEqual(malformedData);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle cards with zero values', function(done) {
      var cardsWithZeros = [
        {
          cardId: 'card1',
          cardNumber: '****0000',
          creditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0,
          monthlySpend: 0
        }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(cardsWithZeros));
      
      DashboardService.getCardData().then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].creditLimit).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle cards with very large credit limits', function(done) {
      var highLimitCard = [
        {
          cardId: 'card1',
          cardNumber: '****9999',
          creditLimit: 999999,
          availableCredit: 500000,
          outstandingAmount: 499999,
          monthlySpend: 100000
        }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(highLimitCard));
      
      DashboardService.getCardData().then(function(result) {
        expect(result[0].creditLimit).toBe(999999);
        done();
      });
      
      $rootScope.$apply();
    });
  });
});