const express = require ('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const {promisify} = require('util')
const sgMail = require('@sendgrid/mail')

const GoogleSpreadsheet = require ('google-spreadsheet')
const credentials = require('./bugtracker.json')

// Configurações
const docID = "1I0_srILckFuwsLyxuWFAIFS8PncgFQCYZTe68jvvVq0"
const worksheetIndex = 0
const sendGridKey = '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'



app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', async(request, response) => {
    try{
        const doc = new GoogleSpreadsheet(docID)
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({
                        name: request.body.name,
                        email: request.body.email,
                        issueType: request.body.issueType,
                        howToReproduce: request.body.howToReproduce,
                        exceptedOutput: request.body.exceptedOutput,
                        receivedOutput: request.body.receivedOutput,
                        userAgent: request.body.userAgent,
                        userDate: request.body.userDate,
                        source: request.query.source || 'direct'
                    })

        // Se for Crítico
        if(request.body.issueType === "critical"){
            sgMail.setApiKey(sendGridKey);
            const msg = {
                to: 'yuri94cardoso@gmail.com',
                from: 'yuri94cardoso@gmail.com',
                subject: 'BUG critico reportado',
                text: `
                    O usuário ${request.body.name} reportou um problema.
                `,
                html: `
                    O usuário ${request.body.name} reportou um problema.`
        };
        await sgMail.send(msg);
        }
        response.render('success')      
    }

    catch (err){
        response.send('Erro ao enviar o formulário.')
        console.log(err)
    }
})

app.listen(3000, (err) => {
    if(err) {
        console.log("Aconteceu um erro")
    }
    else {
        console.log("BugTracker rodando na porta 3000")
    }
})