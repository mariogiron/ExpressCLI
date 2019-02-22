const program = require('commander')
const inquirer = require('inquirer');
const globals = require('./globals')
const fs = require('fs')

function handleGenerate(type, name) {
  console.log(type, name)
}

module.exports = handleGenerate