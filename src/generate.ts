import {generateComponentTestFiles} from './utils/generateComponentTestFiles'
import JsonIO from './utils/JsonIO';

async function generate()
{
    let io = new JsonIO();
    let scenarios = (await io.readPlainText('../scenarios.txt')).split('\n');
    let testCases = (await io.readPlainText('../testCases.txt')).split('\n');
    console.log(scenarios);
    console.log(testCases)
    //await generateComponentTestFiles(scenarios,testCases);
}
generate().then(()=>console.log("done")).catch((e)=>console.log(e));