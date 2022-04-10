import jsonpath from 'jsonpath';

const REGEX = /\[.*?\]/g;


export function objectToPaths(data) {
    var validId = /^[a-z_$][a-z0-9_$]*$/i;
    var result = [];
    doIt(data, "");
    return result;

    function doIt(data, s) {
        if (data && typeof data === "object") {
            if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    doIt(data[i], s + "[" + i + "]");
                }
            } else {
                for (var p in data) {
                    if (validId.test(p)) {
                        doIt(data[p], s + "." + p);
                    } else {
                        doIt(data[p], s + "[\"" + p + "\"]");
                    }
                }
            }
        } else {
            result.push("$"+s);
        }
    }
}
export function csvToArray(csv) {
    let array;
    if (csv.includes("\r\n")) {
        array = csv.split("\r\n");
    } else if (csv.includes("\n")) {
        array = csv.split("\n");
    } else {
        array = csv.split("\r");
    }
    return array.map(row => row.split(","));
}

export function objectComparetor(objectA, objectE, propsA) {
    if (!objectA || !objectE || !propsA) {
        return [];
    }
    const pathsA = Object.keys(propsA).filter(path => propsA[path].isMapped);
    const map = {};
    const result = [];
    pathsA.forEach((pathA => {
        let pathE = propsA[pathA].linkedWith;;
        if (hasArrayInPath(pathA) && hasArrayInPath(pathE) && isSameDimension(pathA, pathE)) {
            const temp = pathA.split(REGEX).join("[*]")
            if(map[temp]){
                return
            }
            map[temp] = true;
            result.push(...getArrayPathResult(objectA, objectE, pathA, pathE))
        } else {
            if(map[pathA]){
                return
            }
            map[pathA] = true;
            result.push(pathResult(objectA, objectE, pathA, pathE));
        }
    }))
    return result;
}

const isSameDimension = (pathA, pathB) => {
    const a = pathA.match(REGEX);
    const b = pathB.match(REGEX);
    if (!Array.isArray(a) || !Array.isArray(b)) {
        return true;
    }
    return a.length == b.length;
}

const hasArrayInPath = (path) => {
    const result = path.match(REGEX);
    return Array.isArray(result) && result.length > 0;
}

const pathResult = (objectA, objectE, pathA, pathE) => {
    const resultA = objectQuery(objectA, pathA);
    const resultE = objectQuery(objectE, pathE);

    let av = "undefined", ev = "undefined";

    if (resultA[0]) {
        av = getValue(resultA[0].value)
    }
    if (resultE[0]) {
        ev = getValue(resultE[0].value)
    }

    return {
        actualPath: pathA,
        expectPath: pathE,
        actualValue: av,
        expectValue: ev,
        result: av == ev
    }
}

const objectQuery = (object, path) => {
    return jsonpath.nodes(object, path);
}

const getArrayPathResult = (objectA, objectE, pathA, pathE) => {
    const resultA = objectQuery(objectA, pathA.split(REGEX).join("[*]"));
    const resultE = objectQuery(objectE, pathE.split(REGEX).join("[*]"));

    const length = resultA.length > resultE.length ? resultA.length : resultE.length;

    let summarys = []
    for (let i = 0; i < length; i++) {
        let arp = null, erp = null, ap = null, ep = null, av = "undefined", ev = "undefined";
        if (resultA[i]) {
            arp = pathArrayJoin(resultA[i].path)
            av = resultA[i].value;
        } else {
            ap = pathA
        }
        if (resultE[i]) {
            erp = pathArrayJoin(resultE[i].path)
            ev = resultE[i].value;
        } else {
            ep = pathE;
        }
        summarys.push(createArrayResultSummary(arp, erp, ap, ep, getValue(av), getValue(ev)));
    }
    return summarys;
}


const createArrayResultSummary = (resultA, resultE, pathA, pathE, valueA, valueE) => {
    if (pathA != null) {
        resultA = createPath(pathA, resultE)
    }
    if (pathE != null) {
        resultE = createPath(pathE, resultA)
    }
    return {
        actualPath: resultA,
        expectPath: resultE,
        actualValue: valueA,
        expectValue: valueE,
        result: valueA == valueE
    }
}

const createPath = (originPath, result) => {
    let indexArr = result.match(REGEX);
    let pathSlice = originPath.split(REGEX);
    let path = pathSlice[0];
    for (let index = 0; index < indexArr.length; index++) {
        path = path + indexArr[index] + pathSlice[index + 1];
    }
    return path;
}

const pathArrayJoin = (pathArr) => {
    let path = pathArr[0];
    for (let i = 1; i < pathArr.length; i++) {
        if (typeof (pathArr[i]) == "number") {
            path = path + "[" + pathArr[i] + "]";
        } else {
            path = path + "." + pathArr[i];
        }
    }
    return path;
}

const getValue = (value) => {
    if (typeof (value) == "object" && Array.isArray(value)) {
        return "array.length=" + value.length;
    }
    if (typeof (value) == "object" && value == null) {
        return "null";
    }
    if (typeof (value) == "undefined") {
        return "undefined";
    }
    if (typeof (value) == "string") {
        return '"' + value + '"'
    }
    return value;
}