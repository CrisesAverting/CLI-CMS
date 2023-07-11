const db = require('./db/connection');
const inquirer = require('inquirer');
 
const initialOptions =[
    {
        name:"View all departments",
        value:"viewAllDepartments"
        },
    {
        name: "view all roles",
        value: "viewAllRoles"
    },
    {
        name:"view all employees",
        value:"viewAllEmployees"
        },
        {
            name: "add a department",
            value:"addADepartment"
            },
            {
                name: "add a role",
                value:"addRole"
                },
    {
        name: "add an employee",
        value:"addAnEmployee"
        },
    {
        name: "update an employee Role",
        value:"updateRole"
        },
        {
            name:"quit",
            value: "exit"
        }
    
    
    
]




//    add a role, add an employee,
//      update an employee role


function getDepartments() {
    
    // Any database request is ALSO AN ASYNC REQUEST 
    db.query("SELECT * FROM department;", function(error, data) {
        if(error) {
            throw error;
        }
        console.log("Data: ", data);
        console.table("Data: ", data);

        // IF we want to use this dataset
        // return data;  --> return to calling function
       // maybe we restructure the database data(?)
       // let tempObj = []

        inquirer.prompt({
            type: 'list',
            name: 'departments',
            message: "What department would you like to see",
            choices: data
        }).then(answers => {
            console.log(answers);
            // call the main user prompt function
        }).catch(err => {
            console.log(err);
        })
    })
}
function displayOption(){
    inquirer.prompt([{
        type:'list',
        name:'choices',
        message:'Pick an option',
        choices: initialOptions,
}])
    .then(answers => {
        //switch statement for possible option
        switch(answers.choices){
            case 'viewAllEmployees':
                console.log("view employees")
                //add viewAllEmployee options here
                break;
                case 'viewAllDepartments':
                console.log("view departments")
                //add viewDepartments options here
                displayDepartments();
                    break;
                    case ' addAnEmployee':
                        console.log("add employee")
                        //add addANPloyee options here
                        default: process.exit()
        }
        console.log(answers);
    })
}
function displayDepartments(){
    db.query("SELECT * FROM department;", function (error, data) {
        if (error) {
            throw error;
        }
        // console.log("Data: ", data);
        console.table(data);
    displayOption()
})
}
function addDepartment(){
    displayOption()
}
function addAnEmployee(){
    displayOption()
}
function addRole(){
    displayOption()
}
function viewAllEmployees(){
    displayOption()
}
function addDepartment(){
    displayOption()
}
function viewAllRoles(){
    db.query("SELECT * FROM ")
    displayOption()
}



displayOption();