const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Delta_app',
    password: "MYSQl@0211"
});





// -------------------------------------------------
let createRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
        faker.image.avatar()


    ]


};


//  let q = "INSERT INTO usertable (id, username,email,password) VALUES ?";
//  let userdata = [["123e","11_usere","101@gmail.comb","10101e"],
//                 ["123f","11_userf","101@gmail.comc","10101f"]];


// // INSERT DATA IN BULK -----------------------------------------------
let q = "INSERT INTO usertable (id, username,email,password,avatar) VALUES ?";
let userdata = [];

for (let i = 0; i < 101; i++) {
    userdata.push(createRandomUser());
}

console.log(userdata);

try {

    connection.query(q, [userdata], (err, result) => {
        if (err) throw err;
        console.log("Result is ....", result);
    })
} catch (err) {
    console.log(err);
};







// SERVER LISTENING START

app.listen(port, () => {
    console.log("I am Listening Through :", port);
});


app.use((req, res, next) => {
    console.log("Request accepted BROTHER");
    next();
});


app.get("/", (req, res) => {
    let q = `SELECT count(*) FROM usertable`

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("Some ERROR in DB");
    }

});


// USER DETAILED ROUTE -------------
app.get("/user", (req, res) => {
    let q = `SELECT * From  usertable`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // console.log(result);
            res.render("Showuser.ejs", { result });
        })
    } catch (err) {
        console.log(err);
        res.send("Some Error In DB");
    }
});


// EDIT ROUTE 

app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    console.log(id);
    let q = `SELECT * FROM usertable WHERE id = '${id}'`

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            console.log("USER DETAILED IS........... :", user);
            res.render("Edit.ejs", { user })

        })
    } catch (err) {
        console.log(err);
    }

});

// Update/EDIT Route

app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    // console.log(id);
    let { password: formpass, username: newusername, email: newemail } = req.body;
    let q = `SELECT * FROM usertable WHERE id = '${id}'`

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // console.log(result);
            let user1 = result[0];
            // res.send(user1);

            if (formpass != user1.password) {
                res.send("WRONG PASSWORD");


            } else {
                let q2 = `UPDATE usertable SET username ='${newusername}', email = '${newemail}' WHERE id='${id}'`;

                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user")

                });
            }



        })
    } catch (err) {
        console.log(err);
    }
});


// ADD/POST Rooute


app.get("/user/add", (req, res) => {
    res.render("addpost.ejs");
})



app.post("/user/add", (req, res) => {
    let { username, email, password } = req.body;
    let newid = faker.string.uuid();
    let newavatar = faker.image.avatar();

    let q = `INSERT INTO usertable (id,username,email,password,avatar) VALUES (?,?,?,?,?)`;
    let values = [newid, username, email, password, newavatar];


    connection.query(q, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Insert failed");
        }

        console.log("INSERT SUCCESSFUL");
        res.redirect("/user");
    });

});


// DELETE ROOUTE

app.get("/user/:id/delete", (req, res) => {
     let { id } = req.params;

    let que = `SELECT * FROM usertable WHERE id = ?`

    connection.query(que,[id], (err, result) => {
        let user = result[0];


        console.log("DELETE USER DETAILED IS........... :", user)
        res.render("delete.ejs", { user });




    })



});



app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formpass, email: formemail } = req.body;

    let q = `SELECT * FROM usertable WHERE id = '${id}'`;




    connection.query(q, (err, result) => {
        if (err) return res.send("DB Error");



        let user = result[0];

        //  
        if (!user) return res.send("User not found");

        // BOTH must match
        if (formpass !== user.password || formemail !== user.email) {
            return res.send("INCORRECT INPUT");
        }

        let q2 = `DELETE FROM usertable WHERE id = ?`;

        connection.query(q2, [id], (err, result) => {
            if (err) return res.send("Delete failed");

            res.redirect("/user");
        });
    });
});