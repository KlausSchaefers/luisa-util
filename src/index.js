import FigmaService from './qux/figma/FigmaService'
import Logger from './qux/core/Logger'
import fs from 'fs';
import {prompt} from 'inquirer';
import chalk from 'chalk';
import fetch from 'node-fetch';
import util from 'util'

/**
 * Enable fetch polyfill
 */
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    globalThis.Headers = fetch.Headers
}
Logger.setLogLevel(-10)


async function download(confFile = './.luisa') {
    console.debug(chalk.blue('---------------------------------------'))
    console.debug(chalk.blue(' Luisa Downlaoder - v. 1.0.3'))
    console.debug(chalk.blue('---------------------------------------'))
    let defaultConf = read_config(confFile)
    const config = await ask_conf(defaultConf)
    let figma = {}
    let qux = {}
    if (config.type === 'Figma') {
        figma = await ask_figma(defaultConf)
        await download_figma(figma.token, figma.id, figma.pages, config.appFile, config.imageFolder)
    } else {
        qux = await ask_qux(defaultConf)
        await download_qux(qux.token, config.appFile, config.imageFolder)
    }
    const save = await ask_save()
    if (save) {
        save_config(config, figma, qux, confFile)
    }
}

function read_config (confFile) {
    let defaultConfig ={
        config: {
            appFile: 'src/views/app.json',
            imageFolder: 'public/img'
        },
        figma:{
            token: '',
            id: '',
            pages: ''
        },
        qux: {
            token: ''
        }  
    }
    if (fs.existsSync(confFile)) {
        console.debug(chalk.green('Using .luisa file to read default config'))
        const content = fs.readFileSync(confFile, 'UTF-8')
        let loadedConf = JSON.parse(content)
        if (loadedConf.config) {
            defaultConfig.config = loadedConf.config
        }
        if (loadedConf.figma) {
            defaultConfig.figma = loadedConf.figma
        }
        if (loadedConf.qux) {
            defaultConfig.qux = loadedConf.qux
        }
    }
    return defaultConfig
}

function save_config(config, figma, qux, confFile){
    console.debug(chalk.red('Save config to .luisa. DO NOT FORGET TO ADD TO .GITIGNORE'))
    var content = JSON.stringify({
        config: config,
        figma:figma,
        qux: qux        
    }, null, 2)
    fs.writeFileSync(confFile, content)
}

async function ask_qux(defaultConf){
    const questions = [
        {
            type : 'input',
            name : 'token',
            default: defaultConf.qux.token,
            message : 'Your Quant-UX Share Token'
        }
    ]
    const answers = await prompt(questions)
    return answers
}

async function download_qux(quxToken, jsonFileTarget, fileFolderTarget, quxServer = 'https://quant-ux.com') {

    return new Promise(async (resolve, reject) => {
        let url = `${quxServer}/rest/invitation/${quxToken}/app.json`
        const response = await fetch(url);
        if (response.status === 200) {
            let app = await response.json();
            let widgetsWithImages = get_images(app)           
            var promisses = widgetsWithImages.map(async w => {
                const streamPipeline = util.promisify(require('stream').pipeline);
                let image = w.style.backgroundImage
                let imageURL = `${quxServer}/rest/images/${quxToken}/${image.url}`
                try {
                    var imageFileTarget = fileFolderTarget + '/' + w.id +'.png'
                    console.debug(chalk.blueBright('  - Write Image: ' + imageFileTarget))              
                    const response = await fetch(imageURL);              
                    if (response.ok) {            
                        w.style.backgroundImage = {
                            url: w.id +'.png'
                        }
                        return streamPipeline(response.body, fs.createWriteStream(imageFileTarget));
                    } else {
                        console.debug(chalk.red(' ! Could not download element: ' + w.name + ' url:' + imageURL))
                    }
                } catch (e) {
                    console.debug(chalk.red(' ! Could not download element: ' + w.name + ' url:' + imageURL))
                    return new Promise(resolve => resolve())
                }
            })

            await Promise.all(promisses)                 
            write_app(app, jsonFileTarget)

            resolve()
        }   
    })

}

function get_images(model) {
    let result = []
    for (let id in model.screens) {
      let screen = model.screens[id]
      if (screen.style && screen.style.backgroundImage) {
        result.push(screen)
      }
    }
    for (let id in model.widgets) {
      let widget = model.widgets[id]
      if (widget.style && widget.style.backgroundImage) {
        result.push(widget)
      }
    }
    return result
}

function write_app(app, jsonFileTarget) {
    console.debug(chalk.blue('  - Write Design: ' + jsonFileTarget))
    var content = JSON.stringify(app, null, 2)
    fs.writeFileSync(jsonFileTarget, content)
}

async function download_figma(figmaAccessKey, figmaFileId, figmaPageId, jsonFileTarget, fileFolderTarget) {

    if (!figmaAccessKey || !figmaFileId) {
        console.debug(chalk.red('Plesse add the figma access token and file id'))
        return
    }

    return new Promise((resolve, reject) => {
      

        var selectedPages = figmaPageId ? figmaPageId.split(',') : []
        /**
         * Start downloading
         */
     
        
        const figmaService = new FigmaService(figmaAccessKey)
        console.debug(chalk.blue('Download Figma file...'))
        if (figmaPageId) {
            console.debug(chalk.blue('Limit to page...' + selectedPages))
        }
        
        try {
            figmaService.get(figmaFileId, true, false, selectedPages).then(async app => {
                console.debug(chalk.blue('Download images:'))
                const streamPipeline = util.promisify(require('stream').pipeline);
                const widgetsWithImages = Object.values(app.widgets).filter(w => {
                    return w.props.figmaImage
                })
                var promisses = widgetsWithImages.map(async w => {
                const imageURL = w.props.figmaImage
                try {
                    var imageFileTarget = fileFolderTarget + '/' + w.id +'.png'
                    console.debug(chalk.blueBright('  -  Write image: ' + imageFileTarget) , chalk.gray('(' + imageURL + ')'))
                    const response = await fetch(imageURL);
                    if (response.ok) {
                    w.style.backgroundImage = {
                        url: w.id +'.png'
                    }
                    return streamPipeline(response.body, fs.createWriteStream(imageFileTarget));
                    }
                } catch (e) {
                    console.debug(chalk.red(' ! Could not download element: ' + w.name + ' url:' + imageURL))
                    return new Promise(resolve => resolve())
                }
                })
                await Promise.all(promisses)
                write_app(app, jsonFileTarget)
            
                console.debug(`\n\n`)
                console.debug(chalk.green('Done!'), 'Now import the JSON file in', chalk.green('Home.vue'))
                resolve()
            })
        } catch (err) {
            console.debug(err)
            reject(err)
        }
    })
}

async function ask_figma(defaultConf) {
    const questions = [
        {
            type : 'input',
            name : 'token',
            default: defaultConf.figma.token,
            message : 'Your Figma Token'
        },
        {
            type : 'input',
            name : 'id',
            default: defaultConf.figma.id,
            message : 'Figma File ID'
        },
        {
            type : 'input',
            name : 'pages',
            default: defaultConf.figma.pages,
            message : 'Pages (as comma seperated list)'
        }
    ]
    const answers = await prompt(questions)
    return answers
}

async function ask_save(){
    const questions = [
        {
            type : 'list',
            name : 'save',
            choices: ["No, do not remember", "Yes, remember"],
            message : 'Remeber Values for next time?'
        }
    ];
    const answers = await prompt(questions)
    return answers.save === 'Yes, remember'
}

async function ask_conf(defaultConf) {
    const questions = [
        {
            type : 'list',
            name : 'type',
            choices: ["Figma", "Quant-UX"],
            message : 'From which design tool do you want to download?'
        },
        {
            type : 'input',
            name : 'imageFolder',
            default: defaultConf.config.imageFolder,
            message : 'Image downlaod folder'
        },
        {
            type : 'input',
            name : 'appFile',
            default: defaultConf.config.appFile,
            message : 'App.json location'
        },
    ];
    const answers = await prompt(questions)
    return answers
}

download()