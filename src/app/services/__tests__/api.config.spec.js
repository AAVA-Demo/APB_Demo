/*
Test Documentation:
- Test Name: API Configuration Constant
- Purpose: Validates that the API_BASE_URL constant is correctly defined and accessible
- Scenario: Verify API_BASE_URL constant value
- Expected Result: Constant should be defined with value '/api'
*/

(function() {
  'use strict';

  describe('API Configuration', function() {
    var API_BASE_URL;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_API_BASE_URL_) {
      API_BASE_URL = _API_BASE_URL_;
    }));

    /*
    Test Documentation:
    - Test Name: API_BASE_URL constant should be defined
    - Purpose: Ensures the API_BASE_URL constant exists
    - Scenario: Inject and check constant definition
    - Expected Result: API_BASE_URL should be defined
    */
    it('should define API_BASE_URL constant', function() {
      expect(API_BASE_URL).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: API_BASE_URL should have correct value
    - Purpose: Validates the API base URL path
    - Scenario: Check constant value matches expected '/api'
    - Expected Result: API_BASE_URL equals '/api'
    */
    it('should have API_BASE_URL set to "/api"', function() {
      expect(API_BASE_URL).toBe('/api');
    });

    /*
    Test Documentation:
    - Test Name: API_BASE_URL should be a string
    - Purpose: Validates data type of the constant
    - Scenario: Check typeof API_BASE_URL
    - Expected Result: API_BASE_URL is of type string
    */
    it('should be a string type', function() {
      expect(typeof API_BASE_URL).toBe('string');
    });

    /*
    Test Documentation:
    - Test Name: API_BASE_URL should not be empty
    - Purpose: Ensures the constant has a value
    - Scenario: Check string length is greater than 0
    - Expected Result: API_BASE_URL.length > 0
    */
    it('should not be an empty string', function() {
      expect(API_BASE_URL.length).toBeGreaterThan(0);
    });
  });

})();

/*
Coverage Report:
- Module tested: creditCardApp
- Constant tested: API_BASE_URL
- Functions tested: N/A (constant only)
- Scenarios covered:
  1. Constant definition check
  2. Value validation
  3. Type validation
  4. Non-empty validation
- Uncovered scenarios: None (constant has no behavior)
- Edge cases: N/A for constants
- Error scenarios: N/A for constants
*/