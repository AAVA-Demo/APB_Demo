def validate_status_code(actual_status, expected_status):
    assert actual_status == expected_status, f'Expected {expected_status}, got {actual_status}'
