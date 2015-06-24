"use strict";

(function () {

    angular.module('payment.payment-bill', [
        'payment-api.billDraft',
        'payment.payment-bill.customer-info'
    ])
        //isolated scope

        .directive("paymentBill", function(BillService, BillPrice, $modal, PrintService,CustomerService,BillDraftService, StoreItemService, $stateParams, $q) {
            return {
                restrict: "E",
                scope: {
                    bill: "=",
                    storeItems: "=",
                    afterCreate: "&"
                },
                templateUrl: "angular/bill-edit/payment-bill.html",
                link: function($scope, elem, attrs) {

                    $scope.initBill = function() {
                        $scope.bill = {
                            items: [],
                            deliverTime: new Date(),
                            customer: null
                        };

                    };

                    if ($stateParams.draftId != null) {
                        BillDraftService.getBillDraftByDraftId($stateParams.draftId).success(function(billDraft){

                            delete billDraft.id;

                            $scope.initBill();
                            ObjectUtil.copy(billDraft, $scope.bill);

                            var allItemIds = [];
                            for(var i in billDraft.items){
                                var item = billDraft.items[i];
                                allItemIds.push(item.storeItemId);
                            }

                            if (billDraft.customerId != null) {
                                CustomerService.getCustomerById(billDraft.customerId).success(function(customers){
                                    $scope.bill.customer = customers;
                                });
                            }

                            if(Cols.isNotEmpty(allItemIds)){
                                StoreItemService.getStoreItemsByIds(allItemIds).success(function(storeItems){
                                    var storeItemsIndex = Cols.index(storeItems,"id");

                                    for (var i in billDraft.items){
                                        var billItem = billDraft.items[i];
                                        billItem.itemName = storeItemsIndex[billItem.storeItemId][0].itemName;
                                        billItem.price = storeItemsIndex[billItem.storeItemId][0].retailpriceSku;
                                        billItem.sku = storeItemsIndex[billItem.storeItemId][0].sku;
                                    }
                                });
                            }

                            $scope.$watch("bill",function(bill,old){
                                if($scope.bill == old) return;
                                BillDraftService.updateBillDraft($stateParams.draftId, bill);
                            },true);


                            
                        });
                    } else {
                        $scope.initBill();

                    }

                    $scope.price = function() {
                        return BillPrice.price($scope.bill);
                    };

                    var loadCustomers = function(){
                        CustomerService.getCustomers().success(function(customers){
                            $scope.customers = customers;
                        });
                    };

                    loadCustomers();


                    $scope.saveDraftBill = function(bill) {
                        updateCustomer().then(function(){
                            BillDraftService.createBillDraft(bill);
                               $scope.initBill();
                               loadCustomers();
                                setTimeout(function(){
                                    $scope.noti = "";
                                },1000);
                        })
                    };


                    function updateCustomer() {
                        var defer = $q.defer();

                        if ($scope.bill.customer.id == null){
                            CustomerService.insertCustomer($scope.bill.customer).success(function(customerId) {
                                $scope.bill.customer.id = customerId;

                                defer.resolve();
                            });
                        } else {
                            CustomerService.updateCustomer($scope.bill.customer);
                            defer.resolve();
                        }

                        return defer.promise;
                    }

                    $scope.createBill = function(bill){
                        if ($stateParams.draftId != null) {
                            BillDraftService.deleteBillDraftByDraftId($stateParams.draftId);
                        }

                        var popupWin = window.open('', '_blank', 'width=800,height=600');
                        updateCustomer().then(function() {
                            BillService.createBill(bill)
                                .success(function (data,status,header,config) {

                                    PrintService.print($scope, popupWin, {
                                        templateUrl: "angular/bill-edit/bill-print.html",
                                        resolve: {
                                            bill: $scope.bill
                                        },
                                        controller: "payment-bill.print.Ctrl"
                                    });

                                    $scope.initBill();
                                    $scope.afterCreate();
                                })
                            ;
                        });


                    };
                }
            };
        })

        .controller("payment-bill.print.Ctrl", function($scope, BillPrice) {
            $scope.price = function() {
                return BillPrice.price($scope.bill);
            };
        })

        .factory("PrintService", function($http, $templateCache, $controller, $compile) {
            return {
                print: function($scope, popupWin, options) {

                    $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
                        var content = result.data;

                        var scope = $scope.$new();
                        var contentEl = $compile(angular.element(content))(scope);

                        for (var key in options.resolve) {
                            scope[key] = options.resolve[key];
                        }
                        $controller(options.controller, {$scope: scope});
                        setTimeout(function() {

                            var html = contentEl.html();
                            scope.$destroy();
                            popupWin.document.open();

                            popupWin.document.write('<html><head>' +
                            '<style>body {font-family: "Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif !important; }</style>' +
                            '<link href="http://fonts.googleapis.com/css?family=Droid+Sans:400,700" rel="stylesheet" type="text/css">' +
                            '<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />' +
                            '<link rel="stylesheet" type="text/css" href="css/style.css" />' +
                            '</head><body>' + html + '</html>');
                            popupWin.document.close();
                            popupWin.onload = function() {
                                popupWin.setTimeout(function() {
                                    popupWin.print();
                                }, 500);
                            };
                        }, 0);

                    });

                }
            };
        })

        .directive("paymentMax", function() {
            return {
                restrict: "A",
                require: "ngModel",
                link: function($scope, elem, attrs, ngModel) {
                    elem.keyup(function() {
                        var max = $scope.$eval(attrs.paymentMax);
                        if (elem.val() > max) {
                            elem.val(max);
                            ngModel.$setViewValue(max);
                        }
                    });
                }
            };
        })

        .directive("paymentMin", function() {
            return {
                restrict: "A",
                require: "ngModel",
                link: function($scope, elem, attrs, ngModel) {
                    elem.keyup(function() {
                        if (elem.val() < 0) {
                            elem.val(1);
                            ngModel.$setViewValue(1);
                        }
                    });
                }
            };
        })

        .directive("billItemRow", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    $scope.plus = function(){
                        var billItem = $scope.billItem;

                        var storeItem = Cols.find($scope.storeItems, function(storeItem){
                            return billItem.storeItemId == storeItem._id;
                        });

                        if(billItem.count == storeItem.instockSku){
                            $scope.warning = "Mặt hàng "+ billItem.itemName + " đã bán hết ";
                        }else{
                            $scope.warning ="";
                            billItem.count ++;
                        }
                    };

                    $scope.subtract = function(){
                        var billItem = $scope.billItem;
                        $scope.warning = "";
                        billItem.count --;
                        if ( billItem.count == 0 ){
                            Cols.remove(billItem, $scope.bill.items);
                        }
                    };

                    $scope.delete = function(){
                        var billItem = $scope.billItem;
                        $scope.warning = "";
                        Cols.remove(billItem, $scope.bill.items);
                    };


                    $scope.getStoreItem = function(billItem) {

                        return Cols.find($scope.storeItems, function (storeItem) {
                            return billItem.storeItemId == storeItem._id;
                        });
                    };

                }
            };
        })
    ;

})();