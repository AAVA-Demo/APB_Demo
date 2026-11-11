/*
Test Documentation:
- Test Name: CardService - Card Data Management
- Purpose: Validate card retrieval and creation operations
- Scenario: Test getAllCards, getCardById, createCard with success and error scenarios
- Expected Result: Cards fetched and created successfully, errors handled properly
*/

describe('CardService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.cardManagement'));
  
  var CardService, $httpBackend, API_CONFIG;
  var mockCards = [
    {cardId: '1', cardNumber: '**** 1234', issuer: 'Visa', status: 'active'},
    {cardId: '2', cardNumber: '**** 5678', issuer: 'MasterCard', status: 'active'}
  ];
  var mockCard = {
    cardId: '1',
    cardNumber: '**** 1234',
    cardHolderName: 'John Doe',
    issuer: 'Visa',
    expiryDate: '12/25',
    status: 'active',
    creditLimit: 5000,
    availableCredit: 3500,
    outstandingAmount: 1500
  };
  
  beforeEach(inject(function(_CardService_, _$httpBackend_, _API_CONFIG_) {
    CardService = _CardService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getAllCards', function() {
    it('should fetch all cards successfully', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, mockCards);
      
      var result;
      CardService.getAllCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
    });
    
    it('should handle empty card list', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, []);
      
      var result;
      CardService.getAllCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual([]);
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(500, {error: 'Server Error'});
      
      var error;
      CardService.getAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });
  
  describe('getCardById', function() {
    it('should fetch card by ID successfully', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/1')
        .respond(200, mockCard);
      
      var result;
      CardService.getCardById('1').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockCard);
      expect(result.cardId).toBe('1');
    });
    
    it('should handle card not found', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/999')
        .respond(404, {error: 'Card not found'});
      
      var error;
      CardService.getCardById('999').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/1')
        .respond(500, {error: 'Server Error'});
      
      var error;
      CardService.getCardById('1').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });
  
  describe('createCard', function() {
    it('should create card successfully', function() {
      var newCard = {
        cardNumber: '4111111111111111',
        cardHolderName: 'Jane Smith',
        issuer: 'Visa',
        expiryDate: '06/26',
        creditLimit: 7500
      };
      
      var createdCard = Object.assign({cardId: '3', status: 'active'}, newCard);
      
      $httpBackend.expectPOST(API_CONFIG.baseUrl + '/cards', newCard)
        .respond(201, createdCard);
      
      var result;
      CardService.createCard(newCard).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(createdCard);
      expect(result.cardId).toBe('3');
    });
    
    it('should handle validation error', function() {
      var invalidCard = {
        cardNumber: 'invalid'
      };
      
      $httpBackend.expectPOST(API_CONFIG.baseUrl + '/cards', invalidCard)
        .respond(400, {error: 'Invalid card data'});
      
      var error;
      CardService.createCard(invalidCard).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
    
    it('should handle API error', function() {
      var newCard = {cardNumber: '4111111111111111'};
      
      $httpBackend.expectPOST(API_CONFIG.baseUrl + '/cards', newCard)
        .respond(500, {error: 'Server Error'});
      
      var error;
      CardService.createCard(newCard).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: getAllCards, getCardById, createCard
- Scenarios covered: successful operations, empty results, not found errors, validation errors, server errors
- Edge cases: empty card list, invalid card ID, invalid card data, API failures
- Uncovered scenarios: none
*/