"use strict";

(function () {

    angular.module('payment.login', [
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: "angular/dang-nhap/dang-nhap.html",
                    controller: "dang-nhap.ctrl"
                })
            ;
        }])

        .controller("dang-nhap.ctrl",function($scope,SecurityService,User){
            $scope.cred = {};
            $scope.login = function(){
                SecurityService.login($scope.cred);
                $scope.User = User.isWrongPass;
                console.log($scope.User);
            }
        })

    ;

})();