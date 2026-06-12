const express = require("express");
const router = express.Router();
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Delta_app',
    password: "MYSQl@0211"
});

let createRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
        faker.image.avatar()


    ]


};




// USER DETAILED ROUTE -------------
router.get("/", (req, res) => {
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

router.get("/:id/edit", (req, res) => {
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

router.patch("/:id", (req, res) => {
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


router.get("/add", (req, res) => {
    res.render("addpost.ejs");
})



router.post("/add", (req, res) => {
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

router.get("/:id/delete", (req, res) => {
     let { id } = req.params;

    let que = `SELECT * FROM usertable WHERE id = ?`

    connection.query(que,[id], (err, result) => {
        let user = result[0];


        console.log("DELETE USER DETAILED IS........... :", user)
        res.render("delete.ejs", { user });




    })



});



router.delete("/:id", (req, res) => {
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

module.exports = router;