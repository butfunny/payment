/**
 * Created by Admin on 22/06/2015.
 */
"use strict";

(function () {

    angular.module('payment.security', [
    ])
        .factory("User", function() {
            return {
                isLogged: false,
                isWrongPass: false
            };
        })

        .run(function(SecurityService, User, $rootScope) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                if (!User.isLogged) {
                    if (toState.name == "login") {
                        ;
                    } else {
                        event.preventDefault();
                    }
                }
            });



        })

        .factory("SecurityService", function(User,$http,$state) {

            function fetchUser(){
                return $http.get("/api/account").success(function(data){
                    if(data == ""){
                        ObjectUtil.clear(User);
                        $state.go("login");
                    }else{
                        User.isLogged = true;
                        User.firstName = data.firstName;
                        User.lastName = data.lastName;
                        $state.go("payment");
                    }
                })

            }
            fetchUser();



            return {
                login: function(cred){
                    return $http.post("/api/security/login", cred).success(function(data){
                        if(data == ""){
                            ObjectUtil.clear(User);
                            User.isWrongPass = true;
                        }else{
                            User.isLogged = true;
                            User.firstName = data.firstName;
                            User.lastName = data.lastName;
                            $state.go("payment");
                        }
                    });
                },
                logout: function(){
                    return $http.post("/api/security/logout").success(function(){
                        ObjectUtil.clear(User);
                        $state.go("login");
                    })
                }
            };
        })
    ;

})();