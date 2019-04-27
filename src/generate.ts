import {generateComponentTestFiles} from './utils/generateComponentTestFiles'
async function generate()
{
    await generateComponentTestFiles();}

generate().then(()=>console.log("done")).catch((e)=>console.log(e));