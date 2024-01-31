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

// View table functions
var viewAllEmployees = function () {
    db.query('SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", roles.title AS Role, department.name AS Department FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(data);
        init();
    });
};

var viewAllRoles = function () {
    db.query('SELECT roles.id AS "Role ID", roles.title AS Title, roles.salary AS Salary, department.name AS Department FROM roles LEFT JOIN department ON roles.department_id = department.id', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(data);
        init();
    });
};

var viewAllDepartments = function () {
    db.query('SELECT department.id AS ID, department.name AS "Department Name" FROM department', (err, data) => {
        console.table(data)
        init();
    })
};

// Add to table functions

var addEmployee = function () {
    db.query('SELECT * FROM roles', (err, roles) => {
        if (err) {
            console.error(err);
            return;
        }
        const roleChoices = roles.map(roles => roles.title);

        inquirer
            .prompt([
                {
                    type: 'input',
                    message: "What is the employee's first name?",
                    name: 'emp_first',
                },
                {
                    type: 'input',
                    message: "What is the employee's last name?",
                    name: 'emp_last',
                },
                {
                    type: 'list',
                    message: "What is the employee's role?",
                    name: 'emp_role',
                    choices: roleChoices,
                },
            ]).then(emp_answers => {
                const selectedRole = roles.find(roles => roles.title === emp_answers.emp_role);

                if (!selectedRole) {
                    console.error('Invalid department selected');
                    init();
                    return;
                }

                db.query(`INSERT INTO employee (first_name, last_name, roles_id) VALUES ("${emp_answers.emp_first}",  "${emp_answers.emp_last}", ${selectedRole.id})`,
                    (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log('New employee added');
                        init();
                    });
            });
    });
};



var addRole = function () {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) {
            console.error(err);
            return;
        }
        const departmentChoices = departments.map(department => department.name);

        inquirer
            .prompt([
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

// Employee updater
var updateEmployee = function () {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) {
            console.error(err);
            return;
        }

        const employeeChoices = employees.map(employee => `${employee.id} - ${employee.first_name} ${employee.last_name}`);

        inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select the employee to update:',
                name: 'emp_select',
                choices: employeeChoices,
            },
        ]).then(emp_answer => {
            const selectedEmployeeId = emp_answer.emp_select.split(' ')[0];

            db.query('SELECT * FROM roles', (err, roles) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const roleChoices = roles.map(role => `${role.id} - ${role.title}`);

                inquirer
                    .prompt([
                        {
                            type: 'list',
                            message: 'Select the new role:',
                            name: 'new_role',
                            choices: roleChoices,
                        },
                    ]).then(role_answers => {
                        const newRoleId = role_answers.new_role.split(' ')[0];

                        db.query(`UPDATE employee SET roles_id = ${newRoleId} WHERE id = ${selectedEmployeeId}`, (err, data) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log('Employee role updated');
                            init();
                        });
                    });
            });
        });
    });
};
// Main menu function
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