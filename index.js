const db = require('./db/connection');
const inquirer = require('inquirer');
require("console.table")
const initialOptions = [
    {
        name: "View all departments",
        value: "viewAllDepartments"
    },
    {
        name: "View all roles",
        value: "viewAllRoles"
    },
    {
        name: "View all employees",
        value: "viewAllEmployees"
    },
    {
        name: "Add a department",
        value: "addADepartment"
    },
    {
        name: "Add a role",
        value: "addRole"
    },
    {
        name: "Add an employee",
        value: "addAnEmployee"
    },
    {
        name: "Update an Employee",
        value: "updateEmployee"
    },
    {
        name: "Quit",
        value: "exit"
    }



]
async function displayOption() {
    try {
        inquirer.prompt([{
            type: 'list',
            name: 'choices',
            message: 'Pick an option',
            choices: initialOptions,
        }])
            .then(answers => {
                //switch statement for possible option
                switch (answers.choices) {
                    case 'viewAllDepartments':
                        // console.log("view departments")
                        //add viewDepartments options here
                        displayDepartments();
                        break;
                    case 'viewAllRoles':
                        viewAllRoles()
                        // console.log("view all roles")
                        break;
                    case 'viewAllEmployees':
                        // console.log("view employees")
                        //add viewAllEmployee options here
                        viewAllEmployees();
                        break;
                    case 'addADepartment':
                        addDepartment();
                        // console.log("add department")
                        break;
                    case 'addRole':
                        addARole();
                        // console.log("add a role")
                        break;
                    case 'addAnEmployee':
                        // console.log("add employee")
                        addAnEmployee();
                        break;
                    case 'updateEmployee':
                        console.log("updating Role")
                        updateEmployee();
                        break;
                    default: process.exit()
                }
                console.log(answers);
            })
    }
    catch (error) {
        console.error(error);
    }
}

async function displayDepartments() {
    try {
        // Any database request is ALSO AN ASYNC REQUEST 
        db.query("SELECT * FROM department;", function (error, data) {
            if (error) {
                throw error;
            }
            console.log("Data: ", data),
                console.table("Data: ", data),
                displayOption()
        })
    } catch (error) {
        console.error(error);
    }
}
function viewAllRoles() {
    try {
        db.query("SELECT * FROM role;", function (error, data) {
            if (error) {
                throw error;
            }
            console.log("Data: ", data),
                console.table("Data: ", data),
                displayOption()

        })
    } catch (error) {
        console.error(error);
    }
}
async function viewAllEmployees() {
    try {

        db.query("SELECT * FROM employee;", function (error, data) {
            if (error) {
                throw error;
            }
            console.table(data);
        })
        displayOption()
    } catch (error) {
        console.error(error);
    }
}
async function addDepartment() {
    try {
        console.log("im a department")
        const question = [
            {
                type: "input",
                name: "department_name",
                message: " Please enter the name of the new department you want to add"
            }
        ];
        inquirer
            .prompt(question)
            .then((answer) => {
                try {
                    var newDepartment = answer.department_name;
                    db.query(`INSERT INTO department (dept_name) VALUES ('${newDepartment}');`, function (error, data) {

                        console.table(`Department ${newDepartment} was added!`);
                        displayOption()
                    });
                } catch (error) {
                    console.error(error);
                }
            })
            .catch((error) => console.error(error));

    } catch (error) {
        console.error(error);
    }
}
async function addARole() {
    try {
        db.query("SELECT * FROM department", function (error, data) {
            if (error) {
                throw error,
                displayOption()
            }
            const departmentList = data.map((department) => ({
                value: department.id,
                name: department.dept_name,
            }));
            const questions = [
                {
                    type: "input",
                    name: "role_title",
                    message: "Please enter role title:",
                },
                {
                    type: "input",
                    name: "role_salary",
                    message: "Please enter salary for this role:"
                },
                {
                    type: "list",
                    name: "role_department_name",
                    message: "Please select department for this role:",
                    choices: departmentList,
                },
            ];
            inquirer
                .prompt(questions)
                .then((answers) => {
                    try {
                        const roleTitle = answers.title;
                        const rolesSalary = answers.salary;
                        const departmentSelected = answers.role_department_name;

                        db.query(
                            `INSERT INTO role (title, salary, department_id) VALUES("${roleTitle}", "${rolesSalary}" , "${departmentSelected}" );`, function () {
                                console.log("added role")
                            }
                        )
                        displayOption()
                    } catch (error) {
                        console.error(error);
                    }
                })
                .catch((error) => console.error(error));
        })
    } catch (error) {
        console.error(error);
    }
}
async function addAnEmployee() {
    try {
        let managerList;
        let roleList;
        db.query("SELECT * FROM role", function (error, data) {
            if (error) {
                throw error,
                displayOption()
            }
            roleList = data.map((role) => ({
                value: role.id,
                name: role.title,
            }));


            db.query("SELECT id, last_name FROM employee WHERE manager_id is NULL", function (error, data) {
                if (error) {
                    throw error,
                    displayOption()
                }
                managerList = data.map((managers) => ({
                    value: managers.id,
                    name: managers.last_name,
                })
                )
                console.log(managerList)
                const questions = [
                    {
                        type: "input",
                        name: "first_name",
                        message: "Please enter first name:",
                    },
                    {
                        type: "input",
                        name: "last_name",
                        message: "Please enter last name:",
                    },
                    {
                        type: "list",
                        name: "role_id",
                        message: "Please select role:",
                        choices: roleList,
                    },
                    {
                        type: "list",
                        name: "manager_id",
                        message: "Please select manger for this role:",
                        choices: managerList,

                    },
                ];
                inquirer
                    .prompt(questions)
                    .then((answer) => {
                        try {
                            const first_name = answer.first_name;
                            const last_name = answer.last_name;
                            const role_id = answer.role_id;
                            const manager_id = answer.manager_id;

                            db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("${first_name}","${last_name}",${role_id},${manager_id})`)
                            console.log(`${first_name}","${last_name}" "was added"`)
                            displayOption();
                        } catch (error) {
                            console.error(error);
                        }
                    })
                    .catch((error) => console.error(error));
            })
        });
    } catch (error) {
        console.error(error);
    }
}




    async function updateEmployee() {
        try {
            // Fetch employees and roles from the database
            const employeesQuery = 'SELECT * FROM employee';
            const rolesQuery = 'SELECT * FROM role';

            db.query(employeesQuery, (error, results) => {
                if (error) {
                    throw error;
                }
                const employees = results;

                db.query(rolesQuery, (error, results) => {
                    if (error) {
                        throw error;
                    }
                    const roles = results;

                    const employeeChoices = employees.map((employee) => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id,
                    }));

                    const roleChoices = roles.map((role) => ({
                        name: role.title,
                        value: role.id,
                    }));

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employeeId',
                                message: 'Which employee would you like to change the role for?',
                                choices: employeeChoices,
                            },
                            {
                                type: 'list',
                                name: 'roleId',
                                message: "Select the employee's new role",
                                choices: roleChoices,
                            },
                        ])
                        .then((answers) => {
                            db.query(
                                'UPDATE employee SET ? WHERE ?',
                                [{ role_id: answers.roleId }, { id: answers.employeeId }],
                                (error) => {
                                    if (error) {
                                        throw error;
                                    }
                                    console.log('Updated employee role successfully.');
                                    displayOption();
                                }
                            );
                        })
                        .catch((error) => console.error(error));
                });
            });
        } catch (err) {
            console.error(err);
        }
    }
displayOption();