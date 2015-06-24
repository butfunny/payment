"use strict";

(function () {

    angular.module('payment.report', [
        'payment.api.report',
        'payment.api.customer',
        'payment.api.store-item',
        'payment.api.bill',
        'payment.common.excel'
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('baocao', {
                    url: '/baocao',
                    templateUrl: "angular/report/report.html",
                    controller: "report.ctrl"
                })
            ;
        }])

        .controller("report.ctrl",function($scope,ReportService,CustomerService, StoreItemService, ExcelService){

            var allIds = [];
            var allItemIds = [];
            $scope.totalGross = 0;
            $scope.totalProfit = 0;

            $scope.days = [];
            for (var i = 0; i < 7; i++) {
                var date = new Date();
                date.setDate(date.getDate() - i);
                $scope.days.push(date);
            }
            $scope.date = $scope.days[0];



            $scope.$watch("date", function(date) {

                ReportService.getBills(date).success(function(bills){

                    $scope.bills = bills;

                    for(var i in $scope.bills){
                        var bill = $scope.bills[i];
                        allIds.push(bill.customerId);
                        for(var j in bill.items){
                            var item = bill.items[j];
                            allItemIds.push(item.storeItemId);
                        }
                    }
                    if (Cols.isNotEmpty(allIds)) {
                        CustomerService.getCustomersByIds(allIds).success(function(customers){
                            var index = Cols.index(customers, "id");

                            for(var i in $scope.bills){
                                var bill = $scope.bills[i];
                                bill.customer = index[bill.customerId][0];

                                delete bill.customerId;

                            }
                        })
                    }

                    if (Cols.isNotEmpty(allItemIds)){
                        StoreItemService.getStoreItemsByIds(allItemIds).success(function(items){
                            var index = Cols.index(items,"id");
                            for(var i in $scope.bills){
                                var bill = $scope.bills[i];
                                for(var j in bill.items){
                                    var billItem = bill.items[j];
                                    billItem.storeItem = index[billItem.storeItemId][0];
                                    billItem.Profit = billItem.gross - (billItem.count * billItem.storeItem.priceSku);
                                    bill.billProfit += billItem.Profit;
                                    delete billItem.storeItemId;
                                }
                            }
                        })

                    }


                    $scope.exportToExcel=function() {
                        ExcelService.download($scope, {
                            worksheetName: "Báo cáo ngày",
                            templateUrl: "angular/report/report-bill-table.html",
                            resolve: {
                                bills: bills
                            }
                        });

                    }
                });

            });

            $scope.gross = function(bill){
                return Cols.sum(bill.items, function(billItem) {
                    return billItem.storeItem==null ? 0 : billItem.count * billItem.storeItem.retailpriceSku;
                });
            };

            $scope.profit = function(bill){
                return Cols.sum(bill.items, function(billItem) {
                    return billItem.storeItem==null ? 0 : (billItem.count * billItem.storeItem.priceSku);
                });
            };


            $scope.totalGross = function(){
                if ($scope.bills == null) {
                    return 0;
                }
                return Cols.sum($scope.bills, function(bill) {
                    return Cols.sum(bill.items, function(billItem) {
                        return billItem.storeItem==null ? 0 : billItem.count * billItem.storeItem.retailpriceSku;
                    });
                });
            };

            $scope.totalProfit = function(){
                if ($scope.bills == null) {
                    return 0;
                }
                return Cols.sum($scope.bills, function(bill) {
                    return Cols.sum(bill.items, function(billItem) {
                        return billItem.storeItem==null ? 0 : billItem.count * billItem.storeItem.priceSku;
                    });
                });
            }
        })

        .directive("reportBillTable", function() {
            return {
                restrict: "E",
                templateUrl: "angular/report/report-bill-table.html",
                link: function($scope, elem, attrs) {

                }
            };
        })
    ;

})();