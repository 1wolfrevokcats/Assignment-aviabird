let fs = require('fs');
let finalJsonObject = {};


// --------------- read file -----------------
fs.readFile('sample.txt', (err, data) => {
        if (err)
                throw err;
        fileData(data.toString());
});

// --------------- function to seperate the data line by line -----------------
function fileData(data) {
        let newStringArray = [];
        let i = 0;
        let nl = /\n/;

        // --------------- extract data between the ('---') character -----------------
        let subString = data.substr(
                data.indexOf('---') + 3,
                data.lastIndexOf('---') - 3
        );

        let jsonString = subString.trim();


        /* --------------- look for "new line '\n' " and break data into lines 
        and store the data into array(! the data extracted between "---" char) ----------------- */

        while (jsonString.search(nl) > 0) {
                let limit = jsonString.search(nl);
                strToInsertInArray = jsonString.substr(0, limit);
                jsonString = jsonString.substr(limit + 1, jsonString.length);
                newStringArray[i] = strToInsertInArray.replace(/\r/, "");
                i++;
                if (jsonString.search(nl) == -1) {
                        if (jsonString.length) {
                                newStringArray[i] = jsonString.replace(/\r/, "");
                        }
                }
        }

        let ob2 = parseJsonFromArray(newStringArray);

        // ------------- read data after last appearance of "---" char

        let strOther = (data.substr(data.lastIndexOf('---') + 3, data.length)).trim();
        let shortContent = strOther.substr(0, strOther.search(nl));

        while (shortContent.indexOf('"') != -1) {
                shortContent = shortContent.replace('"', "'");
        }

        let ob1 = {};

        ob1["short-content"] = shortContent.replace(/\r/, "");

        // -------- read data after "READMORE" text and remove newline and return character

        let lastString = data.substr(data.lastIndexOf("READMORE") + 8, data.length).replace(/(\r\n|\n|\r)/gm, "");
        while (lastString.indexOf('"') != -1) {
                lastString = lastString.replace('"', "'");
        }
        ob1.content = lastString;   // assign key,value

        finalJsonObject = { ...ob2, ...ob1 };  // merge objects

        console.log(finalJsonObject);
}



/// function to extract data and seperate them as key and value
function parseJsonFromArray(jsonArr) {
        let obj = {};
        for (let item of jsonArr) {
                let key = item.substr(0, item.indexOf(":"));
                let value = item.substr(item.indexOf(":") + 1, item.length);
                while (value.indexOf('"') != -1) {
                        value = value.replace('"', "");
                }
                value = value.trim();
                if (value.toString().toLowerCase() === 'true' || value.toString().toLowerCase() === 'false') {
                        value = Boolean(value);
                }

                // --- check if string starts with character and contains comma seperated data
                if (value.toString().match(RegExp('^[a-zA-Z]')) && (value.toString().indexOf(",") != -1)) {
                        value = ifArrayElement(value);
                }
                obj[key] = value;
        }
        return obj;
}

/* ------ function to split comma seperated data and check if contains space in each item. 
if space is present data is returned as string else as array. I.E to check data is array or not */
function ifArrayElement(val) {
        let [...arr] = val.split(",");
        let flag = false;
        for (let item of arr) {
                if (item.trim().search(/\s/) != -1)
                        flag = true;
                break;
        }
        if (flag == true)
                return val;

        return arr;
}