//data types of attributes in POJOs




function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function decapitalize(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
function toSnakeCase(key) {
    var result = key.replace(/([A-Z])/g, " $1");
    return (result.split(' ').join('_').toLowerCase()).toUpperCase();
}


//preventing when buttons clicked scrolling to the top of page
document.querySelectorAll("button").forEach(button => button.addEventListener("click", (e) => {
    e.preventDefault();
    //get current x and y position
    var x = window.scrollX;
    var y = window.scrollY;
    window.scroll(x, y);// set it
}))

//select all on click
document.querySelector("#copyRequestAllPojo").addEventListener("click", function (e) {

    document.querySelector("#requestAndDtoAllTextArea").select();
    document.execCommand('copy');
    //deselect
    document.getSelection().removeAllRanges();

});

document.querySelector("#submitButton").addEventListener("click", (e) => {
    //alert("button pressed");
    location.href = "./index.html";
})


//select all text from text Area and submit
document.querySelector("#copyRequestAllPojo").addEventListener("click", function (e) {

    document.querySelector("#requestAndDtoAllTextArea").select();
    document.execCommand('copy');
    //deselect
    document.getSelection().removeAllRanges();

});





function insertTextToTextAreaById(text, textAreaId) {
    //document.getElementsByClassName("textarea").value += text + "\n";
    document.querySelector(`#${textAreaId}`).value += text + "\n";
}

function typeOf(variable) {
    if (variable instanceof Array) {
        return "array";
    } else if (variable instanceof Object) {
        return "object";
    }
    return "string";
}

function typeFromString(str) {
    str = str.toLowerCase();
    if (str.includes("dto")) {
        return "object";
    } else if (str.includes("list")) {
        return "array";
    } else {
        return "normal";
    }
}


function listToPojo(list) {
    let obj = {};

    list.forEach(element => {
        obj[element[0]] = element[1];
    })
    return obj;
}

let dataTypes = {
    int32: "int",
    int64: "long",
    bool: "Boolean",
    string: "String",
    double: "double",
    listDto: ""//düşünülecek


}


var str = '{"names":[' +                // crate JSON object
    '{"first":"Hakuna","lastN":"Matata" },' +
    '{"first":"Jane","lastN":"Doe" },' +
    '{"first":"Air","last":"Jordan" }], "first": "Jane", "last": "Doe"} ';
let obj = JSON.parse(str);



let jsonMap = { "first": "Jane", "last": "Doe" };


//get keys from json
function getKeysFromJsonResponse(jsonMap) {
    let keysList = Object.keys(jsonMap);
    console.log(keysList);
}


//key-type jsonu oluşturmaya çalış(key ve tipin list olarak geldiğini varsay)

function makeKeyTypePairAsJson(keyList, typeList) {
    if (keysList.length != typeList.length) {

        return alert("keyList and typeList have not same size!!!");;
    }
    let key_typePairJson = {};
    for (let i = 0; i < keyList.length; i++) {
        key_typePairJson[keysList[i]] = typeList[i];

    }
    console.log(key_typePairJson);
    return key_typePairJson;
}


function createListOfAttributesPart(key_typePairJson) {

    let list = [];
    for (let each in key_typePairJson) {
        let ifList = key_typePairJson[each].toString().toLowerCase().includes("list") ? " = null" : "";
        let element = `\tprivate ${key_typePairJson[each]} ${each}${ifList};`;
        list.push(element);
        console.log(element);
    }
    return list;

}

function createSetterSingle(key, type) {
    let string = `\tpublic void set${capitalize(key)}(${type} ${key}) {\n\t\tthis.${key} = ${key};\n\t}`
    return string;
}

function createGetterSingle(key, type) {

    let string = `\tpublic ${type} get${capitalize(key)}() {\n\t\treturn = this.${key};\n\t}`
    return string;
}





let globalQueueObjectBody = [];
let globalQueueObjectName = [];
let globalQueue_ALL_POJO_TEXT_TOTAL = [];
function recursivePojoCreate(jsonOrList, reqResDto, fileName) {

    //create data storages
    let key_typePairJson = {};
    let attributeName = "";
    let typeName = "";
    let ALL_POJO_TEXT_TOTAL = "";
    let ALL_POJO_TEXT_TOTAL_FROM_RETURN = "";

    //loop throuhg attributes
    //if array loop .[0] or directly object itself

    let typeJson = (jsonOrList instanceof Array ? jsonOrList[0] : jsonOrList);

    for (let eachAttribute in typeJson) {

        if (typeOf(typeJson[eachAttribute]) == "array") {
            attributeName = eachAttribute;
            typeName = "List<" + capitalize(attributeName).concat("Dto") + ">";
            key_typePairJson[attributeName] = typeName;

            //push to queue
            //let newObject = {};
            //newObject[eachAttribute] = typeJson[eachAttribute][0];
            globalQueueObjectBody.push(typeJson[eachAttribute][0]);
            globalQueueObjectName.push(eachAttribute);

        } else if (typeOf(typeJson[eachAttribute]) == "object") {
            attributeName = eachAttribute;
            typeName = capitalize(attributeName).concat("Dto");
            key_typePairJson[attributeName] = typeName;

            //push to queue
            //let newObject = {};
            // newObject[eachAttribute] = typeJson[eachAttribute];
            globalQueueObjectBody.push(typeJson[eachAttribute]);
            globalQueueObjectName.push(eachAttribute);


        } else {//string
            attributeName = eachAttribute;
            typeName = typeJson[eachAttribute];
            key_typePairJson[attributeName] = typeName;
        }

    }


    ALL_POJO_TEXT_TOTAL = createReqResDto(key_typePairJson, reqResDto, fileName);
    globalQueue_ALL_POJO_TEXT_TOTAL.push(ALL_POJO_TEXT_TOTAL);


    if (globalQueueObjectBody.length != 0) {
        let fileNameDto = capitalize(globalQueueObjectName.shift());
        let queueFirstElement = globalQueueObjectBody.shift();
        recursivePojoCreate(queueFirstElement, "Dto", fileNameDto);
    }

}



//there should be bigger function calling this for every nested objects or list
//getters and setter needs key-type pairs 
/*
key_typePairJson : JSON = key-type pair json
isItReqOrRes : String = Request/Response file?
fileName : String = fileName of req/res

*/
function createReqResDto(key_typePairJson, isItReqOrRes, fileName) {

    const MAIN_CLASS_NAME = `public class ${fileName}${isItReqOrRes} implements Serializable {\n`;

    let listOfAttributesPart = createListOfAttributesPart(key_typePairJson);

    let listOfSettersPart = [];
    let listOfGettersPart = [];
    for (let each in key_typePairJson) {
        //setters
        let setterSingle = createSetterSingle(each, key_typePairJson[each]);
        listOfSettersPart.push(setterSingle);

        //getters
        let getterSingle = createGetterSingle(each, key_typePairJson[each]);
        listOfGettersPart.push(getterSingle);

        console.log(setterSingle);
    }


    let TOTAL_SECTION = [];
    let getterSetterSection = "\n";
    let attributesSection = "";
    //parse getters and setters
    for (let i = 0; i < listOfAttributesPart.length; i++) {
        let attribute = `${listOfAttributesPart[i]}\n`;
        let string = `${listOfGettersPart[i]}\n${listOfSettersPart[i]}\n`;
        attributesSection += attribute;
        getterSetterSection += string;

    }

    TOTAL_SECTION = MAIN_CLASS_NAME.concat(attributesSection).concat(getterSetterSection).concat("}");
    return TOTAL_SECTION;

}



getKeysFromJsonResponse(jsonMap);
getKeysFromJsonResponse(obj);

let keysList = ["first", "last"];
let typeList = ["String", "int"];
makeKeyTypePairAsJson(keysList, typeList);

console.log(createSetterSingle("first", "int"));
console.log(createGetterSingle("first", "int"));

let pair = makeKeyTypePairAsJson(keysList, typeList);
let text = createReqResDto(pair, "Request", "MainClassName");
console.log(text);

//insertText(text);


//**CREATE SERVICE FROM POJO(generated from JSON-TO-POJO SECTION) */


//functions

function searchDtoNameFromListOfPojo(nameOfSearchedDtoOrList, listOfPojo) {
    let isFound = false;
    let counter = 0;
    let mainClassName;
    for (let element of listOfPojo) {
        //delete \t character from string and divide each line by \n character, split returnns list
        element_asList = (element.toString().replaceAll("\t", "")).split("\n");

        //if line includes one of these, it means that it is starting line of an object declaration
        let isItContains_public_class = element_asList[0].includes("public class");
        let isItContains_implements = element_asList[0].includes("implements");
        //get the main class name
        if (isItContains_implements || isItContains_public_class) {
            mainClassName = element_asList[0].replace("public class ", "").split(" ")[0];

            if (nameOfSearchedDtoOrList == mainClassName) {
                isFound = true;
                break;
            }
        }
        counter++;
    }

    if (isFound)
        return listOfPojo[counter];
    else
        return null;


}

function searchParentNameOf_classFromPojo(className, POJO) {

    let isFound = false;
    let parentClassName;
    for (let element of POJO) {
        element_asList = (element.toString().replaceAll("\t", "")).split("\n");

        parentClassName = element_asList[0].replace("public class ", "").split(" ")[0];
        let attributesPart = [];
        //get the every line until u reach public word because thats where getter and setters begin
        element_asList.forEach(eachLine => {
            if (eachLine.includes("private")) {
                if (eachLine.includes(className)) {
                    isFound = true;

                }
                //delete the "private", ";", "=","null" from text
                let line = eachLine.replace("private ", "").replace(";", "").replace(" = ", "").replace("null", "");
                let typeAttributePair = line.split(" ");
                attributesPart.push(typeAttributePair);
            }
        });

        //loop through attribute type-pair
        for (let pair of attributesPart) {
            let attributeType = pair[0];

            if (attributeType.includes(className)) {
                return parentClassName;
            }
        }
    }

    return null;

}


let numberOfIndentations = 0;
let GLOBAL_ALL_REQUEST_TEXT = "";
function create_serviceRequestIMap(element, POJO, numberOfIndentations) {
    //delete \t character from string and divide each line by \n character, split returnns list
    element_asList = (element.toString().replaceAll("\t", "")).split("\n");


    //if line includes one of these, it means that it is starting line of an object declaration
    let isItContains_public_class = element_asList[0].includes("public class");
    let isItContains_implements = element_asList[0].includes("implements");
    let isItRootClass = element == POJO[0] ? true : false;

    //get the main class name
    if (isItContains_implements || isItContains_public_class) {
        let mainClassName = element_asList[0].replace("public class ", "").split(" ")[0];

        //get the attributes part of object until u reach getter setter part
        let attributesPart = [];
        //get the every line until u reach public word because thats where getter and setters begin
        element_asList.forEach(eachLine => {
            if (eachLine.includes("private")) {
                //delete the "private", ";", "=","null" from text
                let line = eachLine.replace("private ", "").replace(";", "").replace(" = ", "").replace("null", "");
                let typeAttributePair = line.split(" ");
                attributesPart.push(typeAttributePair);
            }
        })

        //loop through attribute type-pair
        attributesPart.forEach(pair => {
            let attributeName = pair[1];
            let attributeType = pair[0];

            if (typeFromString(attributeType) == "normal") {//normal 
                let soloElement = createSingle_serviceRequestIMap(attributeName, attributeType, mainClassName, isItRootClass, numberOfIndentations);
                insertTextToTextAreaById(soloElement, "responsePojoTextArea");
                GLOBAL_ALL_REQUEST_TEXT += "\n" + soloElement;
            } else {//array or object


                //search  dto name of list or object from list
                let nameOfPojo = attributeType.replace("<", "").replace(">", "").replace("List", "");
                let dtoOrListFound = searchDtoNameFromListOfPojo(nameOfPojo, POJO);
                if (dtoOrListFound) {
                    let parentObjectName = searchParentNameOf_classFromPojo(nameOfPojo, POJO);
                    //parent table name
                    let parentDecapNameOfPojo = decapitalize(parentObjectName);
                    let parentDto = parentDecapNameOfPojo.replace("Dto", "");
                    let parentTableName = parentDto.includes("List") ? parentDto : parentDto.concat("List");
                    parentTableName = parentTableName.replace("Dto", "");
                    parentTableName = toSnakeCase(parentTableName);

                    //print the list itaration part
                    //we will store it as a list of text, each line will have an index

                    let SERVICE_TEXT_LIST1 = [];
                    let SERVICE_TEXT_LIST2 = [];

                    let decapNameOfPojo = decapitalize(nameOfPojo);
                    let dto = decapNameOfPojo.replace("Dto", "");
                    let arrayListName = dto.includes("List") ? dto : dto.concat("List");
                    SERVICE_TEXT_LIST1[0] = `\n${"\t".repeat(numberOfIndentations)}List<${nameOfPojo}> ${arrayListName} = new ArrayList<${nameOfPojo}>();\n`
                    //tableName
                    let tableName = dto.includes("List") ? dto : dto.concat("List");
                    tableName = tableName.replace("Dto", "");
                    tableName = toSnakeCase(tableName);
                    //
                    SERVICE_TEXT_LIST1[1] = `${"\t".repeat(numberOfIndentations)}if (imap.containsKey(${tableName}) && imap.get(${tableName}) != null && !imap.get(${tableName}).isEmpty()){\n`
                    SERVICE_TEXT_LIST1[2] = `${"\t".repeat(1 + numberOfIndentations)}for(int i = 0; i< iMap.getSize(${tableName}); i++) {\n`
                    let dtoName = dto.replace("List", "").replace("Dto", "");
                    SERVICE_TEXT_LIST1[3] = `${"\t".repeat(2 + numberOfIndentations)}${nameOfPojo} ${dtoName} = new ${nameOfPojo}();`;
                    insertTextToTextAreaById(SERVICE_TEXT_LIST1, "responsePojoTextArea");
                    GLOBAL_ALL_REQUEST_TEXT += "\n" + SERVICE_TEXT_LIST1;

                    //recursive call
                    numberOfIndentations += 2;
                    create_serviceRequestIMap(dtoOrListFound, POJO, numberOfIndentations);
                    numberOfIndentations -= 2;

                    SERVICE_TEXT_LIST2[0] = `${arrayListName}.add(${dtoName});\n`
                    SERVICE_TEXT_LIST2[1] = (`}\n`).replace(`${"\t".repeat(numberOfIndentations - 2)}`, "");
                    SERVICE_TEXT_LIST2[2] = (`${parentObjectName}.set${capitalize(arrayListName)}(${arrayListName});\n`).replace(`${"\t".repeat(numberOfIndentations - 2)}`, "");
                    SERVICE_TEXT_LIST2[3] = (`}\n`).replace(`${"\t".repeat(numberOfIndentations - 2)}`, "");
                    insertTextToTextAreaById(SERVICE_TEXT_LIST2, "responsePojoTextArea");
                    GLOBAL_ALL_REQUEST_TEXT += "\n" + SERVICE_TEXT_LIST2;
                } else {
                    throw "Could not find the dto from pojo list";
                }
            }

        });
    }
}

function createTotal_serviceRequestIMap(POJO, numberOfIndentations) {
    //if it is list loop through, else directly start
    if (typeOf(POJO) == "array") {
        /*
        POJO.forEach(element => {//element here pojo as string
            create_serviceRequestIMap(element, POJO);
        })
        */
        create_serviceRequestIMap(POJO[0], POJO, numberOfIndentations);
    } else {//if normal
        create_serviceRequestIMap(element, POJO), numberOfIndentations;
    }





    //convert pojo text to list line by line

    //delete \t character from string and divide each line by \n character, split returnns list
    let ALL_POJO_TEXT_LIST = (ALL_POJO_TEXT.toString().replaceAll("\t", "")).split("\n");

    ALL_POJO_TEXT_LIST.forEach(element => {
        //if line includes one of these, it means that it is starting line of an object declaration
        let isItContains_public_class = element.includes("public class");
        let isItContains_implements = element.includes("implements");

        if (isItContains_implements || isItContains_public_class) {

            //get the attributes part of object until u reach getter setter part
            let attributesPart = {};

            //get the every line until u reach public word because thats where getter and setters begin
            while (!element.includes("public")) {
                //delete the "private", ";", "=","null" from text
                let line = element.replace(" ", "").replace("private", "").replace(";", "").replace("=", "").replace("private", "").replace("null", "");
                let typeAttributePair = line.split(" ");
            }

        }
    })

    return ALL_POJO_TEXT_LIST;
}

//
function createSingle_serviceRequestIMap(attributeName, attributeType, mainPojoName, isItRootClass, numberOfIndentations) {
    let dto = decapitalize(mainPojoName).replace("Dto", "");
    let dtoName = decapitalize(mainPojoName).replace("Dto", "").replace("List", "");
    let INPUT_TEXT = "";
    //tableName
    let tableName = dto.includes("List") ? dto : dto.concat("List");
    tableName = tableName.replace("Dto", "");
    tableName = toSnakeCase(tableName);
    //
    if (isItRootClass) {
        let dtoName = decapitalize(mainPojoName).replace("Dto", "").replace("List", "");
        INPUT_TEXT = `${dtoName}.set${capitalize(attributeName)}(iMap.get${capitalize(attributeType)}("${toSnakeCase(attributeName)}"));`;
    } else {
        INPUT_TEXT = `${"\t".repeat(numberOfIndentations)}${dtoName}.set${capitalize(attributeName)}(iMap.get${attributeType}("${tableName}", i, "${toSnakeCase(attributeName)}"));`;
    }
    return INPUT_TEXT;
}
//creates table for dto or list

let attributesKeyTypePairOfPojo = {
    "cardNo": "string",
    "cardGuid": "double",
    "totalAmnt": "int"
};



//*****getting json as text */



let jsonOrList5 = [
    {
        "cardNo": "string",
        "cardStatChangeDate": "date",
        "cardPointInfo": {
            "earnedPoint": "int",
            "usedPoint": "double",
            "campaignPoint": "BigDecimal",
            "debtInfoList2": [
                {
                    "currency": "int",
                    "totalAmnt": "double",
                    "debtInfoList3": [
                        {
                            "currency": "int",
                            "totalAmnt": "string"
                        }
                    ]
                }
            ],
            "avaliablePoint": "int"
        },
        "debtInfoList": [
            {
                "currency": "string",
                "totalAmnt": "int"
            }
        ]
    }
];




let jsonText = [
    {
        "cardNo": "string",
        "cardGuid": "int",
        "cardStatChangeDate": "date",
        "limitIncrease": "string",
        "autoLimitIncrease": "boolean",
        "reserveInfo": {
            "reserveRatio": "double",
            "reserveAmount": "double"
        },
        "cardPointInfo": {
            "earnedPoint": "int",
            "usedPoint": "double",
            "campaignPoint": "int",
            "avaliablePoint": "int"
        },
        "debtInfoList": [
            {
                "currency": "double",
                "totalAmnt": "int"
            }
        ],
        "interestRates": [
            {
                "currencyCode": "double",
                "currencyDescription": "string",
                "salesInterestRate": "int",
            }
        ],
        "debitAccountList": [
            {
                "accountNo": "string",
                "branchId": "int",
            }
        ],
        "hasAutoPayment": true,
        "autoPaymentInfo": [
            {
                "currencyCode": "int",
                "autoPaymentType": "string",
            }
        ]
    }
];




recursivePojoCreate(jsonOrList5, "Req", "MainRequestFile");


insertTextToTextAreaById(globalQueue_ALL_POJO_TEXT_TOTAL, "requestAndDtoAllTextArea");

//returns name of parent object
let cc = searchParentNameOf_classFromPojo("CardPointInfoDto", globalQueue_ALL_POJO_TEXT_TOTAL);
//returns Complete Dto Pojo
let bb = searchDtoNameFromListOfPojo("DebtInfoList2Dto", globalQueue_ALL_POJO_TEXT_TOTAL);

let aa = createTotal_serviceRequestIMap(globalQueue_ALL_POJO_TEXT_TOTAL, numberOfIndentations);


//console.log(globalQueue_ALL_POJO_TEXT_TOTAL);