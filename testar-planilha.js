const GoogleSpreadsheet = require ('google-spreadsheet')
const credentials = require('./bugtracker.json')
const {promisify} = require('util')

const addRowToSheet = async() => {
    const doc = new GoogleSpreadsheet('1I0_srILckFuwsLyxuWFAIFS8PncgFQCYZTe68jvvVq0')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({name: 'Yuri', email: 'Teste'})
}
addRowToSheet()

/*
const doc = new GoogleSpreadsheet('1I0_srILckFuwsLyxuWFAIFS8PncgFQCYZTe68jvvVq0')
doc.useServiceAccountAuth(credentials, (err) => {
    if(err) {
        console.log("Não foi possível abrir a planilha")
    }
    else {
        console.log("Planilha aberta.")
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({name: 'Yuri', email: 'Teste'}, err => {
                console.log("linha inserida")
            })
        })
    }
})
*/
