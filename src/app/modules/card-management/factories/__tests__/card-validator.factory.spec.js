/*
Test Documentation:
- Test Name: CardValidatorFactory validation logic
- Purpose: Validates card number, expiry date, and required field validation
- Scenario: Test validation functions with valid and invalid inputs
- Expected Result: Factory should correctly validate card data and return appropriate messages
*/
/*
Coverage Report:
- Functions tested: validateCardNumber, validateExpiryDate, validateRequiredFields
- Scenarios covered: valid inputs, invalid inputs, missing fields, format validation
- Dependencies mocked: none (pure factory)
- Uncovered scenarios: none
*/

describe('CardValidatorFactory', function() {
  'use strict';
  
  beforeEach(module('creditCard.management'));
  
  var factory;
  
  beforeEach(inject(function(_CardValidatorFactory_) {
    factory = _CardValidatorFactory_;
  }));
  
  it('should be defined', function() {
    expect(factory).toBeDefined();
  });
  
  it('should have all validation methods', function() {
    expect(factory.validateCardNumber).toBeDefined();
    expect(factory.validateExpiryDate).toBeDefined();
    expect(factory.validateRequiredFields).toBeDefined();
  });
  
  it('should validate valid card number', function() {
    var result = factory.validateCardNumber('1234');
    
    expect(result.valid).toBe(true);
  });
  
  it('should reject invalid card number', function() {
    var result = factory.validateCardNumber('123');
    
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Invalid card number');
  });
  
  it('should reject null card number', function() {
    var result = factory.validateCardNumber(null);
    
    expect(result.valid).toBe(false);
  });
  
  it('should validate valid expiry date', function() {
    var result = factory.validateExpiryDate('12/25');
    
    expect(result.valid).toBe(true);
  });
  
  it('should reject invalid expiry date format', function() {
    var result = factory.validateExpiryDate('13/25');
    
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Invalid expiry date format (MM/YY)');
  });
  
  it('should reject expiry date with wrong format', function() {
    var result = factory.validateExpiryDate('12-25');
    
    expect(result.valid).toBe(false);
  });
  
  it('should validate card data with all required fields', function() {
    var cardData = {
      cardHolderName: 'John Doe',
      bankName: 'HDFC Bank',
      cardType: 'Visa',
      creditLimit: 50000
    };
    
    var result = factory.validateRequiredFields(cardData);
    
    expect(result.valid).toBe(true);
  });
  
  it('should reject card data with missing cardHolderName', function() {
    var cardData = {
      bankName: 'HDFC Bank',
      cardType: 'Visa',
      creditLimit: 50000
    };
    
    var result = factory.validateRequiredFields(cardData);
    
    expect(result.valid).toBe(false);
    expect(result.message).toBe('cardHolderName is required');
  });
  
  it('should reject card data with missing bankName', function() {
    var cardData = {
      cardHolderName: 'John Doe',
      cardType: 'Visa',
      creditLimit: 50000
    };
    
    var result = factory.validateRequiredFields(cardData);
    
    expect(result.valid).toBe(false);
    expect(result.message).toBe('bankName is required');
  });
});