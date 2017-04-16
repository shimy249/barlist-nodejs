var mysql = require('mysql');
module.exports = function(app,pool){
    app.get('/users', function(req, res){
        res.send('respond with a resource');
    });

    app.post('/users/add', function (req, res,next) {
        var email = req.body.email;
        var name = req.body.name;
        var birthdateString = req.body.birthdate;
        var password = req.body.password;
        var sex = req.body.sex;

        pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
            }
            var sql = "INSERT INTO users(email, name, birthdate, hashedpassword, sex) VALUES (?, ?, ?, ?, ?)";
            var inserts = [email, name, birthdateString, password, sex];

            connection.query(sql, inserts, function (err, results, fields) {
                if (err){
                    console.log(err);
                }

                console.log(results);
                console.log(fields);

                connection.query("SELECT * FROM users WHERE email=?", [email], function(err, results, fields){
                    if(err){
                        console.log(err);
                        res.status(500);
                    }
                    res.status(200).send(results);
                })

            });
        })

    });

    app.get('/users/:id', function (req, res, next){

    });
};
