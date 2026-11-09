/*
Test Documentation:
- Test Name: NotificationService - success notification
- Purpose: Validates that success notifications are displayed with correct styling
- Scenario: User triggers success notification
- Expected Result: Success alert is created with alert-success class
*/
/*
Test Documentation:
- Test Name: NotificationService - error notification
- Purpose: Validates that error notifications are displayed with correct styling
- Scenario: User triggers error notification
- Expected Result: Error alert is created with alert-danger class
*/
/*
Test Documentation:
- Test Name: NotificationService - info notification
- Purpose: Validates that info notifications are displayed with correct styling
- Scenario: User triggers info notification
- Expected Result: Info alert is created with alert-info class
*/
/*
Test Documentation:
- Test Name: NotificationService - warning notification
- Purpose: Validates that warning notifications are displayed with correct styling
- Scenario: User triggers warning notification
- Expected Result: Warning alert is created with alert-warning class
*/
/*
Test Documentation:
- Test Name: NotificationService - auto-dismiss after timeout
- Purpose: Validates that notifications are automatically removed after 5 seconds
- Scenario: Notification is displayed
- Expected Result: Notification is removed from DOM after 5 seconds
*/
/*
Coverage Report:
- Functions tested: success, error, info, warning, showNotification
- Scenarios covered: all notification types, auto-dismiss, DOM manipulation, styling
- Uncovered scenarios: none
*/

describe('NotificationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var NotificationService;
  var $timeout;
  var $document;
  
  beforeEach(inject(function(_NotificationService_, _$timeout_, _$document_) {
    NotificationService = _NotificationService_;
    $timeout = _$timeout_;
    $document = _$document_;
  }));
  
  afterEach(function() {
    var notifications = document.querySelectorAll('.alert');
    notifications.forEach(function(notification) {
      notification.remove();
    });
  });
  
  describe('success method', function() {
    it('should create success notification with correct class', function() {
      var message = 'Operation completed successfully';
      
      NotificationService.success(message);
      
      var notification = document.querySelector('.alert-success');
      expect(notification).toBeTruthy();
      expect(notification.innerHTML).toContain(message);
    });
    
    it('should create notification with alert-dismissible class', function() {
      NotificationService.success('Success message');
      
      var notification = document.querySelector('.alert-success');
      expect(notification.classList.contains('alert-dismissible')).toBe(true);
    });
    
    it('should include close button', function() {
      NotificationService.success('Success message');
      
      var notification = document.querySelector('.alert-success');
      var closeButton = notification.querySelector('.close');
      expect(closeButton).toBeTruthy();
      expect(closeButton.getAttribute('data-dismiss')).toBe('alert');
    });
  });
  
  describe('error method', function() {
    it('should create error notification with alert-danger class', function() {
      var message = 'An error occurred';
      
      NotificationService.error(message);
      
      var notification = document.querySelector('.alert-danger');
      expect(notification).toBeTruthy();
      expect(notification.innerHTML).toContain(message);
    });
    
    it('should display error message correctly', function() {
      var errorMessage = 'Failed to load data';
      
      NotificationService.error(errorMessage);
      
      var notification = document.querySelector('.alert-danger');
      expect(notification.textContent).toContain(errorMessage);
    });
  });
  
  describe('info method', function() {
    it('should create info notification with alert-info class', function() {
      var message = 'Information message';
      
      NotificationService.info(message);
      
      var notification = document.querySelector('.alert-info');
      expect(notification).toBeTruthy();
      expect(notification.innerHTML).toContain(message);
    });
    
    it('should display info message correctly', function() {
      var infoMessage = 'Please note this information';
      
      NotificationService.info(infoMessage);
      
      var notification = document.querySelector('.alert-info');
      expect(notification.textContent).toContain(infoMessage);
    });
  });
  
  describe('warning method', function() {
    it('should create warning notification with alert-warning class', function() {
      var message = 'Warning message';
      
      NotificationService.warning(message);
      
      var notification = document.querySelector('.alert-warning');
      expect(notification).toBeTruthy();
      expect(notification.innerHTML).toContain(message);
    });
    
    it('should display warning message correctly', function() {
      var warningMessage = 'Please be careful';
      
      NotificationService.warning(warningMessage);
      
      var notification = document.querySelector('.alert-warning');
      expect(notification.textContent).toContain(warningMessage);
    });
  });
  
  describe('notification styling', function() {
    it('should position notification fixed at top-right', function() {
      NotificationService.success('Test message');
      
      var notification = document.querySelector('.alert-success');
      expect(notification.style.position).toBe('fixed');
      expect(notification.style.top).toBe('20px');
      expect(notification.style.right).toBe('20px');
    });
    
    it('should set high z-index for notification', function() {
      NotificationService.success('Test message');
      
      var notification = document.querySelector('.alert-success');
      expect(notification.style.zIndex).toBe('9999');
    });
    
    it('should set minimum width for notification', function() {
      NotificationService.success('Test message');
      
      var notification = document.querySelector('.alert-success');
      expect(notification.style.minWidth).toBe('300px');
    });
  });
  
  describe('notification auto-dismiss', function() {
    it('should remove notification after 5 seconds', function() {
      NotificationService.success('Test message');
      
      var notification = document.querySelector('.alert-success');
      expect(notification).toBeTruthy();
      
      $timeout.flush(5000);
      
      notification = document.querySelector('.alert-success');
      expect(notification).toBeFalsy();
    });
    
    it('should not remove notification before timeout', function() {
      NotificationService.success('Test message');
      
      var notification = document.querySelector('.alert-success');
      expect(notification).toBeTruthy();
      
      $timeout.flush(3000);
      
      notification = document.querySelector('.alert-success');
      expect(notification).toBeTruthy();
    });
  });
  
  describe('multiple notifications', function() {
    it('should create multiple notifications simultaneously', function() {
      NotificationService.success('Success 1');
      NotificationService.error('Error 1');
      NotificationService.info('Info 1');
      
      var successNotification = document.querySelector('.alert-success');
      var errorNotification = document.querySelector('.alert-danger');
      var infoNotification = document.querySelector('.alert-info');
      
      expect(successNotification).toBeTruthy();
      expect(errorNotification).toBeTruthy();
      expect(infoNotification).toBeTruthy();
    });
    
    it('should remove each notification independently after timeout', function() {
      NotificationService.success('Success 1');
      
      $timeout.flush(2000);
      
      NotificationService.error('Error 1');
      
      $timeout.flush(3000);
      
      var successNotification = document.querySelector('.alert-success');
      var errorNotification = document.querySelector('.alert-danger');
      
      expect(successNotification).toBeFalsy();
      expect(errorNotification).toBeTruthy();
    });
  });
  
  describe('edge cases', function() {
    it('should handle empty message', function() {
      NotificationService.success('');
      
      var notification = document.querySelector('.alert-success');
      expect(notification).toBeTruthy();
    });
    
    it('should handle long messages', function() {
      var longMessage = 'This is a very long message that should still be displayed correctly in the notification component without breaking the layout or causing any issues';
      
      NotificationService.success(longMessage);
      
      var notification = document.querySelector('.alert-success');
      expect(notification.textContent).toContain(longMessage);
    });
    
    it('should handle special characters in message', function() {
      var specialMessage = 'Message with <special> & "characters"';
      
      NotificationService.success(specialMessage);
      
      var notification = document.querySelector('.alert-success');
      expect(notification).toBeTruthy();
    });
  });
  
  describe('service structure', function() {
    it('should be defined', function() {
      expect(NotificationService).toBeDefined();
    });
    
    it('should have success method', function() {
      expect(NotificationService.success).toBeDefined();
      expect(typeof NotificationService.success).toBe('function');
    });
    
    it('should have error method', function() {
      expect(NotificationService.error).toBeDefined();
      expect(typeof NotificationService.error).toBe('function');
    });
    
    it('should have info method', function() {
      expect(NotificationService.info).toBeDefined();
      expect(typeof NotificationService.info).toBe('function');
    });
    
    it('should have warning method', function() {
      expect(NotificationService.warning).toBeDefined();
      expect(typeof NotificationService.warning).toBe('function');
    });
  });
});