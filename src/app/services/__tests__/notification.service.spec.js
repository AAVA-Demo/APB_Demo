/*
Test Documentation:
- Test Name: NotificationService - success
- Purpose: Validates success notification display
- Scenario: Success message is triggered
- Expected Result: Alert displays with SUCCESS prefix
*/
/*
Test Documentation:
- Test Name: NotificationService - error
- Purpose: Validates error notification display
- Scenario: Error message is triggered
- Expected Result: Alert displays with ERROR prefix
*/
/*
Test Documentation:
- Test Name: NotificationService - info
- Purpose: Validates info notification display
- Scenario: Info message is triggered
- Expected Result: Alert displays with INFO prefix
*/
/*
Coverage Report:
- Functions tested: success, error, info
- Scenarios covered: success notifications, error notifications, info notifications, empty messages, special characters
- Edge cases: null messages, undefined messages, empty strings, long messages, special characters
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('NotificationService', function() {
    var NotificationService, $window;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_NotificationService_, _$window_) {
      NotificationService = _NotificationService_;
      $window = _$window_;
      
      // Spy on window.alert
      spyOn($window, 'alert');
    }));

    describe('success', function() {
      it('should display success message with SUCCESS prefix', function() {
        var message = 'Operation completed successfully';
        
        NotificationService.success(message);
        
        expect($window.alert).toHaveBeenCalledWith('SUCCESS: ' + message);
      });

      it('should handle empty string message', function() {
        NotificationService.success('');
        
        expect($window.alert).toHaveBeenCalledWith('SUCCESS: ');
      });

      it('should handle null message', function() {
        NotificationService.success(null);
        
        expect($window.alert).toHaveBeenCalledWith('SUCCESS: null');
      });

      it('should handle undefined message', function() {
        NotificationService.success(undefined);
        
        expect($window.alert).toHaveBeenCalledWith('SUCCESS: undefined');
      });

      it('should handle message with special characters', function() {
        var message = 'Success! @#$%^&*() <script>alert("test")</script>';
        
        NotificationService.success(message);
        
        expect($window.alert).toHaveBeenCalledWith('SUCCESS: ' + message);
      });

      it('should handle very long message', function() {
        var longMessage = new Array(1000).join('a');
        
        NotificationService.success(longMessage);
        
        expect($window.alert).toHaveBeenCalledWith('SUCCESS: ' + longMessage);
      });

      it('should handle message with line breaks', function() {
        var message = 'Line 1\nLine 2\nLine 3';
        
        NotificationService.success(message);
        
        expect($window.alert).toHaveBeenCalledWith('SUCCESS: ' + message);
      });

      it('should be called only once per invocation', function() {
        NotificationService.success('test');
        
        expect($window.alert).toHaveBeenCalledTimes(1);
      });
    });

    describe('error', function() {
      it('should display error message with ERROR prefix', function() {
        var message = 'Operation failed';
        
        NotificationService.error(message);
        
        expect($window.alert).toHaveBeenCalledWith('ERROR: ' + message);
      });

      it('should handle empty string message', function() {
        NotificationService.error('');
        
        expect($window.alert).toHaveBeenCalledWith('ERROR: ');
      });

      it('should handle null message', function() {
        NotificationService.error(null);
        
        expect($window.alert).toHaveBeenCalledWith('ERROR: null');
      });

      it('should handle undefined message', function() {
        NotificationService.error(undefined);
        
        expect($window.alert).toHaveBeenCalledWith('ERROR: undefined');
      });

      it('should handle message with special characters', function() {
        var message = 'Error! @#$%^&*() <script>alert("test")</script>';
        
        NotificationService.error(message);
        
        expect($window.alert).toHaveBeenCalledWith('ERROR: ' + message);
      });

      it('should handle HTTP error messages', function() {
        var message = 'HTTP 500: Internal Server Error';
        
        NotificationService.error(message);
        
        expect($window.alert).toHaveBeenCalledWith('ERROR: ' + message);
      });

      it('should handle JSON error objects as strings', function() {
        var errorObj = { code: 500, message: 'Server error' };
        
        NotificationService.error(errorObj);
        
        expect($window.alert).toHaveBeenCalledWith('ERROR: ' + errorObj);
      });

      it('should be called only once per invocation', function() {
        NotificationService.error('test error');
        
        expect($window.alert).toHaveBeenCalledTimes(1);
      });
    });

    describe('info', function() {
      it('should display info message with INFO prefix', function() {
        var message = 'Information message';
        
        NotificationService.info(message);
        
        expect($window.alert).toHaveBeenCalledWith('INFO: ' + message);
      });

      it('should handle empty string message', function() {
        NotificationService.info('');
        
        expect($window.alert).toHaveBeenCalledWith('INFO: ');
      });

      it('should handle null message', function() {
        NotificationService.info(null);
        
        expect($window.alert).toHaveBeenCalledWith('INFO: null');
      });

      it('should handle undefined message', function() {
        NotificationService.info(undefined);
        
        expect($window.alert).toHaveBeenCalledWith('INFO: undefined');
      });

      it('should handle message with special characters', function() {
        var message = 'Info! @#$%^&*() <script>alert("test")</script>';
        
        NotificationService.info(message);
        
        expect($window.alert).toHaveBeenCalledWith('INFO: ' + message);
      });

      it('should handle numeric messages', function() {
        NotificationService.info(12345);
        
        expect($window.alert).toHaveBeenCalledWith('INFO: 12345');
      });

      it('should handle boolean messages', function() {
        NotificationService.info(true);
        
        expect($window.alert).toHaveBeenCalledWith('INFO: true');
      });

      it('should be called only once per invocation', function() {
        NotificationService.info('test info');
        
        expect($window.alert).toHaveBeenCalledTimes(1);
      });
    });

    describe('integration scenarios', function() {
      it('should handle multiple notification types in sequence', function() {
        NotificationService.success('Success message');
        NotificationService.error('Error message');
        NotificationService.info('Info message');
        
        expect($window.alert).toHaveBeenCalledTimes(3);
        expect($window.alert.calls.argsFor(0)).toEqual(['SUCCESS: Success message']);
        expect($window.alert.calls.argsFor(1)).toEqual(['ERROR: Error message']);
        expect($window.alert.calls.argsFor(2)).toEqual(['INFO: Info message']);
      });

      it('should handle rapid successive calls of same type', function() {
        NotificationService.success('Message 1');
        NotificationService.success('Message 2');
        NotificationService.success('Message 3');
        
        expect($window.alert).toHaveBeenCalledTimes(3);
      });

      it('should not interfere with each other when called alternately', function() {
        NotificationService.success('Success 1');
        NotificationService.error('Error 1');
        NotificationService.success('Success 2');
        NotificationService.info('Info 1');
        
        expect($window.alert).toHaveBeenCalledTimes(4);
        expect($window.alert.calls.argsFor(0)).toEqual(['SUCCESS: Success 1']);
        expect($window.alert.calls.argsFor(1)).toEqual(['ERROR: Error 1']);
        expect($window.alert.calls.argsFor(2)).toEqual(['SUCCESS: Success 2']);
        expect($window.alert.calls.argsFor(3)).toEqual(['INFO: Info 1']);
      });

      it('should maintain correct prefix for each notification type', function() {
        var testMessage = 'Test message';
        
        NotificationService.success(testMessage);
        expect($window.alert.calls.mostRecent().args[0]).toContain('SUCCESS:');
        
        NotificationService.error(testMessage);
        expect($window.alert.calls.mostRecent().args[0]).toContain('ERROR:');
        
        NotificationService.info(testMessage);
        expect($window.alert.calls.mostRecent().args[0]).toContain('INFO:');
      });
    });

    describe('edge cases', function() {
      it('should handle message with only whitespace', function() {
        var message = '   ';
        
        NotificationService.success(message);
        
        expect($window.alert).toHaveBeenCalledWith('SUCCESS: ' + message);
      });

      it('should handle message with tabs and newlines', function() {
        var message = '\t\n\r';
        
        NotificationService.error(message);
        
        expect($window.alert).toHaveBeenCalledWith('ERROR: ' + message);
      });

      it('should handle Unicode characters', function() {
        var message = '✓ Success 你好 مرحبا';
        
        NotificationService.info(message);
        
        expect($window.alert).toHaveBeenCalledWith('INFO: ' + message);
      });

      it('should handle HTML entities', function() {
        var message = '&lt;div&gt;Test&lt;/div&gt;';
        
        NotificationService.success(message);
        
        expect($window.alert).toHaveBeenCalledWith('SUCCESS: ' + message);
      });
    });
  });
})();