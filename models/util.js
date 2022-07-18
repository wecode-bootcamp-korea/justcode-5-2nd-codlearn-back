const {readClassesList} = require('./courses');

function whereAnd(condition) {
    let query = "";
    for (let [key, value] of Object.entries(condition)) {
        if(value.length === 0){
            continue; 
        }
        let whereAnd;
        if (!query) {
            whereAnd = `WHERE `
        } else {
            whereAnd = ` AND `
        }

        let statement = "";
        if (key === "classes.price") {
            let temp = []
            if (value.includes('discounted')) {
                temp.push("classes.discounted_price IS NOT null");
            }
            if(value.includes("paid") && value.includes("free")){
                //do nothing
            }
            else if (value.includes("paid")) {
                temp.push("classes.price > 0");
            }
            else if (value.includes("free")) {
                temp.push("classes.price = 0");
            }
            statement += temp.join(" AND ")
        } else {
            statement += `${key} IN (${value
                .map((elem) => `'${elem}'`)
                .join(',')})`
        }
        if(!statement){
            continue; 
        }
        query += whereAnd + statement;
    }

    return query;

};

function whereAnd2(condition){
    let query = "";
    for (let [key, value] of Object.entries(condition)) {
        if(value.length === 0){
            continue; 
        }
        let whereAnd =` AND `;
        let statement = "";
        if (key === "classes.price") {
            let temp = []
            if (value.includes('discounted')) {
                temp.push("classes.discounted_price IS NOT null");
            }
            if(value.includes("paid") && value.includes("free")){
                //do nothing
            }
            else if (value.includes("paid")) {
                temp.push("classes.price > 0");
            }
            else if (value.includes("free")) {
                temp.push("classes.price = 0");
            }
            statement += temp.join(" AND ")
        } else {
            statement += `${key} IN (${value
                .map((elem) => `'${elem}'`)
                .join(',')})`
        }
        if(!statement){
            continue; 
        }
        query += whereAnd + statement;

    }
    return query; 


}

module.exports = {
    whereAnd, whereAnd2
};

