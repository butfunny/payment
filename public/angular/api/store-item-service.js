"use strict";

(function () {

    angular.module('payment.api.store-item', [
    ])
        .factory("StoreItemService", function($http) {
            return {
                getStoreItems: function() {
                    return $http.get("/api/StoreItems");
                },

                updateItem: function(storeItem){
                    return $http.put("/api/StoreItem/" + storeItem._id, storeItem);
                },

                insertItem : function(storeItem){
                    return $http.post("/api/StoreItems",storeItem);
                },
                getStoreItemsByIds: function(ids){
                    return $http.post("/api/StoreItems/select",ids);
                },

                deleteItem: function(storeItem){
                    return $http.delete("/api/StoreItem/" + storeItem._id);
                }
            };
        })
    ;

})();