let path = require("path");
let fs = require('fs');
let langData = require('../src/locale/zh-cn');

let config = {
    dest: './../src/locale/',
    head: 2,
    codeSrc: [
        './../src/routes'
    ],
    iCodeSrc: [
        path.normalize(`${__dirname}/../src/routes/Register/`),
        path.normalize(`${__dirname}/../src/routes/home/`)
    ],
    src: [
        "./../Doc/languages/lang.xlsx"
    ],
    arraySeparator: ',',
};

let nameAry = [];

commentCode = () => {

    config.codeSrc.forEach(of => {
        let allFiles = getAllFiles(path.join(__dirname, of, "/"));
        let index = 0;
        let suc = ()=> {
            index ++;
            if(allFiles.length === index){
                nameAry.forEach(da => console.log(da));
            }
        };

        allFiles.forEach(ps => {
            fs.readFile(ps, 'UTF-8', (error, data) => {
                if (!error) {
                    commentFile(ps, data);
                } else {
                    console.log("失败: " + ps, error)
                }
                suc();
            });
        });
    });
};

importI18n = (ps)=>{
    let imp = "./", ix = ps.replace(path.join(__dirname, "./../src/"), '').split("/").length - 1;
    for(let i = 0; i < ix; i++){
        imp += "../";
    }
    return `import i18n from '${imp}lib/i18n';\n`;
};

commentFile = (ps, data) => {
    let line = data.split("\n");
    let trans = false;
    let newLine = "", i18n = false, comment = 0, angle = 0, hua = 0;
    line.forEach((da, dx) => {
        if(dx !== 0) newLine += "\n";
        if(da.indexOf('import i18n') !== -1 && da.indexOf('lib/i18n') !== -1){
            i18n = true;
        }
        if(da.indexOf('/*') !== -1 && da.indexOf("*/") === -1){
            comment ++ ;
        } else if(da.indexOf("*/") !== -1 && da.indexOf('/*') === -1){
            comment -= (comment > 0? 1: 0);
        }
        
        if(da.indexOf('<') !== -1 && da.indexOf('>') === -1){
           angle ++;
        } else if(da.indexOf(">") !== -1 && da.indexOf('<') === -1){
            angle -= (angle > 0? 1: 0);
        }
        if(da.indexOf('{') !== -1 && da.indexOf('}') === -1 && da.indexOf(';') === -1){
           hua ++;
        } else if(da.indexOf("}") !== -1 && da.indexOf('{') === -1 && da.indexOf(';') === -1){
            hua -= (angle > 0? 1: 0);
        }
        
        let tranLine = commentLang(da, comment > 0, angle > 0 && hua === 0);
        newLine += tranLine;
        if( !trans && tranLine !== da) trans = true;
    });
    if(trans && !i18n && ps.indexOf("index.js") === -1){
        newLine = importI18n(ps) + newLine;
    }
    writeNewFile(ps, newLine)
};

fineLang = line => {
    let ix1 = line.match(`>[\u4e00-\u9fa5]`);
    let ix11 = line.match(`[\u4e00-\u9fa5]<`);
    let ix2 = line.match(`'[\u4e00-\u9fa5]`);
    let ix22 = line.match(`[\u4e00-\u9fa5]'`);
    let ix3 = line.match(`"[\u4e00-\u9fa5]`);
    let ix33 = line.match(`[\u4e00-\u9fa5]"`);

    let fx1 = ix1 || ix2 || ix3;
    let fx2 = ix11 || ix22 || ix33;

    return {fx1, fx2};
};

replaceAll = (str, sptr, sptr1)=>{
    while (str.indexOf(sptr) >= 0){
        str = str.replace(sptr, sptr1);
    }
    return str;
};

i18nString = (k, v, comment) => {
    return comment? `${k}*//*${v}*//*` : `${k}/*${v}*/`
};

commentLang = (line, comment, angle) => {
    let {fx1, fx2} = fineLang(line);
    if(fx1 && fx2 && line.indexOf("//") === -1){
        let name = line.substring(fx1.index + 1, fx2.index + 1);
        let oldLine = line;
        let entries = Object.entries(langData);
        for (let [k, v] of entries){
            if(line.indexOf(`>${v}<`) !== -1){
                let s1 = `>${v}<`, s2 = i18nString(k, v, comment), s3 = `>{i18n.t(${s2})}<`;
                line = replaceAll(line, s1, s3);
            } else if(line.indexOf(`"${v}"`) !== -1){
                let s1 = `"${v}"`, s2 = i18nString(k, v, comment), s3 = `i18n.t(${s2})`;
                s3 = angle || (line.indexOf(`="${v}"`) !== -1 && line.indexOf('let ') === -1 && line.indexOf(`=="${v}"`) === -1 && (line.indexOf(';') === -1 || line.indexOf(">") !== -1))? `{${s3}}`: s3;
                line = replaceAll(line, s1, s3);
            } else if(line.indexOf(`'${v}'`) !== -1){
                let s1 = `'${v}'`, s2 = i18nString(k, v, comment), s3 = `i18n.t(${s2})`;
                s3 = angle || (line.indexOf(`='${v}'`) !== -1 && line.indexOf('let ') === -1 && line.indexOf(`=='${v}'`) === -1 && (line.indexOf(';') === -1 || line.indexOf(">") !== -1))? `{${s3}}`: s3;
                line = replaceAll(line, s1, s3);
            }
        }
        if(oldLine === line && nameAry.indexOf(name) === -1) nameAry.push(name);
        let {fx11, fx22} = fineLang(line);
        if(fx11 && fx22) line = commentLang(line, comment, angle);
    }
    return line;
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
        if(config.iCodeSrc.indexOf(dirpath) !== -1) {
//            console.log("忽略: " + dirpath);
            return;
        }
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

commentCode();