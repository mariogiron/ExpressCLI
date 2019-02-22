#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const program = require('commander')
const CLI = require('clui');
const Spinner = CLI.Spinner;
const globals = require('./globals')
const expgen = require('./expressgen-generate')

program
  .version('0.0.1')
  .description('Express Project Manager')
  .command('init', 'create new ExpressJS project').alias('i')  
  .command('generate <type> <name>', 'generate different files for your ExpressJS projects').alias('g')
  .action((cmd, type, name) => {
    expgen(type, name)
  })
.parse(process.argv);