const path = require('path');
const csv=require('csvtojson');
import * as fs from 'fs';
import * as json2xls from 'json2xls';
export default class JsonIO {
    workingDirectory: string;
    constructor() {
        this.workingDirectory = __dirname;
    }

    async pwd():Promise<void>
    {
        console.log(this.workingDirectory);
    }

    async write(json: Object, fileName: string):Promise<void>
    {
        let pathString = path.join(this.workingDirectory, fileName);
        try {
            fs.writeFile(pathString, JSON.stringify(json), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            console.log("json file created: " + pathString) ;
        }
        catch (e) {
            console.log("error writing file: " + pathString);
        }
    }
    
    async read(fileName: string)
    {
        let pathString = path.join(this.workingDirectory, fileName);
        try {
            return JSON.parse(fs.readFileSync(pathString).toString());
        }
        catch (e) {
            console.log("error reading file: " + pathString);
            return[];
        }
    }

    async readPlainText(fileName: string):Promise<string>
    {
        let pathString = path.join(this.workingDirectory, fileName);
        try {
            return fs.readFileSync(pathString).toString();
        }
        catch (e) {
            console.log("error reading file: " + pathString);
            return "FAIL";
        }
    }

    async toSpreadSheet(json: Object, fileName: string):Promise<void>
    {
        var xls = json2xls(json);
        let pathString = path.join(this.workingDirectory, fileName + ".xlsx");
        try {
            fs.writeFileSync(pathString, xls, 'binary');
            console.log("file created: " + pathString);
        }
        catch (e) {
            console.log("error creating spreadsheet: " + pathString);
            console.log(e);
        }
    }

    async textToStringArray(fileName:string): Promise<string[]>
    {
        let pathString = path.join(this.workingDirectory, fileName);

        try
        {
            return fs.readFileSync(pathString).toString().split('\n');
        }
        catch (e) {
            console.log("error reading file: " + pathString);
            return [];
        }
    }

    async toPlainTextFile(input:string,fileName) :Promise<void>
    {
        let pathString = path.join(this.workingDirectory, fileName);
        try {
            fs.writeFile(pathString, input, function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            console.log("text file created: " + pathString);
        }
        catch (e) {
            console.log("error writing file: " + pathString);
        }
    }

    async listFilesInDirectory(directory:string):Promise<string[]>
    {   
        let pathString = path.join(this.workingDirectory, directory);
        try {
            return fs.readdirSync(pathString);
        }
        catch (e) {
            console.log("error reading directory: " + pathString,e);
            return []
        }
    }

    async csvToJsonArray(fileName:string)
    {
        let pathString = path.join(this.workingDirectory, fileName);
        return await csv().fromFile(pathString);
    }
}