const program = require('commander')
const inquirer = require('inquirer');
const globals = require('./globals')
const fs = require('fs')
const shell = require('shelljs');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const ora = require('ora')
const ejs = require('ejs')
const path = require('path')

program
    .option('-v --view <view>', 'Select view engine pug/hbs/none', /^(pug|hbs)$/i)
    .option('-n --dir <dir>', 'Define your projects name')
    .parse(process.argv);


let questions = [
    {
        name: 'dir',
        type: 'input',
        message: 'Name your directory project',
        when: () => !program.dir,
        validate: (input, answers) => {
            if (globals.forbiddenNames.includes(input.toLowerCase())) return 'You cannot use this name for your project directory. Please try another one.'
            if (fs.existsSync(`./${input}`)) return `The directory ${input} already exists`
            return true
        }
    },
    {
        name: 'view',
        type: 'list',
        message: 'Which template engine do you want to use',
        choices: ['pug', 'hbs', 'none'],
        when: () => !program.view
    }
]

inquirer.prompt(questions).then(answers => {

    let mainDir = program.dir || answers.dir
    let viewEngine = program.view || answers.view

    if (fs.existsSync(`./${mainDir}`)) {
        console.log('This directory already exists')
        process.exit(1)
    }

    let directories = [
        `./${mainDir.trim()}/bin`,
        `./${mainDir.trim()}/views`,
        `./${mainDir.trim()}/routes`,
        `./${mainDir.trim()}/public/images`,
        `./${mainDir.trim()}/public/javascripts`,
        `./${mainDir.trim()}/public/stylesheets`
    ]

    const spinner = ora('Recovering npm libraries version...').start();

    shell.mkdir('-p', ...directories);

    // package.json

    const packageJson = {
        name: mainDir,
        version: '0.0.1',
        private: true,
        scripts: {
            start: 'node ./bin/www'
        },
        dependencies: {}
    }

    if (program.view !== 'none') {
        globals.libraries.push(program.view)
    }

    recoverVersions().then(dependencies => {
        packageJson.dependencies = dependencies

        fs.writeFileSync(`./${mainDir}/package.json`, JSON.stringify(packageJson, null, 4))

        spinner.succeed('Recovering npm libraries version...')
        spinner.color = 'yellow';
        spinner.text = 'Installing npm dependencies...';
        spinner.start()

        exec(`cd ${mainDir} && npm install`, (err, output) => {
            if (err) {
                console.log('Error. ' + err.message)
                process.exit(-1)
            }
            spinner.succeed('Installing npm dependencies...')
            spinner.color = 'blue';
            spinner.text = 'Creating project structure...';
            spinner.start()

            let viewEngine = program.view === 'none' ? null : program.view

            let app = loadTemplate('app.js')
            app.locals.view = viewEngine
            fs.writeFileSync(path.join(mainDir, 'app.js'), app.render())

            let www = loadTemplate('www')
            www.locals.name = mainDir
            fs.writeFileSync(path.join(mainDir, 'bin', 'www'), www.render())

            let indexRouter = loadTemplate('index.js')
            indexRouter.locals.view = viewEngine
            fs.writeFileSync(path.join(mainDir, 'routes/index.js'), indexRouter.render())

            let usersRouter = loadTemplate('users.js')
            usersRouter.locals.view = viewEngine
            fs.writeFileSync(path.join(mainDir, 'routes/users.js'), usersRouter.render())

            if (viewEngine) {
                let layoutView = loadTemplate(`layout.${viewEngine}`)
                fs.writeFileSync(path.join(mainDir, `views/layout.${viewEngine}`), layoutView.render())

                let indexView = loadTemplate(`index.${viewEngine}`)
                fs.writeFileSync(path.join(mainDir, `views/index.${viewEngine}`), indexView.render())

                let errorView = loadTemplate(`error.${viewEngine}`)
                fs.writeFileSync(path.join(mainDir, `views/error.${viewEngine}`), errorView.render())
            }

            spinner.succeed('Todo correcto')
            
        })
    })
})

let recoverVersions = () => {
    return new Promise((resolve, reject) => {
        let dependencies = {}
        let executions = []
        for (let i = 0; i < globals.libraries.length; i++) {
            executions.push(new Promise((resolve, reject) => {
                exec(`npm show ${globals.libraries[i]} version`, (err, code) => {
                    let obj = {}
                    obj[globals.libraries[i]] = code.toString().trim()
                    resolve(obj)
                })
            }))
        }
        Promise.all(executions).then(result => {
            let res = {}
            result.map(item => {
                res[Object.keys(item)[0]] = item[Object.keys(item)[0]]
            })
            resolve(res)
        })
    })
}

/**
 * Load template file.
 */

function loadTemplate(name) {
    var contents = fs.readFileSync(path.join(__dirname, 'templates', (name + '.ejs')), 'utf-8')
    var locals = Object.create(null)

    function render() {
        return ejs.render(contents, locals)
    }

    return {
        locals: locals,
        render: render
    }
}