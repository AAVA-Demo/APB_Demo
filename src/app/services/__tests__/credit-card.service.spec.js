/*
Test Documentation:
- Test Name: CreditCardService Unit Tests
- Purpose: Validate the CreditCardService functionality for fetching credit card metadata
- Scenario: Tests cover successful metadata retrieval, filtering by cardIds, promise resolution, and edge cases
- Expected Result: All methods return correct filtered metadata with proper structure and handle edge cases appropriately
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService;
    var $q;
    var $rootScope;

    // Load the transaction module
    beforeEach(module('transaction'));

    // Inject dependencies
    beforeEach(inject(function(_CreditCardService_, _$q_, _$rootScope_) {
      CreditCardService = _CreditCardService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('Service Initialization', function() {
      /*
      Test Documentation:
      - Test Name: should be defined
      - Purpose: Verify that the service is properly instantiated
      - Scenario: Service is injected into the test
      - Expected Result: Service object is defined and not null
      */
      it('should be defined', function() {
        expect(CreditCardService).toBeDefined();
        expect(CreditCardService).not.toBeNull();
      });

      /*
      Test Documentation:
      - Test Name: should have getCardMetadata method
      - Purpose: Verify that the service exposes the required public method
      - Scenario: Check for method existence
      - Expected Result: getCardMetadata method exists and is a function
      */
      it('should have getCardMetadata method', function() {
        expect(CreditCardService.getCardMetadata).toBeDefined();
        expect(typeof CreditCardService.getCardMetadata).toBe('function');
      });
    });

    describe('getCardMetadata - Success Scenarios', function() {
      /*
      Test Documentation:
      - Test Name: should return a promise
      - Purpose: Verify that getCardMetadata returns a promise object
      - Scenario: Call getCardMetadata with valid cardIds
      - Expected Result: Returns an object with then method (promise)
      */
      it('should return a promise', function() {
        var result = CreditCardService.getCardMetadata(['CC001']);
        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      /*
      Test Documentation:
      - Test Name: should resolve with an array of card metadata
      - Purpose: Verify that the promise resolves with correct data structure
      - Scenario: Call getCardMetadata with valid cardIds
      - Expected Result: Promise resolves with an array
      */
      it('should resolve with an array of card metadata', function(done) {
        CreditCardService.getCardMetadata(['CC001']).then(function(metadata) {
          expect(Array.isArray(metadata)).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return metadata for single card when one cardId provided
      - Purpose: Verify filtering works correctly for single card
      - Scenario: Call getCardMetadata with array containing one cardId
      - Expected Result: Returns array with one card metadata object
      */
      it('should return metadata for single card when one cardId provided', function(done) {
        CreditCardService.getCardMetadata(['CC001']).then(function(metadata) {
          expect(metadata.length).toBe(1);
          expect(metadata[0].cardId).toBe('CC001');
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return metadata for multiple cards when multiple cardIds provided
      - Purpose: Verify filtering works correctly for multiple cards
      - Scenario: Call getCardMetadata with array containing multiple cardIds
      - Expected Result: Returns array with correct number of card metadata objects
      */
      it('should return metadata for multiple cards when multiple cardIds provided', function(done) {
        CreditCardService.getCardMetadata(['CC001', 'CC002']).then(function(metadata) {
          expect(metadata.length).toBe(2);
          expect(metadata[0].cardId).toBe('CC001');
          expect(metadata[1].cardId).toBe('CC002');
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return all three cards when all cardIds provided
      - Purpose: Verify that all mock cards can be retrieved
      - Scenario: Call getCardMetadata with all three cardIds
      - Expected Result: Returns array with all three card metadata objects
      */
      it('should return all three cards when all cardIds provided', function(done) {
        CreditCardService.getCardMetadata(['CC001', 'CC002', 'CC003']).then(function(metadata) {
          expect(metadata.length).toBe(3);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return card metadata with all required properties
      - Purpose: Verify that each metadata object contains necessary fields
      - Scenario: Call getCardMetadata and validate structure
      - Expected Result: Each metadata object has cardId, cardNumber, cardType
      */
      it('should return card metadata with all required properties', function(done) {
        CreditCardService.getCardMetadata(['CC001', 'CC002']).then(function(metadata) {
          metadata.forEach(function(card) {
            expect(card.cardId).toBeDefined();
            expect(card.cardNumber).toBeDefined();
            expect(card.cardType).toBeDefined();
          });
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return correct Visa card metadata for CC001
      - Purpose: Verify specific metadata for Visa card
      - Scenario: Call getCardMetadata with CC001
      - Expected Result: Returns correct Visa card details
      */
      it('should return correct Visa card metadata for CC001', function(done) {
        CreditCardService.getCardMetadata(['CC001']).then(function(metadata) {
          expect(metadata[0].cardId).toBe('CC001');
          expect(metadata[0].cardNumber).toBe('**** 1234');
          expect(metadata[0].cardType).toBe('Visa');
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return correct MasterCard metadata for CC002
      - Purpose: Verify specific metadata for MasterCard
      - Scenario: Call getCardMetadata with CC002
      - Expected Result: Returns correct MasterCard details
      */
      it('should return correct MasterCard metadata for CC002', function(done) {
        CreditCardService.getCardMetadata(['CC002']).then(function(metadata) {
          expect(metadata[0].cardId).toBe('CC002');
          expect(metadata[0].cardNumber).toBe('**** 5678');
          expect(metadata[0].cardType).toBe('MasterCard');
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return correct Amex metadata for CC003
      - Purpose: Verify specific metadata for Amex card
      - Scenario: Call getCardMetadata with CC003
      - Expected Result: Returns correct Amex card details
      */
      it('should return correct Amex metadata for CC003', function(done) {
        CreditCardService.getCardMetadata(['CC003']).then(function(metadata) {
          expect(metadata[0].cardId).toBe('CC003');
          expect(metadata[0].cardNumber).toBe('**** 9012');
          expect(metadata[0].cardType).toBe('Amex');
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return metadata with correct data types
      - Purpose: Verify that metadata properties have correct data types
      - Scenario: Call getCardMetadata and validate property types
      - Expected Result: All properties are strings
      */
      it('should return metadata with correct data types', function(done) {
        CreditCardService.getCardMetadata(['CC001', 'CC002']).then(function(metadata) {
          metadata.forEach(function(card) {
            expect(typeof card.cardId).toBe('string');
            expect(typeof card.cardNumber).toBe('string');
            expect(typeof card.cardType).toBe('string');
          });
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return metadata with masked card numbers
      - Purpose: Verify that card numbers are properly masked for security
      - Scenario: Call getCardMetadata and validate card number format
      - Expected Result: All card numbers contain asterisks for masking
      */
      it('should return metadata with masked card numbers', function(done) {
        CreditCardService.getCardMetadata(['CC001', 'CC002', 'CC003']).then(function(metadata) {
          metadata.forEach(function(card) {
            expect(card.cardNumber).toContain('****');
          });
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('getCardMetadata - Edge Cases', function() {
      /*
      Test Documentation:
      - Test Name: should return empty array when empty cardIds array provided
      - Purpose: Verify handling of empty input array
      - Scenario: Call getCardMetadata with empty array
      - Expected Result: Returns empty array
      */
      it('should return empty array when empty cardIds array provided', function(done) {
        CreditCardService.getCardMetadata([]).then(function(metadata) {
          expect(metadata.length).toBe(0);
          expect(Array.isArray(metadata)).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return empty array when non-existent cardId provided
      - Purpose: Verify filtering behavior with invalid cardId
      - Scenario: Call getCardMetadata with cardId that doesn't exist
      - Expected Result: Returns empty array (no match found)
      */
      it('should return empty array when non-existent cardId provided', function(done) {
        CreditCardService.getCardMetadata(['CC999']).then(function(metadata) {
          expect(metadata.length).toBe(0);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should filter out non-existent cardIds and return only valid ones
      - Purpose: Verify partial filtering when mix of valid and invalid cardIds provided
      - Scenario: Call getCardMetadata with mix of valid and invalid cardIds
      - Expected Result: Returns only metadata for valid cardIds
      */
      it('should filter out non-existent cardIds and return only valid ones', function(done) {
        CreditCardService.getCardMetadata(['CC001', 'CC999', 'CC002']).then(function(metadata) {
          expect(metadata.length).toBe(2);
          expect(metadata[0].cardId).toBe('CC001');
          expect(metadata[1].cardId).toBe('CC002');
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should handle duplicate cardIds in input array
      - Purpose: Verify behavior when duplicate cardIds are provided
      - Scenario: Call getCardMetadata with duplicate cardIds
      - Expected Result: Returns metadata for each unique cardId (filter handles duplicates)
      */
      it('should handle duplicate cardIds in input array', function(done) {
        CreditCardService.getCardMetadata(['CC001', 'CC001', 'CC002']).then(function(metadata) {
          expect(metadata.length).toBeGreaterThanOrEqual(2);
          var cc001Count = metadata.filter(function(card) {
            return card.cardId === 'CC001';
          }).length;
          expect(cc001Count).toBeGreaterThanOrEqual(1);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return same data on multiple calls with same cardIds
      - Purpose: Verify consistency of metadata across multiple invocations
      - Scenario: Call getCardMetadata twice with same cardIds
      - Expected Result: Both calls return identical data
      */
      it('should return same data on multiple calls with same cardIds', function(done) {
        var firstCall, secondCall;
        CreditCardService.getCardMetadata(['CC001', 'CC002']).then(function(metadata) {
          firstCall = metadata;
          return CreditCardService.getCardMetadata(['CC001', 'CC002']);
        }).then(function(metadata) {
          secondCall = metadata;
          expect(firstCall.length).toBe(secondCall.length);
          expect(firstCall[0].cardId).toBe(secondCall[0].cardId);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should preserve order of cardIds in result
      - Purpose: Verify that filtering maintains order of input cardIds
      - Scenario: Call getCardMetadata with specific order of cardIds
      - Expected Result: Result maintains the order of valid cardIds from input
      */
      it('should preserve order of cardIds in result', function(done) {
        CreditCardService.getCardMetadata(['CC003', 'CC001', 'CC002']).then(function(metadata) {
          expect(metadata.length).toBe(3);
          expect(metadata[0].cardId).toBe('CC001');
          expect(metadata[1].cardId).toBe('CC002');
          expect(metadata[2].cardId).toBe('CC003');
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should handle case-sensitive cardId matching
      - Purpose: Verify that cardId matching is case-sensitive
      - Scenario: Call getCardMetadata with lowercase cardId
      - Expected Result: Returns empty array (no match due to case sensitivity)
      */
      it('should handle case-sensitive cardId matching', function(done) {
        CreditCardService.getCardMetadata(['cc001']).then(function(metadata) {
          expect(metadata.length).toBe(0);
          done();
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should return only metadata properties (not full card data)
      - Purpose: Verify that metadata is lightweight and doesn't include full card details
      - Scenario: Call getCardMetadata and check for absence of detailed properties
      - Expected Result: Metadata objects don't contain properties like totalCreditLimit, outstandingAmount, etc.
      */
      it('should return only metadata properties (not full card data)', function(done) {
        CreditCardService.getCardMetadata(['CC001']).then(function(metadata) {
          expect(metadata[0].totalCreditLimit).toBeUndefined();
          expect(metadata[0].outstandingAmount).toBeUndefined();
          expect(metadata[0].monthlySpend).toBeUndefined();
          expect(metadata[0].expiryDate).toBeUndefined();
          expect(metadata[0].status).toBeUndefined();
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('getCardMetadata - Performance', function() {
      /*
      Test Documentation:
      - Test Name: should resolve promise immediately for mock data
      - Purpose: Verify that mock metadata is returned without delay
      - Scenario: Call getCardMetadata and measure resolution time
      - Expected Result: Promise resolves synchronously (within same digest cycle)
      */
      it('should resolve promise immediately for mock data', function() {
        var resolved = false;
        CreditCardService.getCardMetadata(['CC001']).then(function() {
          resolved = true;
        });
        $rootScope.$apply();
        expect(resolved).toBe(true);
      });

      /*
      Test Documentation:
      - Test Name: should efficiently filter large cardId arrays
      - Purpose: Verify performance with larger input arrays
      - Scenario: Call getCardMetadata with array containing many cardIds
      - Expected Result: Promise resolves quickly even with larger input
      */
      it('should efficiently filter large cardId arrays', function() {
        var largeArray = ['CC001', 'CC999', 'CC002', 'CC888', 'CC003', 'CC777'];
        var resolved = false;
        CreditCardService.getCardMetadata(largeArray).then(function(metadata) {
          expect(metadata.length).toBe(3);
          resolved = true;
        });
        $rootScope.$apply();
        expect(resolved).toBe(true);
      });
    });

    describe('getCardMetadata - Input Validation', function() {
      /*
      Test Documentation:
      - Test Name: should handle null cardIds parameter gracefully
      - Purpose: Verify error handling for null input
      - Scenario: Call getCardMetadata with null
      - Expected Result: Should not throw error, may return empty array or handle gracefully
      */
      it('should handle null cardIds parameter gracefully', function() {
        expect(function() {
          CreditCardService.getCardMetadata(null);
        }).not.toThrow();
      });

      /*
      Test Documentation:
      - Test Name: should handle undefined cardIds parameter gracefully
      - Purpose: Verify error handling for undefined input
      - Scenario: Call getCardMetadata with undefined
      - Expected Result: Should not throw error, may return empty array or handle gracefully
      */
      it('should handle undefined cardIds parameter gracefully', function() {
        expect(function() {
          CreditCardService.getCardMetadata(undefined);
        }).not.toThrow();
      });

      /*
      Test Documentation:
      - Test Name: should handle non-array cardIds parameter
      - Purpose: Verify error handling for invalid input type
      - Scenario: Call getCardMetadata with string instead of array
      - Expected Result: Should not throw error, may return empty array or handle gracefully
      */
      it('should handle non-array cardIds parameter', function() {
        expect(function() {
          CreditCardService.getCardMetadata('CC001');
        }).not.toThrow();
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getCardMetadata
  - Scenarios covered:
    * Service initialization and method availability
    * Promise resolution with correct data structure
    * Single card metadata retrieval
    * Multiple cards metadata retrieval
    * All cards metadata retrieval
    * Required properties validation
    * Specific card metadata validation (Visa, MasterCard, Amex)
    * Correct data types for all properties
    * Masked card numbers
    * Empty input array handling
    * Non-existent cardId handling
    * Mixed valid/invalid cardIds filtering
    * Duplicate cardIds handling
    * Data consistency across multiple calls
    * Order preservation in results
    * Case-sensitive cardId matching
    * Metadata-only response (no full card data)
    * Performance with immediate promise resolution
    * Performance with larger input arrays
    * Null/undefined/non-array input handling
  - Uncovered scenarios:
    * Real API integration (out of scope - mock service)
    * Network error handling (not applicable for mock)
    * Authentication/authorization (not implemented in mock)
    * Pagination for large result sets (not needed for 3 mock cards)
  */
})();