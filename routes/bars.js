/**
 * Created by kevin on 4/16/17.
 */
var mysql = require('mysql');
module.exports = function(app,pool) {

    app.get("/bars", function(req, res){
       pool.getConnection(function (err, connection) {
           if(err){
               console.log(err);
               connection.release();
               res.status(500);
           }

           connection.query("SELECT bars.bar_id, address, bar_name, bar_website, bar_type, phone, average, ifnull(count, 0) as count FROM bars LEFT OUTER JOIN ( SELECT average, count, bar_id FROM (SELECT AVG(reviews.rating) AS average, COUNT(reviews.rating) AS count, bars.bar_id AS bar_id, bars.bar_name AS bar_name, bars.address AS address, bars.bar_website AS bar_website, bars.bar_type AS bar_type, bars.phone AS phone FROM(reviews JOIN bars ON ((reviews.barID = bars.bar_id))) GROUP BY bars.bar_id)  as A) as B on bars.bar_id=B.bar_id", function (err, results, fields) {
               connection.release();
               res.status(200).send(results);

           });
       });
    });

    app.get("/bars/:bar_id", function(req, res){
        pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
                connection.release();
                res.status(500);
            }

            connection.query("SELECT * FROM bars LEFT OUTER JOIN reviews ON bar_id=barID LEFT OUTER JOIN products ON prodID=productID WHERE bar_id=?", [req.params.bar_id], function(err, results){
                //console.log(results);
                connection.release();
                res.status(200).send(results);

            });
        });
    });

    app.get("/barsbytype/:type", function (req, res) {
        pool.getConnection(function(err, connection){
            if(err) {
                console.log(err);
                res.status(500);
            }

            connection.query("SELECT bars.bar_id, address, bar_name, bar_website, bar_type, phone, average, ifnull(count, 0) as count FROM bars LEFT OUTER JOIN ( SELECT average, count, bar_id FROM (SELECT AVG(reviews.rating) AS average, COUNT(reviews.rating) AS count, bars.bar_id AS bar_id, bars.bar_name AS bar_name, bars.address AS address, bars.bar_website AS bar_website, bars.bar_type AS bar_type, bars.phone AS phone FROM(reviews JOIN bars ON ((reviews.barID = bars.bar_id))) GROUP BY bars.bar_id)  as A) as B on bars.bar_id=B.bar_id where bar_type=?",[req.params.type], function(err, results, fields){
                if(err){
                    console.log(err);
                    connection.release();
                    res.status(500);
                }
                connection.release();
                res.status(200).send(results);


            });

        });
    });

    app.get("/ratings/:barID", function (req, res){
        pool.getConnection(function(err, connection){
            if(err) {
                console.log(err);
                connection.release();
                res.status(500);
            }

            connection.query("SELECT * FROM reviews WHERE barID=?",[req.params.barID], function(err, results, fields){
                if(err){
                    console.log(err);
                    res.status(500);
                }
                connection.release();
                res.status(200).send(results);


            });

        });
    });

    app.get("/bar_products/:barId", function(req, res){
        pool.getConnection(function(err, connection){
            if(err) {
                console.log(err);
                connection.release();
                res.status(500);
            }

            connection.query("SELECT * FROM bars LEFT JOIN contracts_bars on bars.bar_id=contracts_bars.bar_id join contracts on contracts_bars.contID=contracts.contID join products on contracts.distName=products.distName where bars.bar_id=?",[req.params.barId], function(err, results, fields){
                if(err){
                    console.log(err);
                    res.status(500);
                }
                connection.release();
                res.status(200).send(results);


            });

        });
    });

    app.get("/types", function(req, res){
        pool.getConnection(function(err, connection){
            if(err) {
                console.log(err);
                res.status(500);
            }

            connection.query("SELECT DISTINCT bar_type FROM bars ", function(err, results, fields){
                if(err){
                    console.log(err);
                    connection.release()
                    res.status(500);
                }
                connection.release();
                res.status(200).send(results);


            });

        });
    });

    app.get("/maxprice/:price", function(req, res){
        pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
                res.status(500);
            }

            connection.query("SELECT bars.bar_id, bars.address, bars.bar_name, bars.bar_website, bars.bar_type, bars.phone, average, ifnull(count, 0) as count FROM bars LEFT OUTER JOIN ( SELECT average, count, bar_id FROM (SELECT AVG(reviews.rating) AS average, COUNT(reviews.rating) AS count, bars.bar_id AS bar_id, bars.bar_name AS bar_name, bars.address AS address, bars.bar_website AS bar_website, bars.bar_type AS bar_type, bars.phone AS phone FROM (reviews JOIN bars ON ((reviews.barID = bars.bar_id))) GROUP BY bars.bar_id)  as A) as B on bars.bar_id=B.bar_id RIGHT OUTER JOIN (SELECT DISTINCT bars.bar_id AS bar_id, bars.bar_name AS bar_name, bars.address AS address, bars.bar_website AS bar_website, bars.bar_type AS bar_type, bars.phone AS phone FROM (((products JOIN contracts ON ((products.distName = contracts.distName))) JOIN contracts_bars ON ((contracts.contID = contracts_bars.contID))) JOIN bars ON ((contracts_bars.bar_id = bars.bar_id))) WHERE (products.prices <= ?)) as sub  on sub.bar_id=bars.bar_id", [req.params.price], function(err, results){
                if(err){
                    console.log(err);
                    connection.release();
                    res.status(500);
                }
                connection.release();
                res.status(200).send(results);

            });
        });
    });

    app.get("/minprice/:price", function (req, res) {
        pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
                res.status(500);
            }

            connection.query("SELECT bars.bar_id, bars.address, bars.bar_name, bars.bar_website, bars.bar_type, bars.phone, average, ifnull(count, 0) as count FROM bars LEFT OUTER JOIN ( SELECT average, count, bar_id FROM (SELECT AVG(reviews.rating) AS average, COUNT(reviews.rating) AS count, bars.bar_id AS bar_id, bars.bar_name AS bar_name, bars.address AS address, bars.bar_website AS bar_website, bars.bar_type AS bar_type, bars.phone AS phone FROM (reviews JOIN bars ON ((reviews.barID = bars.bar_id))) GROUP BY bars.bar_id)  as A) as B on bars.bar_id=B.bar_id RIGHT OUTER JOIN (SELECT DISTINCT bars.bar_id AS bar_id, bars.bar_name AS bar_name, bars.address AS address, bars.bar_website AS bar_website, bars.bar_type AS bar_type, bars.phone AS phone FROM (((products JOIN contracts ON ((products.distName = contracts.distName))) JOIN contracts_bars ON ((contracts.contID = contracts_bars.contID))) JOIN bars ON ((contracts_bars.bar_id = bars.bar_id))) WHERE (products.prices >= ?)) as sub  on sub.bar_id=bars.bar_id", [req.params.price], function(err, results){
                if(err){
                    console.log(err);
                    connection.release();
                    res.status(500);
                }
                connection.release();
                res.status(200).send(results);

            });
        });
    });

    app.get("/minrating/:minRating", function(req, res){
        
    });

}