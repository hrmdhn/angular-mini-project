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
    .controller('HomeController', function($scope, $timeout, $http, $window, $uibModal, $log,$location) {

        $scope.addEmployee = function(){
            $location.path('/employee');
        }

        $scope.getDataEmployee = function() {
            $http.post('http://localhost/restapi/index.php/api/employee/getDataEmployee').then(function(response) {
                console.log(response);
                $scope.data = response.data.data;
                $scope.current_grid = 1;
                $scope.data_limit = 10;
                $scope.filter_data = $scope.data.length;
                $scope.entire_user = $scope.data.length;
            });
        }

        $scope.reverse = false;
        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : true;
            $scope.propertyName = propertyName;
        };

        $scope.page_position = function(page_number) {
            $scope.current_grid = page_number;
        };
        $scope.filter = function() {
            $timeout(function() {
                $scope.filter_data = $scope.searched.length;
            }, 20);
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.getDataEmployee();

        $scope.confirmDelete = function(id) {
            console.log(id);
            var data = { id: id };
            if ($window.confirm("Are you sure to delete this data?")) {
                $http.post('http://localhost/restapi/index.php/api/employee/deleteData', data).then(function(response) {
                    console.log(response);
                    $scope.alerts = [
                        { type: 'danger', msg: 'Success Data Deleted' }
                    ];
                });
                $timeout(function() {
                    $scope.closeAlert();
                }, 2000);
                $scope.getDataEmployee();

            } else {
                console.log("You clicked NO.");
            }
        };

        $scope.edit = function(id) {
            console.log(id);
            var modalInstance = $uibModal.open({
                templateUrl: "views/modal/modalEditEmployee.view.html",
                controller: "ModalContentCtrl",
                size: '',
                resolve: {
                    A: function() {
                        return id
                    }
                }
            });


            modalInstance.result.then(function(selectedItem) {
                $scope.alerts = [
                    { type: 'success', msg: 'Data Updated' }
                ];
                $timeout(function() {
                    $scope.closeAlert();
                }, 2000);
                $scope.getDataEmployee();
                //console.log("masuk 1");
            }, function() {
                /*$scope.alerts = [
                    { type: 'success', msg: 'Data Updated' }
                ];*/
                $scope.getDataEmployee();
                //console.log("masuk 2");
            });
        };

        $scope.detail = function(id) {
            console.log(id);
            var modalInstance = $uibModal.open({
                templateUrl: "views/modal/modalDetailEmployee.view.html",
                controller: "ModalContentCtrl",
                size: 'lg',
                resolve: {
                    A: function() {
                        return id
                    }
                }
            });


            modalInstance.result.then(function(selectedItem) {
                $scope.alerts = [
                    { type: 'success', msg: 'Data Updated' }
                ];
                $timeout(function() {
                    $scope.closeAlert();
                }, 2000);
                $scope.getDataEmployee();
            }, function() {
                //$scope.getDataEmployee();
                //console.log("masuk 2");
            });
        };



    })


    .controller('ModalContentCtrl', function($scope, $uibModalInstance, A, $http) {
        $scope.myVal = A;
        $scope.vm = {};
        $scope.data={};
        $scope.getDataEdit = function() {
            var data = { id: $scope.myVal };
            $http.post('http://localhost/restapi/index.php/api/employee/getDataEmployeeEdit', data).then(function(response) {
                //console.log(new Date(response.data.data[0].birthDate));
                response.data.data[0].birthDate=new Date(response.data.data[0].birthDate);
                response.data.data[0].description=new Date(response.data.data[0].description);
                $scope.data = response.data.data[0];
                $scope.vm.status = response.data.data[0].status;
                $scope.vm.group = response.data.data[0].group;
                $scope.vm.basicSalary = parseInt(response.data.data[0].basicSalary);
            });

        }
        $scope.getDataEdit();

        $scope.edit = function() {
            var data = { id: $scope.myVal, status: $scope.vm.status, group: $scope.vm.group, basicSalary: $scope.vm.basicSalary };
            $http.post('http://localhost/restapi/index.php/api/employee/updateData', data).then(function(response) {
                console.log(response);
                if (response.data.success) {
                    $scope.ok(1);
                }

            });
        }

        $scope.ok = function() {
            $uibModalInstance.close(1);
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        }

    });