// Main Script
/*
TODO LIST
1X. Make a starter inquirer prompt that provides choices that lead to each function(view all departments/roles/employees, add a department/role/employee, and update an employee role)
2X. Make sure the SQL db is linked so that you can have these choices show any of these requests
3X. Choosing all departments should show a table with all department names and ids
4X. Choosing all roles should show a table with job titles, role ids, the department the role belonds to, and the salary
5X. Choosing all employees should show a table with all employee data, featuring ids, first and last names, job titles, departments, salaries, and managers for that employee
6. Adding department should have a prompt to type in a department, and then add it to the database
7. Adding a role shhould prompt to add the name, salary and department and then add it to the database.
8. Adding an employee should prompt to add the first and last name, role, and manager and then should add it to the database
9. Updating the employee role should prompt to select an employee and their new role via choices, and then update it to the database
*/
const inquirer = require('inquirer');
const mysql = require('mysql2');



const mainMenu = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'main',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
    },
];

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password123',
        database: 'company_db'
    },
    console.log('Connected to company_db database.')
);

var viewAllEmployees = function () {
    db.query('SELECT * FROM employee', (err, data) => {
        console.log(data)
        init();
    })
};

var addEmployee = function () {

};

var viewAllRoles = function () {
    db.query('SELECT * FROM roles', (err, data) => {
        console.log(data)
        init();
    })
};

var addRole = function () {

};

var viewAllDepartments = function () {
    db.query('SELECT * FROM department', (err, data) => {
        console.log(data)
        init();
    })
};

var addDepartment = function () {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'dept_name',
        },
    ]).then(dept_answers => {
        db.query(`INSERT INTO department (name) VALUES (${dept_answers.dept_name})`, (err, data) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            console.log('New department added');
            init();
        });
    })

};

var init = function () {
    inquirer
        .prompt(mainMenu)
        .then((answers) => {

            switch (answers.main) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployee();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
            }
        })
        .catch((error) => console.error(error));
};


init();