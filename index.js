#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const program = require('commander')
const CLI = require('clui');
const Spinner = CLI.Spinner;
const globals = require('./globals')

program
  .version('0.0.1')
  .description('Express Project Manager')
  .command('init [name]', 'install one or more packages').alias('i')
  .command('generate <type> <name>', 'search with optional query').alias('g')
  .command('list', 'list packages installed')
  .command('publish', 'publish the package').alias('p')
.parse(process.argv);

// clear();
// console.log(
//     chalk.white(
//         figlet.textSync('Neoland', { horizontalLayout: 'full' })
//     )
// );



// const status = new Spinner('Authenticating you, please wait...');

// const questions = [
//     {
//         name: 'username',
//         type: 'input',
//         message: 'Enter your GitHub username or e-mail address:',
//         validate: function (value) {
//             if (value.length) {
//                 return true;
//             } else {
//                 return 'Please enter your username or e-mail address.';
//             }
//         }
//     },
//     {
//         name: 'password',
//         type: 'password',
//         message: 'Enter your password:',
//         validate: function (value) {
//             if (value.length) {
//                 return true;
//             } else {
//                 return 'Please enter your password.';
//             }
//         }
//     }
// ];
// inquirer.prompt(questions);

// status.start();

// setTimeout(() => {
//     status.stop()
// }, 4000)
