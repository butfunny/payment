/**
 * Created by Admin on 04/06/2015.
 */
"use strict";

angular.module('payment.app', [
    'payment.bill-edit',
    'payment.report',
    'payment.kho',
    'payment.draft-bills',
    'payment.common.theme',
    'payment.common.date-picker',
    'payment.login',
    'payment.security',
    'payment.layout'
])

    .config(function ( $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');

    })
;
