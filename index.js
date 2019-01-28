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
.parse(process.argv);