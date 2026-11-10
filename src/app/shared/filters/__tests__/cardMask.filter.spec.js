/*
Test Documentation:
- Test Name: cardMask filter - Mask Valid Card Number
- Purpose: Verify filter masks card number showing only last 4 digits
- Scenario: Valid 16-digit card number
- Expected Result: Returns masked format with last 4 digits
*/
/*
Test Documentation:
- Test Name: cardMask filter - Handle Invalid Input
- Purpose: Verify filter handles invalid or short card numbers
- Scenario: Card number with less than 4 digits
- Expected Result: Returns default mask
*/
/*
Test Documentation:
- Test Name: cardMask filter - Handle Null/Undefined
- Purpose: Verify filter handles null or undefined input
- Scenario: No card number provided
- Expected Result: Returns default mask
*/
/*
Coverage Report:
- Functions tested: cardMask filter
- Scenarios covered: valid input, invalid input, null/undefined
- Uncovered scenarios: none
*/

describe('cardMask filter', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var cardMaskFilter;
  
  beforeEach(inject(function($filter) {
    cardMaskFilter = $filter('cardMask');
  }));
  
  it('should mask card number showing only last 4 digits', function() {
    var cardNumber = '4111111111111234';
    var result = cardMaskFilter(cardNumber);
    
    expect(result).toBe('**** **** **** 1234');
  });
  
  it('should handle different card number lengths', function() {
    var cardNumber = '340000000009012';
    var result = cardMaskFilter(cardNumber);
    
    expect(result).toBe('**** **** **** 9012');
  });
  
  it('should return default mask for short card numbers', function() {
    var cardNumber = '123';
    var result = cardMaskFilter(cardNumber);
    
    expect(result).toBe('****');
  });
  
  it('should return default mask for null input', function() {
    var result = cardMaskFilter(null);
    expect(result).toBe('****');
  });
  
  it('should return default mask for undefined input', function() {
    var result = cardMaskFilter(undefined);
    expect(result).toBe('****');
  });
  
  it('should return default mask for empty string', function() {
    var result = cardMaskFilter('');
    expect(result).toBe('****');
  });
});