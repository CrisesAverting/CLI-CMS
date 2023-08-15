const db = require('./db/connection');
const inquirer = require('inquirer');
require("console.table")
const initialOptions = [
    {
        name: "View all departments",
        value: "viewAllDepartments"
    },
    {
        name: "view all roles",
        value: "viewAllRoles"
    },
    {
        name: "view all employees",
        value: "viewAllEmployees"
    },
    {
        name: "add a department",
        value: "addADepartment"
    },
    {
        name: "add a role",
        value: "addRole"
    },
    {
        name: "add an employee",
        value: "addAnEmployee"
    },
    {
        name: "update an employee Role",
        value: "updateRole"
    },
    {
        name: "quit",
        value: "exit"
    }



]
function displayOption() {
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
                    console.log("view departments")
                    //add viewDepartments options here
                    displayDepartments();
                    break;
                case 'viewAllRoles':
                    viewAllRoles()
                    console.log("view all roles")
                    break;
                case 'viewAllEmployees':
                    console.log("view employees")
                    //add viewAllEmployee options here
                    viewAllEmployees();
                    break;
                case 'addADepartment':
                    addDepartment();
                    console.log("add department")
                    break;
                case 'addRole':
                    addARole();
                    console.log("add a role")
                    break;
                case 'addAnEmployee':
                    console.log("add employee")
                    addAnEmployee();
                    break;
                case 'updateRole':
                    console.log("updating Role")
                default: process.exit()
            }
            console.log(answers);
        })
}
// // function displayDepartments() {
// db.query("SELECT * FROM department;", function (error, data) {
//     if (error) {
//         throw error;
//     }
//     // console.log("Data: ", data);
//     console.table(data),
//     displayOption()
// })
// }
function displayDepartments() {

    // Any database request is ALSO AN ASYNC REQUEST 
    db.query("SELECT * FROM department;", function (error, data) {
        if (error) {
            throw error;
        }
        console.log("Data: ", data),
            console.table("Data: ", data),
            // const dataChoices = data.map((department) => ({
            //     value: department.id, 
            //     name: department.dept_name,
            // }))
            // // IF we want to use this dataset
            // // return data;  --> return to calling function
            // // maybe we restructure the database data(?)
            // // let tempObj = []

            // inquirer.prompt({
            //     type: 'list',
            //     name: 'departments',
            //     message: "What department would you like to see",
            //     choices: dataChoices
            // }).then(answers => {
            //     console.log(answers);
            //     // call the main user prompt function
            // }).catch(err => {
            //     console.log(err);
            // })
            displayOption()
    })
}
function viewAllRoles() {
    db.query("SELECT * FROM role;", function (error, data) {
        if (error) {
            throw error;
        }
        console.log("Data: ", data),
            console.table("Data: ", data),
            displayOption()

    })
}
function viewAllEmployees() {
    db.query("SELECT * FROM employee;", function (error, data) {
        if (error) {
            throw error;
        }
        console.table(data);
    })
    displayOption()
}
function addDepartment() {
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
}
function addARole() {
    // const [rows] = db.query("SELECT id, name FROM department");
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





}
function addAnEmployee() {
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
        .catch ((error) => console.error(error));
    })
    });
}
    


function updateRole() {
    displayOption();
}
displayOption()