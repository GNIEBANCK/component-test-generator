import JsonIO from "./JsonIO";
import {ResponseType,IReplacement,ApiUnitResponseGenerator, supportedReplacementStrings} from './genericResponses';

export async function generateComponentTestFiles(scenarios:string[],cases:string[],replacements:object={})
{
    let io = new JsonIO();
    let responsifyer = new ApiUnitResponseGenerator();
    
    for(let s of scenarios)
    {   
        let tokenName= s.split('-')[0]+"-token";
        for(let c of cases)
        {
            let splitupCase = c.split('-');
            let firstWord = splitupCase[1];
            let secondWord = splitupCase[2];
            let method = firstWord === 'list'
                ? "GET"
                : firstWord.toUpperCase();
            let entity = secondWord.endsWith('s')
                ? secondWord
                : secondWord + 's'
            let requestString = method + ' ${content-api}/v1/' + entity + '\nAuthorization: Bearer ${'+tokenName+ "}";
            if(method === 'PATCH' || method === 'POST') requestString += '\ncontent-type: application/json\n\n{\n\t"REQUEST": "HERE"\n}';
            await io.toPlainTextFile(requestString,'../../requests/'+ s +'-' + c +'.req');
            let responseString = responsifyer.getResponse(ResponseType.NO_DATA);
            if(c.endsWith('403')) responseString = responsifyer.getResponse(ResponseType.UNAUTHORIZED);
            else if (c.endsWith('400')) responseString = responsifyer.getResponse(ResponseType.SCHEMA_ERROR);
            else if (c.endsWith('404')) responseString = responsifyer.getResponse(ResponseType.NOT_FOUND,[<IReplacement>{variable:supportedReplacementStrings.ENTITY,value:secondWord.charAt(0).toLocaleUpperCase()+secondWord.substr(1)}]);
            else if (c.endsWith('409')) responseString = responsifyer.getResponse(ResponseType.CONFLICT,[<IReplacement>{variable:supportedReplacementStrings.CONFLICT,value:replacements[supportedReplacementStrings.CONFLICT]}]);
            else if (firstWord === 'list') responseString = responsifyer.getResponse(ResponseType.PAGE_DATA);
            else if (method === 'GET') responseString = responsifyer.getResponse(ResponseType.SINGLE_ITEM_DATA);  
            else if (method === 'POST') responseString = responsifyer.getResponse(ResponseType.POST);          
            await io.toPlainTextFile(responseString,'../../responses/'+s + '-' +c +'.resp');
        }
    }
}