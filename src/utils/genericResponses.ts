
export enum ResponseType{
    FORBIDDEN = "forbidden",
    UNAUTHORIZED = "unauthorized",
    NO_DATA = "no_data",
    SINGLE_ITEM_DATA = "single_item_data",
    LIST_DATA = "list_data",
    PAGE_DATA = "page_data",
    NOT_FOUND = "not_found",
    POST = "post"
}

export interface IReplacement
{
    variable:string;
    value:string;
}

export class ApiUnitResponseGenerator
{
    privateResponse:Map<ResponseType,string>;
    constructor()
    {
        this.privateResponse = new Map<ResponseType,string>()
        this.privateResponse.set(ResponseType.FORBIDDEN,notAuthenticated);
        this.privateResponse.set(ResponseType.UNAUTHORIZED,notAuthorized);
        this.privateResponse.set(ResponseType.NO_DATA,noDataResponse);
        this.privateResponse.set(ResponseType.SINGLE_ITEM_DATA,dataResponse);
        this.privateResponse.set(ResponseType.LIST_DATA,listResponse);
        this.privateResponse.set(ResponseType.PAGE_DATA,pageResponse);
        this.privateResponse.set(ResponseType.NOT_FOUND,notFoundResponse);
        this.privateResponse.set(ResponseType.POST,createResponse);
    }
    public getResponse(type:ResponseType,replacesments:IReplacement[]=[])
    {
        return this.plugInVariables(this.privateResponse.get(type),replacesments);
    }

    private plugInVariables(response:string,replacements:IReplacement[]):string
    {
        for(let r of replacements)
        {
            let responseArr = response.split(r.variable);
            response = responseArr.join(r.value);
        }
        return response;
    }
}

var notAuthorized = '403' + '\n' 
+ 'content-type: application/json' + '\n\n'
+ '{'  + '\n' 
+ '\t"statusCode":403' + ',\n' 
+ '\t"message":"You are not authorized to access this resource."' + ',\n' 
+ '\t"details":"[\\\\s\\\\S]*"' + '\n' 
+ '}'

var notFoundResponse = '404' + '\n' 
+ 'content-type: application/json' + '\n\n'
+ '{'  + '\n' 
+ '\t"statusCode":404' + ',\n' 
+ '\t"message":"[[entity]] does not exist."' + ',\n' 
+ '\t"details":"[\\\\s\\\\S]*"' + '\n' 
+ '}'

var notAuthenticated = '403' + '\n' 
+ 'content-type: application/json' + '\n\n'
+ '{'  + '\n' 
+ '\t"statusCode":403' + ',\n' 
+ '\t"message":"Forbidden."' + ',\n' 
+ '\t"details":"[\\\\s\\\\S]*"' + '\n' 
+ '}'

var noDataResponse = "204";
var dataResponse = '200' + '\n' 
+ 'content-type: application/json' + '\n\n'
+ '{'  + '\n' 
+ '\t"DATAKEY":"DATAVALUE"' + '\n' 
+ '}'

var listResponse = '200' + '\n' 
+ 'content-type: application/json' + '\n\n'
+ '{'  + '\n' 
+ '\t"start":0' + ',\n' 
+ '\t"total":0' + ',\n' 
+ '\t"items":[]' + '\n' 
+ '}'

var pageResponse = '200' + '\n' 
+ 'content-type: application/json' + '\n\n'
+ '{'  + '\n' 
+ '\t"nextPageToken": "",' + '\n' 
+ '\t"items":[]' + '\n' 
+ '}'

var createResponse = '204' + '\n' 
+ 'content-type: application/json' + '\n\n'
+ '{'  + '\n' 
+ '\t"id": ".*",' + '\n' 
+ '}'