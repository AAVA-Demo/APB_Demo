/*
Test Documentation:
- Test Name: CardService - getUserCards success
- Purpose: Validates that getUserCards returns user's credit cards successfully
- Scenario: Service calls ApiService.get and receives card data
- Expected Result: Returns array of card objects
*/
/*
Test Documentation:
- Test Name: CardService - getUserCards error handling
- Purpose: Validates error handling when API call fails
- Scenario: ApiService.get rejects with error
- Expected Result: Returns rejected promise and logs error
*/
/*
Test Documentation:
- Test Name: CardService - getUserCards with empty response
- Purpose: Validates handling of empty card list
- Scenario: API returns null or undefined
- Expected Result: Returns empty array
*/
/*
Coverage Report:
- Functions tested: getUserCards
- Scenarios covered: successful data retrieval, error handling, empty response, null/undefined handling
- Uncovered scenarios: none
*/

describe('CardService', function() {
  'use strict';
  
  var CardService, ApiService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CardService_, _ApiService_, _$q_, _$rootScope_) {
    CardService = _CardService_;
    ApiService = _ApiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    spyOn(console, 'error');
  }));
  
  describe('getUserCards', function() {
    it('should call ApiService.get with correct endpoint', function() {
      var mockCards = [{ cardId: 'card1', cardNumber: '****1234' }];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockCards));
      
      CardService.getUserCards();
      
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
        }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockCards));
      
      CardService.getUserCards().then(function(result) {
        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card1');
        expect(result[1].cardType).toBe('Mastercard');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when API returns null', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve(null));
      
      CardService.getUserCards().then(function(result) {
        expect(result).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when API returns undefined', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve(undefined));
      
      CardService.getUserCards().then(function(result) {
        expect(result).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when API returns empty array', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve([]));
      
      CardService.getUserCards().then(function(result) {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle API errors and log error message', function(done) {
      var mockError = { status: 500, message: 'Internal Server Error' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));
      
      CardService.getUserCards().catch(function(error) {
        expect(console.error).toHaveBeenCalledWith('Failed to fetch user cards:', mockError);
        expect(error).toEqual(mockError);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle 404 not found errors', function(done) {
      var notFoundError = { status: 404, message: 'Cards not found' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(notFoundError));
      
      CardService.getUserCards().catch(function(error) {
        expect(error.status).toBe(404);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle 401 unauthorized errors', function(done) {
      var authError = { status: 401, message: 'Unauthorized' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(authError));
      
      CardService.getUserCards().catch(function(error) {
        expect(error.status).toBe(401);
        expect(console.error).toHaveBeenCalledWith('Failed to fetch user cards:', authError);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle network timeout errors', function(done) {
      var timeoutError = { status: -1, message: 'Network timeout' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(timeoutError));
      
      CardService.getUserCards().catch(function(error) {
        expect(error.status).toBe(-1);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return single card in array', function(done) {
      var singleCard = [
        {
          cardId: 'card1',
          cardNumber: '****9999',
          cardType: 'American Express',
          creditLimit: 20000,
          availableCredit: 15000,
          outstandingAmount: 5000,
          monthlySpend: 3000
        }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(singleCard));
      
      CardService.getUserCards().then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].cardType).toBe('American Express');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle cards with missing optional properties', function(done) {
      var cardsWithMissingProps = [
        {
          cardId: 'card1',
          cardNumber: '****1111'
          // Missing cardType, creditLimit, etc.
        }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(cardsWithMissingProps));
      
      CardService.getUserCards().then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('card1');
        expect(result[0].cardType).toBeUndefined();
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle malformed response data', function(done) {
      var malformedData = { error: 'Invalid data structure' };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(malformedData));
      
      CardService.getUserCards().then(function(result) {
        expect(result).toEqual(malformedData);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle very large card arrays', function(done) {
      var largeCardArray = [];
      for (var i = 0; i < 100; i++) {
        largeCardArray.push({
          cardId: 'card' + i,
          cardNumber: '****' + i,
          creditLimit: 10000
        });
      }
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(largeCardArray));
      
      CardService.getUserCards().then(function(result) {
        expect(result.length).toBe(100);
        expect(result[0].cardId).toBe('card0');
        expect(result[99].cardId).toBe('card99');
        done();
      });
      
      $rootScope.$apply();
    });
  });
});