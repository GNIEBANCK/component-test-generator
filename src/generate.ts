const commander = require('commander');
import {generateComponentTestFiles} from './utils/generateComponentTestFiles'
import JsonIO from './utils/JsonIO';

commander.option('-s, --scenarios [string]', 'scenario txt file name')       
         .option('-c, --cases [string]', 'cases txt file name')       
         .parse(process.argv);

async function generate()
{
    let scenariosFile = commander.scenarios? "../../"+commander.scenarios:undefined;
    let casesFile = commander.scenarios? "../../"+commander.scenarios:undefined;

    let hardCodedScenarios = [
        "billingadmin",
        "courseadmin",
        "instructor",
        "ta",
        "student"
    ]

    let hardCodedTestCases = [        
        "200-post-coursewareuser-403",
        "210-post-coursewareadmin-403",
        "220-post-newsletter-subscriber-403",
    ]  

    let io = new JsonIO();
    let scenarios = hardCodedScenarios.length>0? hardCodedScenarios : (await io.readPlainText(scenariosFile || 'scenarios.txt')).split('\n');
    let testCases =hardCodedTestCases.length>0? hardCodedTestCases : (await io.readPlainText(casesFile || 'testCases.txt')).split('\n');
    console.log(scenarios);
    console.log(testCases);
    await generateComponentTestFiles(scenarios,testCases);
}
generate().then(()=>console.log("done")).catch((e)=>console.log(e));
