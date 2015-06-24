"use strict";

(function () {

    angular.module('payment.bill-edit', [
        'ui.router',
        'ui.bootstrap',
        'payment.payment-bill',
        'payment.api.store-item',
        'payment.api.bill',
        'payment.api.customer'
    ])

        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');
            $stateProvider
                .state('payment',{
                    url: '/payment?draftId',
                    templateUrl: 'angular/bill-edit/bill-edit.html',
                    controller: "bill-edit.ctrl"
                })
            ;
        })

        .factory("BillPrice", function() {
            return {
                price: function(bill) {
                    var total = 0;
                    for(var i=0; bill.items != null && i <bill.items.length; i++){
                        var billItem = bill.items[i];
                        total += billItem.count * billItem.price;
                    }
                    return total;
                }
            };
        })

        .controller("bill-edit.ctrl",function($scope, StoreItemService){

            $scope.bill = {};

            $scope.loadStoreItems = function() {
                StoreItemService.getStoreItems().success(function (storeItems) {
                    $scope.storeItems = storeItems;
                });
            };

            $scope.loadStoreItems();

            $scope.warning = "";
            $scope.setWarning = function(message) {
                $scope.warning = message;
            };


            $scope.buy = function(storeItem){
                $scope.warning = null;

                var billItem = Cols.find($scope.bill.items, function (billItem) {
                    return billItem.storeItemId == storeItem._id;
                });

                if (billItem == null) {
                    if (storeItem.instockSku == 0) {
                        $scope.warning = "Mặt hàng "+ storeItem.itemName + " đã bán hết ";
                    } else {
                        $scope.bill.items.push({
                            "itemName": storeItem.itemName,
                            "storeItemId": storeItem._id,
                            "price": storeItem.retailpriceSku,
                            "count": 1,
                            "sku":storeItem.sku
                        });
                    }
                } else {
                    if (storeItem.instockSku == billItem.count) {
                        $scope.warning = "Mặt hàng "+ storeItem.itemName + " đã bán hết ";
                    } else {
                        billItem.count++;
                    }
                }
            };

            var getQuantity = function(storeItem, bill) {
                var billItem = Cols.find(bill.items, function (billItem) {
                    return billItem.storeItemId == storeItem._id;
                });
                return billItem == null ? 0 : billItem.count;
            };


            $scope.outOfStock = function(storeItem) {
                return storeItem.instockSku - getQuantity(storeItem, $scope.bill) <= 0;
            };

        })

    ;


})();

