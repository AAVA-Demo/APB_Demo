(function() {
  'use strict';
  angular.module('creditCard.management')
    .factory('CardValidatorFactory', [CardValidatorFactory]);
  function CardValidatorFactory() {
    return {
      validateCardNumber: validateCardNumber,
      validateExpiryDate: validateExpiryDate,
      validateRequiredFields: validateRequiredFields
    };
    function validateCardNumber(cardNumber) {
      if (!cardNumber || cardNumber.length < 4) {
        return { valid: false, message: 'Invalid card number' };
      }
      return { valid: true };
    }
    function validateExpiryDate(expiryDate) {
      const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!regex.test(expiryDate)) {
        return { valid: false, message: 'Invalid expiry date format (MM/YY)' };
      }
      return { valid: true };
    }
    function validateRequiredFields(cardData) {
      const required = ['cardHolderName', 'bankName', 'cardType', 'creditLimit'];
      for (let i = 0; i < required.length; i++) {
        if (!cardData[required[i]]) {
          return { valid: false, message: required[i] + ' is required' };
        }
      }
      return { valid: true };
    }
  }
})();