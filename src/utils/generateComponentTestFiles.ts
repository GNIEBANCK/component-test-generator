import JsonIO from "./JsonIO";
import {ResponseType,IReplacement,ApiUnitResponseGenerator} from './genericResponses';

export async function generateComponentTestFiles()
{
    let io = new JsonIO();
    let responsifyer = new ApiUnitResponseGenerator();
    let scenarios = [
        "superadmin-basic-scenario-"    
    ]

    let cases = [        
        "010-post-content",
        "020-get-content",
        "030-patch-content-with-alias",
        "040-get-content-by-alias",
        "050-post-content-child",
        "060-get-content-child-by-auto-alias",
        "070-patch-content-parent-attach-child",
        "080-get-content-parent-shows-child",
        "081-post-content-child-2",
        "082-patch-content-parent-attach-child-2",
        "083-get-content-parent-shows-both-children",
        "084-patch-content-parent-reorder-children",
        "085-get-content-parent-shows-new-order",
        "086-delete-content-child-2",
        "087-get-content-child-2-confirmed-deleted-404",
        "089-get-content-parent-confirm-missing-child-2",
        "090-post-contributor",
        "100-get-contributor",
        "110-patch-content-parent-with-new-contributor",
        "120-get-content-parent-shows-contributor",
        "121-post-knowledge",
        "122-get-knowledge",
        "123-patch-content-parent-with-new-knowledge",
        "124-post-file",
        "125-get-file",
        "126-patch-content-with-file",
        "127-get-content-shows-file",
        "130-patch-content-child-name",
        "131-get-content-parent-shows-updated-child",
        "132-patch-contributor-email",
        "133-get-content-parent-shows-contributor-email",
        "140-delete-content-parent",
        "150-get-content-confirm-deleted-404",
        "160-get-content-confirm-child-deleted-404",
        "170-get-contributor-confirm-remains",
        "180-get-knowledge-confirm-remains",
        "190-get-file-confirm-remains",
        "200-delete-contributor",
        "210-get-contributor-confirm-deleted-404",
        "220-delete-knowledge",
        "230-get-knowledge-cofirm-deleted-404",
        "240-delete-file",
        "250-get-file-confirm-deleted-404"
    ]    

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
            await io.toPlainTextFile(requestString,'../../requests/'+s+c +'.req');
            let responseString = responsifyer.getResponse(ResponseType.NO_DATA);
            if(c.endsWith('403')) responseString = responsifyer.getResponse(ResponseType.UNAUTHORIZED);
            else if (c.endsWith('404')) responseString = responsifyer.getResponse(ResponseType.NOT_FOUND,[<IReplacement>{variable:"[[entity]]",value:secondWord.charAt(0).toLocaleUpperCase()+secondWord.substr(1)}]);
            else if (firstWord === 'list') responseString = responsifyer.getResponse(ResponseType.PAGE_DATA);
            else if (method === 'POST' || method === 'GET') responseString = responsifyer.getResponse(ResponseType.SINGLE_ITEM_DATA);            
            await io.toPlainTextFile(responseString,'../../responses/'+s+c +'.resp');
        }
    }
}
