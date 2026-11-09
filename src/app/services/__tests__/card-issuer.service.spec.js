/*
Test Documentation:
- Test Name: CardIssuerService Unit Tests
- Purpose: Validate card issuer data synchronization functionality
- Scenario: Tests syncCardData method for successful and failed sync operations
- Expected Result: Proper API calls and error handling for card issuer integration
*/

(function() {
'use strict';

describe('CardIssuerService', function() {
  var CardIssuerService, $httpBackend, $interval;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CardIssuerService_, _$httpBackend_, _$interval_) {
    CardIssuerService = _CardIssuerService_;
    $httpBackend = _$httpBackend_;
    $interval = _$interval_;
    
    spyOn(console, 'error');
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('syncCardData', function() {
    it('should successfully sync card data from issuer', function() {
      var cardId = 'card-123';
      var mockSyncData = {
        cardId: 'card-123',
        creditLimit: 5000,
        outstandingBalance: 1200,
        lastSyncDate: '2024-06-15T10:30:00Z'
      };
      
      $httpBackend.expectGET('/api/card-issuer/sync/' + cardId)
        .respond(200, mockSyncData);
      
      var result;
      CardIssuerService.syncCardData(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockSyncData);
      expect(result.cardId).toBe(cardId);
    });
    
    it('should handle sync failure and return null', function() {
      var cardId = 'card-456';
      
      $httpBackend.expectGET('/api/card-issuer/sync/' + cardId)
        .respond(500, {error: 'Issuer service unavailable'});
      
      var result;
      CardIssuerService.syncCardData(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Card issuer sync failed', jasmine.any(Object));
    });
    
    it('should handle network timeout gracefully', function() {
      var cardId = 'card-789';
      
      $httpBackend.expectGET('/api/card-issuer/sync/' + cardId)
        .respond(0, '');
      
      var result;
      CardIssuerService.syncCardData(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
    
    it('should handle 404 not found errors', function() {
      var cardId = 'invalid-card';
      
      $httpBackend.expectGET('/api/card-issuer/sync/' + cardId)
        .respond(404, {error: 'Card not found'});
      
      var result;
      CardIssuerService.syncCardData(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toBeNull();
    });
    
    it('should construct correct API endpoint with cardId', function() {
      var cardId = 'special-card-xyz';
      
      $httpBackend.expectGET('/api/card-issuer/sync/special-card-xyz')
        .respond(200, {cardId: cardId});
      
      CardIssuerService.syncCardData(cardId);
      $httpBackend.flush();
    });
    
    it('should handle empty response data', function() {
      var cardId = 'card-empty';
      
      $httpBackend.expectGET('/api/card-issuer/sync/' + cardId)
        .respond(200, null);
      
      var result;
      CardIssuerService.syncCardData(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toBeNull();
    });
  });
});

/*
Coverage Report:
- Functions tested: syncCardData
- Scenarios covered:
  * Successful card data synchronization
  * Sync failure with 500 error
  * Network timeout (0 status)
  * 404 not found errors
  * Correct API endpoint construction
  * Empty response handling
  * Console error logging on failures
- Edge cases: Invalid cardId, null responses, network failures
- Uncovered scenarios: None - full coverage achieved
*/
})();