let xlsx = require('./xlsx2json/lib/xlsx-to-json.js');
let path = require("path");
let fs = require('fs');

let config = {
    dest: './../src/locale/',
    head: 2,
    codeSrc: [
        './../src/components/',
        './../src/routes/',
        './../src/layouts/',
    ],
    iCodeSrc: [
        path.normalize(`${__dirname}/../src/components/Calendar/`),
        path.normalize(`${__dirname}/../src/components/Form/`),
        path.normalize(`${__dirname}/../src/components/FormValidating/`),
        path.normalize(`${__dirname}/../src/components/SelectChange/`),
        path.normalize(`${__dirname}/../src/components/Select/`),
        path.normalize(`${__dirname}/../src/components/Slider/`),
        path.normalize(`${__dirname}/../src/components/Table/`),
        path.normalize(`${__dirname}/../src/components/Tree/`),
        path.normalize(`${__dirname}/../src/components/TreeSelect/`),
        path.normalize(`${__dirname}/../src/components/Upload/`),
        path.normalize(`${__dirname}/../src/components/Trigger/`),
        path.normalize(`${__dirname}/../src/components/Tree/`),
        path.normalize(`${__dirname}/../src/components/TimePicker/`)
    ],
    src: [
        "./../Doc/languages/lang.xlsx"
    ],
    arraySeparator: ',',
    defaultColumn: 2,
    defaultColumn2: 0
};

let wrap = process.platform === "darwin" ? "\n": "\r\n";
let langData = {};

exportJson = () => {
    let langData = [];
    config.src.forEach((element, index) => {
        let filePath = path.join(__dirname, element),
            destPath = path.join(__dirname, config.dest);
        langData.push(xlsx.toJson(filePath, destPath, config));
    });
    commentCode(langData);
};

commentCode = data => {
    data.forEach(da => {
        for (let [key, value] of Object.entries(da)) {
            langData = Object.assign({}, langData, value['zh-cn']);
        }
    });
    
    config.codeSrc.forEach(of => {
        getAllFiles(path.join(__dirname, of)).forEach(ps => {
            fs.readFile(ps, 'UTF-8', (error, data) => {
                if (!error) {
                    commentFile(ps, data);
                } else {
                    console.log("失败: " + ps, error)
                }
            });
        });
    });
};

commentFile = (ps, data) => {
    let line = data.split(wrap), trans = false, i18n = false;
    let newLine = "", comment = 0;
    line.forEach((da, dx) => {
        if(dx !== 0) newLine += wrap;
        // if(da.indexOf('import i18n') !== -1 && da.indexOf('lib/i18n') !== -1) i18n = true;

        if(da.indexOf('/*') !== -1 && da.indexOf("*/") === -1){
            comment ++ ;
        } else if(da.indexOf("*/") !== -1 && da.indexOf('/*') === -1){
            comment -= (comment > 0? 1: 0);
        }
        let tranLine = commentLang(da, comment > 0);
        newLine += tranLine;
        if( !trans && tranLine !== da) trans = true;
    });

    //自动导入i18n
    // if(trans && !i18n && ps.indexOf("index.js") === -1){
    //     newLine = importI18n(ps) + newLine;
    // }
    writeNewFile(ps, newLine)
};

findComment = (line)=>{
    return line.indexOf("/*") !== -1;
};

findI18n = line => {
    let ix1 = line.indexOf("I18n.t(");
    return ix1 === -1? line.indexOf("i18n.t("): ix1;
};

commentLang = (line, comment) => {
    let n1 = findI18n(line),
        n11 = n1 + 7, // 7 = i18n.t(
        n2 = line.indexOf(")", n11);

    let nt1 = line.indexOf("/*", n11), nt2 = line.indexOf("*/", n11);
    if(nt1 !== -1 && nt2 !== -1 && n2 > nt1 && n2 < nt2){
        n2 = line.indexOf(")", nt2)
    }

    let nt3 = line.indexOf(",", nt2 > 0? nt2: n11);
    if(nt3 < n2 && nt3 !== -1){
        n2 = nt3;
    }

    if(n1 !== -1 && n2 !== -1){
        let s0 = line.substring(0, n11),
            s1 = line.substring(n11, n2),
            s2 = line.substring(n2);
        if (n2 !== 0 && findI18n(s2) !== -1){
            s2 = commentLang(s2, comment);
            line = s0 + s1 + s2;
        }
        comment  = comment || findComment(s0);
        let codes = s1.match(/\d+/g);
        if(codes){
            let k = codes[0], v = langData[k] || '';
            if(comment){
                line = `${s0}${k}*//*${v}*//*${s2}`;
            } else {
                line = `${s0}${k}/*${v}*/${s2}`;
            }
            !v && console.log("Not found: ", k, v);
        }
    }

    return line;
};

importI18n = (ps)=>{
    let imp = "./", ix = ps.replace(path.join(__dirname, "./../src/"), '').split("/").length - 1;
    for(let i = 0; i < ix; i++){
        imp += "../";
    }
    return `import i18n from '${imp}lib/i18n';\n`;
};


writeNewFile = (ps, newLine) => {
    fs.writeFile(ps, newLine, error => {
        if( error) {
            console.log("write file error: " + error);
        }
    });
};

getAllFiles = dir => {
    let filesArr = [];

    let read = (dirpath) => {
        if(config.iCodeSrc.indexOf(dirpath) !== -1) return;
        fs.readdirSync(dirpath).forEach(item => {
            let info = fs.statSync(dirpath + item);
            if (info.isDirectory()) {
                read(dirpath + item + '/');
            } else if (item.indexOf(".js") !== -1 && item.indexOf(".json") === -1) {
                filesArr.push(dirpath + item);
            }
        });
    };
    read(dir);
    return filesArr;
};

exportJson();