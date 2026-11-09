/*
Test Documentation:
- Test Name: CreditCardDataFactory Unit Tests
- Purpose: Validate credit card data retrieval from API
- Scenario: Test fetchAllCards with successful response, error handling, and parameter passing
- Expected Result: Correct API calls with proper error handling
*/

describe('CreditCardDataFactory', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var CreditCardDataFactory, $httpBackend;
  var mockCardsResponse;
  
  beforeEach(inject(function(_CreditCardDataFactory_, _$httpBackend_) {
    CreditCardDataFactory = _CreditCardDataFactory_;
    $httpBackend = _$httpBackend_;
    
    mockCardsResponse = [
      { id: 'card1', cardName: 'Visa Gold', creditLimit: 5000 },
      { id: 'card2', cardName: 'Mastercard', creditLimit: 10000 }
    ];
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchAllCards', function() {
    it('should fetch all cards for a given userId', function() {
      $httpBackend.expectGET('/api/cards?userId=user123').respond(200, mockCardsResponse);
      
      CreditCardDataFactory.fetchAllCards('user123').then(function(cards) {
        expect(cards).toEqual(mockCardsResponse);
        expect(cards.length).toBe(2);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle API errors correctly', function() {
      $httpBackend.expectGET('/api/cards?userId=user123').respond(500, 'Server Error');
      
      CreditCardDataFactory.fetchAllCards('user123').catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle network errors', function() {
      $httpBackend.expectGET('/api/cards?userId=user123').respond(0, '');
      
      CreditCardDataFactory.fetchAllCards('user123').catch(function(error) {
        expect(error.status).toBe(0);
      });
      
      $httpBackend.flush();
    });
    
    it('should pass userId as query parameter', function() {
      $httpBackend.expectGET('/api/cards?userId=testUser').respond(200, []);
      
      CreditCardDataFactory.fetchAllCards('testUser');
      
      $httpBackend.flush();
    });
    
    it('should handle empty response array', function() {
      $httpBackend.expectGET('/api/cards?userId=user123').respond(200, []);
      
      CreditCardDataFactory.fetchAllCards('user123').then(function(cards) {
        expect(cards).toEqual([]);
        expect(cards.length).toBe(0);
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: fetchAllCards
- Scenarios covered:
  * Successful API response with multiple cards
  * Server error handling (500)
  * Network error handling
  * Correct parameter passing
  * Empty response handling
- Edge cases: Empty array, network failures, server errors
- Uncovered scenarios: Authentication errors, rate limiting, pagination
*/