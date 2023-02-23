Feature:User is booking tickets
    Scenario: Should book one seat
        Given user is on page "http://qamid.tmweb.ru/client/index.php"
        When user chooses day 5
            And user chooses hall 1 and seance 3
            And user chooses row 5 and seat 9 to book
            And user confirms the choice
            And user accepts the order
        Then user sees e-ticket

    Scenario: User decided not to book the seats
        Given user is on page "http://qamid.tmweb.ru/client/index.php"
        When user chooses day 2
            And user chooses hall 1 and seance 1
            And user chooses row 3 and seat 3
            And user cancelled the booking seat 3 in row 3
            And user went back to the previous page
        Then the seat 3 at row 3 hall 1 seance 1 day 2 must be available for booking 

        Scenario: User clicked on disabled button
            Given user is on page "http://qamid.tmweb.ru/client/index.php"
            When user clicks on the button with expired time on it
            Then button is disabled
