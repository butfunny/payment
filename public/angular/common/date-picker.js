"use strict";

(function () {

    angular.module('payment.common.date-picker', [
    ])
        .directive("datePicker", function() {
            return {
                restrict: "E",
                scope: {
                    model: "="
                },
                templateUrl: "angular/common/date-picker.html",
                link: function($scope, elem, attrs) {
                    $scope.opened = false;

                    $scope.open = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        $scope.opened = !$scope.opened;
                    };

                }
            };
        })
    ;

})();