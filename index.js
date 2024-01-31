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
        choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role'],
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
        console.table(data)
        init();
    })
};

var addEmployee = function () {

};

var viewAllRoles = function () {
    db.query('SELECT * FROM roles', (err, data) => {
        console.table(data)
        init();
    })
};

var addRole = function () {
    // Fetch the list of departments from the database
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) {
            console.error(err);
            return;
        }

        // Extract department names from the result
        const departmentChoices = departments.map(department => department.name);

        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'role_name',
            },
            {
                type: 'input',
                message: 'What is the salary for that role?',
                name: 'role_salary',
            },
            {
                type: 'list',
                message: 'Select the department for that role:',
                name: 'role_dept',
                choices: departmentChoices,
            },
        ]).then(role_answers => {
            const selectedDepartment = departments.find(department => department.name === role_answers.role_dept);

            if (!selectedDepartment) {
                console.error('Invalid department selected');
                init();
                return;
            }

            db.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${role_answers.role_name}",  ${role_answers.role_salary}, ${selectedDepartment.id})`,
                (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('New role added');
                    init();
                });
        });
    });
};

var viewAllDepartments = function () {
    db.query('SELECT * FROM department', (err, data) => {
        console.table(data)
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
        db.query(`INSERT INTO department (name) VALUES ("${dept_answers.dept_name}")`, (err, data) => {
            if (err) {
                console.error(err)
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