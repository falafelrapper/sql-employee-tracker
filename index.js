// Main Script
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password123',
        database: 'movie_db'
    },
    console.log('Connected to movie_db database.')
);