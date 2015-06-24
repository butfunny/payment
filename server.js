var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('payment',['payment']);
var bodyParser = require('body-parser');
var user = db.collection("user");
var storeItem = db.collection("storeItem");
var customer = db.collection("customer");


app.use(express.static('public'));
app.use(bodyParser.json());


//Security Service

var session_user = null;
app.get("/api/account",function(req,res){
    if(session_user != null){
        res.json(session_user);
    }else{
        res.send("");
    }
});

app.post("/api/security/login",function(req,res){
    user.findOne({username: req.body.username,pass: req.body.password},function(err,docs){
        if(docs != null){
            res.json(docs);
            session_user = docs;
        }
    })

});


//Logout Service
app.post("/api/security/logout",function(req,res){
    console.log("log out");
    session_user = null;
});

//StoreItems Service

app.get("/api/StoreItems",function(req,res){
    if(session_user != null){
        storeItem.find(function(err,docs){
            res.json(docs);
        })
    }

});

app.put("/api/StoreItem/:id",function(req,res){
    if(session_user != null){
        var id = req.params.id;
        storeItem.findAndModify({
                query: {_id: mongojs.ObjectId(id)},
                update: {
                    $set: {
                        itemName: req.body.itemName,
                        instockSKU: req.body.instockSKU,
                        sku : req.body.sku,
                        priceSKU: req.body.priceSKU,
                        retailpriceSKU: req.body.retailpriceSKU
                    }
                },
                new : true
            },function(err,docs){
                res.json(docs);
            }
        )
    }

});

app.post("/api/StoreItems",function(req,res){
    if(session_user != null){
        req.body.timeUpdate = new Date();
        storeItem.insert(req.body,function(err,docs){
            res.json(docs);
        })
    }

});

app.delete("/api/StoreItem/:id",function(req,res){
    if(session_user != null){
        var id = req.params.id;
        storeItem.remove({_id: mongojs.ObjectId(id)},function(err,docs){
            res.json(docs);
        })
    }

});

//Customer Service

app.get("/api/Customers",function(req,res){
    if(session_user != null){
        customer.find(function(err,docs){
            res.json(docs);
        })
    }
});

app.put("/api/Customer/:id",function(req,res){
    var id = req.params.id;
    customer.findAndModify({
            query: {_id: mongojs.ObjectId(id)},
            update: {
                $set: {
                    customerName: req.body.customerName,
                    receiverName: req.body.receiverName,
                    customerPlace : req.body.customerPlace,
                    receiverPlace: req.body.receiverPlace,
                    customerPhone: req.body.customerPhone,
                    receiverPhone: req.body.receiverPhone,
                    receiverTime: req.body.receiverTime,
                    email: req.body.email
                }
            },
            new : true
        },function(err,docs){
            res.json(docs);
        }
    )
});

app.post("/api/Customers",function(req,res){
    customer.insert(req.body,function(err,docs){
        res.json(docs);
    })
});

app.get("/api/Customers/",function(req,res){
    
});



app.listen(3000);
console.log("Server dang chay o port 3000");