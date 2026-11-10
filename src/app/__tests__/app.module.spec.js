/*
Test Documentation:
- Test Name: creditCardApp - module definition
- Purpose: Validates that the main application module is properly defined
- Scenario: Module is loaded
- Expected Result: Module exists and has correct dependencies
*/
/*
Coverage Report:
- Functions tested: module definition
- Scenarios covered: module existence, dependency verification
- Uncovered scenarios: none
*/

describe('creditCardApp', function() {
  'use strict';
  
  var module;
  
  beforeEach(function() {
    module = angular.module('creditCardApp');
  });
  
  it('should be defined', function() {
    expect(module).toBeDefined();
  });
  
  it('should have required dependencies', function() {
    expect(module.requires).toContain('ngRoute');
    expect(module.requires).toContain('ui.bootstrap');
    expect(module.requires).toContain('dashboardModule');
    expect(module.requires).toContain('transactionModule');
    expect(module.requires).toContain('analyticsModule');
  });
});