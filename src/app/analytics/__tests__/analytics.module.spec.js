/*
Test Documentation:
- Test Name: analyticsModule - module definition
- Purpose: Validates that the analytics module is properly defined
- Scenario: Module is loaded
- Expected Result: Module exists and has correct dependencies
*/
/*
Coverage Report:
- Functions tested: module definition
- Scenarios covered: module existence, dependency verification
- Uncovered scenarios: none
*/

describe('analyticsModule', function() {
  'use strict';
  
  var module;
  
  beforeEach(function() {
    module = angular.module('analyticsModule');
  });
  
  it('should be defined', function() {
    expect(module).toBeDefined();
  });
  
  it('should have ui.bootstrap as a dependency', function() {
    expect(module.requires).toContain('ui.bootstrap');
  });
});