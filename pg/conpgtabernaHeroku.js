
const dotenv = require('dotenv');
dotenv.config();
let postgreshost = process.env.pghostheroku
//console.log(postgreshost);
//const firead = require('../firebase/firestore')
//const bdfb = firead.firestore()

 const cn = { 
    host: postgreshost,//'ec2-54-74-95-84.eu-west-1.compute.amazonaws.com',//'localhost',//'192.168.1.95', 'epimast.duckdns.org', //'horton.elephantsql.com',//'casaraspi.ddns.net', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'devfja0rbcvep',//'tabernadacalzada',// 'mvtjhnoj',//'ld',
    user: 'pcdeumhaozgwkk',//'pi', //'mvtjhnoj',//'postgres',
    passwordheroku: process.env.passwordheroku,
    //'200271'//'7tslWmrmIvpMfw4nXnzk55eT7a_ol1tt'//'200271',
    ssl: {
        rejectUnauthorized: false,
    }
}; 
 
const pgp = require('pg-promise')(/*options*/)
const dbHeroku = pgp(cn); // database instance;
module.exports = dbHeroku; 
