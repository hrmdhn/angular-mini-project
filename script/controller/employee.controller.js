var app = angular.module('app');
app.filter('beginning_data', function() {
    return function(input, begin) {
        if (input) {
            begin = +begin;
            return input.slice(begin);
        }
        return [];
    }
});

angular.module('app')
    .controller('EmployeeController', function($scope, $http, $location, $timeout) {
        var vm = this;

        // Date Picker
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [{
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
        //end Date Picker

        //function add employee
        $scope.postEmployee = function() {
            var data = {
                username: $scope.vm.username,
                firstName: $scope.vm.firstName,
                lastName: $scope.vm.lastName,
                email: $scope.vm.email,
                birthDate: $scope.dt,
                basicSalary: $scope.vm.basicSalary,
                status: $scope.vm.status,
                group: $scope.selectedGroup.name
            };
            $http.post('http://localhost/restapi/index.php/api/employee/insertData', data).then(function(response) {
                console.log(response);
                if (response.data.success) {
                    $scope.alerts = [
                        { type: 'success', msg: 'Success Add Employee.' }
                    ];
                    $timeout(function() {
                        $location.path('/');
                    }, 3000);
                }

            });
        }
        //end function add employee

        //back to employee menu
        $scope.backMenuEmployee = function() {
            $location.path('/');
        }
        //end back to employee menu

        //alert
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        //end alert

        //option group
        $scope.selectedGroup = {};
        $scope.optionGroup = [{
            "name": "Staff"
        }, {
            "name": "Sr. Staff"
        },{
            "name": "Jr. Analyst"
        },{
            "name": "Analyst"
        },{
            "name": "Sr. Analyst"
        },{
            "name": "Section Head"
        },{
            "name": "Department Head"
        },{
            "name": "Division Head"
        },{
            "name": "Advisor"
        },{
            "name": "Sr. Advisor"
        }];
        //end option group


    });