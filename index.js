const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routes/user");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));


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

for (let i = 0; i < 1; i++) {
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

app.use("/user", userRouter);