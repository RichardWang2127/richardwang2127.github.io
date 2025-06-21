let cl_time = 0;
isDev();
function isDev() {
    let dev_time = localStorage.getItem("dev_time");
    if (dev_time) {
        let now = new Date();
        let lastDevTime = new Date(dev_time);
        let diff = now - lastDevTime;
        if (diff < 12 * 60 * 60 * 1000) { // 12小时内
            cl_time = 19; // 设置为19，触发开发者模式
            checkDev();
        }
        else {
            localStorage.removeItem("dev_time");
        }
    }
    return 0;
}
function checkDev(from) {
    cl_time++;
    if (cl_time == 30) {
        console.log("开发者模式已关闭");
        // 关闭开发者模式
        localStorage.removeItem("dev_time");
        document.getElementById("line-dev").style.display = "none";
        document.getElementById("line").style.display = "block";
        document.getElementById('submitInfo').classList.add("forbidden");
        document.getElementById('submitInfo').textContent = "输入后信息自动显示";
        document.getElementById("devMode").style.display = "none";
        setInterval(submitInfo(), 50);
        cl_time = 0; // 重置计时
        return;
    }
    if (cl_time == 20) {
        console.log("开发者模式已开启");
        // 开启开发者模式
        document.getElementById("line-dev").style.display = "block";
        document.getElementById("line").style.display = "none";
        document.getElementById('submitInfo').classList.remove("forbidden");
        document.getElementById('submitInfo').textContent = "输入后信息自动显示-开发者模式";
        if (from == 'button') localStorage.setItem("dev_time", Date());
        document.getElementById("devMode").style.display = "block";
        submitInfo();
        return;
    }
}
function get_carriage(line, id, trains, D, C = 0) { // (Y - C) / trains + D = A ...... X; A = id - D
    let A = id - D, train_type;
    line = parseInt(line);
    let base = A * trains;
    let cur = base;
    let result = '';
    if (line < 10) {
        line = `0${line}`;
    }
    else {
        line = `${line}`;
    }
    for (let X = 1; X <= trains; X++) {
        cur = base + X + C;
        if (cur < 10) cur = `00${cur}`;
        else if (cur < 100) cur = `0${cur}`;
        else cur = `${cur}`;
        if (X == 1 || X == trains) train_type = 1;
        else if (line == 16 && X == 2 && id >= 1 && id <= 46) train_type = 3;
        else if (line == 14 && X == 4) train_type = 2;
        else if (X == 2 || X == trains - 1) train_type = 2;
        else train_type = 3;
        if (line == 19) result = result + `T01${cur}${train_type} `;
        else result = result + `${line}${cur}${train_type} `;
    }
    // special rules
    return result;
}
function test_func(disabled = false) {
    if (disabled) {
        return;
    }
    let test_output = ``;
    for (let i = 1; i <= 100; i++) {
        test_output += linedefault(i, 0, 16) + '\n';
    }
    // console.log(test_output);
    saveTextToFile("test_output.txt", test_output);
    // console.log(get_carriage(16, 47, 6, 24));
    // console.log(get_carriage(9, 16, 6, 1));
    // console.log(get_train(16, 139, 6, 24));
}
const disable_test = 1; // 1: 禁用测试功能, 0: 启用测试功能
test_func(disable_test);
function get_train(line, Y, trains, D, C = 0) { // (Y - C) / trains + D = A ...... X;
    let A = parseInt((Y - C) / trains) + D;
    let X = (Y - C) % trains;
    if (X == 0) {
        X = trains;
        A--;
    }
    return A;
}
function line01(id, type) {
    //01A01~01A07 Table
    const arr_1 = [
        [],
        ["92011", "92022", "92033", "93442", "93453", "94102", "94113", "94121"],
        ["93121", "93262", "93273", "14652", "14663", "92102", "93233", "93311"],
        ["92131", "92142", "92153", "94022", "94033", "92162", "92173", "92181"],
        ["92191", "92202", "92213", "94202", "94213", "92222", "92233", "92241"],
        ["93011", "93022", "93033", "94162", "94173", "93042", "93053", "93061"],
        ["94071", "94082", "94093", "94042", "94053", "92042", "92053", "92061"],
        ["93251", "93142", "93153", "93462", "93473", "93282", "93173", "92121"],
        ["93191", "93202", "93213", "94142", "94153", "93222", "92113", "93361"],
        ["93131", "93322", "93333", "93402", "93413", "93162", "93293", "93301"],
        ["92071", "92082", "92093", "94222", "94233", "93342", "93353", "93181"],
        ["93371", "014352", "014363", "014372", "014383", "014392", "014403", "93421"],
        ["93431", "014412", "014423", "014432", "014443", "014452", "014463", "93481"],
        ["94011", "014472", "014483", "014492", "014503", "014512", "014523", "94061"],
        ["93071", "93082", "93093", "93382", "93393", "93102", "93113", "93241"],
        ["94131", "014532", "014543", "014552", "014563", "014572", "014583", "94181"],
        ["94191", "014592", "014603", "014612", "014623", "014632", "014643", "94241"],
        ["98011", "98022", "98033", "14672", "14683", "98042", "98053", "98061"],
        ["99011", "99022", "99033", "01802", "01813", "99042", "99053", "99061"],
        ["99071", "99082", "99093", "01822", "01833", "99102", "99113", "99121"],
        ["99131", "99142", "99153", "99502", "99513", "99162", "99173", "99181"],
        ["99191", "99202", "99213", "99522", "99533", "99222", "99233", "99241"],
        ["99251", "99262", "99273", "00042", "00053", "99342", "99353", "99361"],
        ["99311", "99382", "99393", "00022", "00033", "99282", "99293", "99301"],
        ["99371", "99322", "99333", "01742", "01753", "99402", "99413", "99421"],
        ["99431", "99442", "99453", "01762", "01773", "99462", "99473", "99481"],
        ["99541", "013632", "013643", "013652", "013663", "013673", "013682", "99491"],
        ["00061", "013752", "013763", "013772", "013783", "013793", "013802", "00011"],
        ["01781", "013812", "013823", "013832", "013843", "013853", "013862", "01731"],
        ["01841", "013692", "013703", "013712", "013723", "013733", "013742", "01791"],
        ["01251", "013992", "014003", "014012", "014023", "014033", "014042", "01301"],
        ["01311", "014172", "014183", "014192", "014203", "014213", "014222", "01361"],
        ["01371", "014232", "014243", "014252", "014263", "014273", "014282", "01421"],
        ["01431", "014112", "014123", "014132", "014143", "014153", "014162", "01481"],
        ["01491", "014052", "014063", "014072", "014083", "014093", "014102", "01541"],
        ["01551", "013872", "013883", "013892", "013903", "013913", "013922", "01601"],
        ["01611", "013932", "013943", "013952", "013963", "013973", "013982", "01661"],
        ["01671", "014292", "014303", "014312", "014323", "014333", "014342", "01721"],
        [],
        [],
        ["012351", "012362", "012373[错印为012573]", "012382", "012393", "012403", "012412", "012421"],
        ["012431", "012442", "012453", "012462", "012473", "012483", "012492", "012501"],
        ["012511", "012522", "012533", "012542", "012553", "012563", "012572", "012581"],
        ["012591", "012602", "012613", "012622", "012633", "012643", "012652", "012661"],
        ["012671", "012682", "012693", "012702", "012713", "012723", "012732", "012741"],
        ["012751", "012762", "012773", "012782", "012793", "012803", "012812", "012821"],
        ["012831", "012842", "012853", "012862", "012873", "012883", "012892", "012901"],
        ["012911", "012922", "012933", "012942", "012953", "012963", "012972", "012981"],
        ["012991", "013002", "013013", "013022", "013033", "013043", "013052", "013061"],
        ["013071", "013082", "013093", "013102", "013113", "013123", "013132", "013141"],
        ["013151", "013162", "013173", "013182", "013193", "013203", "013212", "013221"],
        ["013231", "013242", "013253", "013262", "013273", "013283", "013292", "013301"],
        ["013311", "013322", "013333", "013342", "013353", "013363", "013372", "013381"],
        ["013391", "013402", "013413", "013422", "013433", "013443", "013452", "013461"],
        ["013471", "013482", "013493", "013502", "013513", "013523", "013532", "013541"],
        ["013551", "013562", "013573", "013582", "013593", "013603", "013612", "013621"],
        ["014681[开始错印]", "014692", "014703", "014712", "014723", "014733", "014742", "014751"],
        ["014761", "014772", "014783", "014792", "014803", "014813", "014822", "014831"],
        ["014841", "014852", "014863", "014872", "014883", "014893", "014902", "014911"],
        ["014921", "014932", "014943", "014952", "014963", "014973", "014982", "014991"],
        ["015001", "015012", "015023", "015032", "015043", "015053", "015062", "015071"],
        ["015081", "015092", "015103", "015112", "015123", "015133", "015142", "015151"],
        ["015161", "015172", "015183", "015192", "015203", "015213", "015222", "015231"],
        ["015241", "015252", "015263", "015272", "015283", "015293", "015302", "015311"],
        ["015321", "015332", "015343", "015352", "015363", "015373", "015382", "015391"],
        ["015401", "015412", "015423", "015432", "015443", "015453", "015462", "015471"],
        ["015481", "015492", "015503", "015512", "015523", "015533", "015542", "015551"],
        ["015561", "015572", "015583", "015592", "015603", "015613", "015622", "015631"],
        ["015641", "015652", "015663", "015672", "015683", "015693", "015702", "015711"],
        ["015721", "015732", "015743", "015752", "015763", "015773", "015782", "015791"],
        ["015801", "015812", "015823", "015832", "015843", "015853", "015862", "015871"],
        ["015881", "015892", "015903", "015912", "015923", "015933", "015942", "015951"],
        ["015961", "015972", "015983", "015992", "016003", "016013", "016022", "016031"],
        ["016041", "016052", "016063", "016072", "016083", "016093", "016102", "016111"],
        ["016121", "016132", "016143", "016152", "016163", "016173", "016182", "016191"],
        ["016201", "016212", "016223", "016232", "016243", "016253", "016262", "016271"],
        ["016281", "016292", "016303", "016312", "016323", "016333", "016342", "016351"],
        ["016361", "016372", "016383", "016392", "016403", "016413", "016422", "016431"],
        ["016441", "016452", "016463", "016472", "016483", "016493", "016502", "016511"],
        ["016521", "016532", "016543", "016552", "016563", "016573", "016582", "016591"],
        ["016601", "016612", "016623", "016632", "016643", "016653", "016662", "016671"],
        ["016681", "016692", "016703", "016712", "016723", "016733", "016742", "016751"],
        ["016761", "016772", "016783", "016792", "016803", "016813", "016822", "016831"],
        ["016841", "016852", "016863", "016872", "016883", "016893", "016902", "016911"],
        ["016921", "016932", "016943", "016952", "016963", "016973", "016982", "016991"],
        ["017001", "017012", "017023", "017032", "017043", "017053", "017062", "017071"],
        ["017081", "017092", "017103", "017112", "017123", "017133", "017142", "017151"],
        []
    ];
    let output = ``;
    if (type == 0) {
        let p = "";
        if (id < 10) {
            p = "0";
        }
        if (!(id > 0 && id < 87) || id == 38 || id == 39) {
            return "此列车不存在, 1号线允许车号: 1~37, 40~86";
        }
        if (id > 0 && id < 11 && id != 2 || id == 14) {
            output = output + `1号线 1${p}${id}\n数据准确度未知, 仅参考\n01A01 老老八(101, 103~110, 114)\n`;
        } else if (id == 2) {
            output = output + `1号线 102\n01A01 不死老老八(102)\n`;
        } else if (id > 10 && id < 14 || id > 14 && id < 17) {
            output = output + `1号线 1${id}\n01A02 伪八二世(111~113, 115, 116)\n`;
        } else if (id == 17) {
            output = output + `1号线 117\n01A03 不死老八(117)\n`;
        } else if (id > 17 && id < 26) {
            output = output + `1号线 1${id}\n01A03 老八(118~125)\n`;
        } else if (id > 25 && id < 38) {
            output = output + `1号线 1${id}\n01A04 伪八(126~137)\n`;
        } else if (id > 39 && id < 56) {
            output = output + `1号线 01${id}\n01A05 胖头鱼(0140~0155)\n`;
        } else if (id > 55 && id < 67) {
            output = output + `1号线 01${id}\n01A06 钢铁侠(0156~0166)\n`;
        } else {
            output = output + `1号线 010${id}\n01A07 钢铁侠二世(01067~01086)\n`
        }
        if (id == 67 || id == 68) {
            output = output + `特殊: 车门蜂鸣与01A06相同\n`
        }
        // console.log(arr_1[id][1], id);
        output = output + `${arr_1[id][0]} ${arr_1[id][1]} ${arr_1[id][2]} ${arr_1[id][3]}\n`;
        output = output + `${arr_1[id][4]} ${arr_1[id][5]} ${arr_1[id][6]} ${arr_1[id][7]}`;
    } else if (type == 1) {
        // console.log(id);
        let breakCheck = 0;
        const train_04_05 = document.getElementById("line-01-type").value.trim();
        // console.log(train_04_05)
        if (train_04_05 == "0") {
            // console.log("0th type");
            for (let i = 1; i <= 25; i++) {
                if (breakCheck) {
                    output = "仅查找车号1~10,14,17~25的列车\n\n" + output;
                    break;
                }
                if (i > 10 && i < 14 || i > 14 && i < 17) {
                    continue;
                }
                for (let j = 0; j < 8; j++) {
                    if (arr_1[i][j] == id) {
                        // console.log(i, j);
                        if (i > 0 && i < 11 && i != 2 || i == 14) {
                            let p = "";
                            if (i < 10) p = "0";
                            output = output + `1号线 1${p}${i}\n数据准确度未知, 仅参考\n01A01 老老八(101, 103~110, 114)\n`;
                        } else if (i == 2) {
                            output = output + `1号线 102\n01A01 不死老老八(102)\n`;
                        } else if (i > 10 && i < 17 && i != 14) {
                            output = output + `1号线 1${i}\n01A02 伪八二世(111~113, 115, 116)\n`;
                        } else if (i == 17) {
                            output = output + `1号线 117\n01A03 不死老八(117)\n`;
                        } else if (i > 17 && i < 26) {
                            output = output + `1号线 1${i}\n01A03 老八(118~125)\n`;
                        } else if (i > 25 && i < 38) {
                            output = output + `1号线 1${i}\n01A04 伪八(126~137)\n`;
                        }
                        output = output + `${arr_1[i][0]} ${arr_1[i][1]} ${arr_1[i][2]} ${arr_1[i][3]}\n`;
                        output = output + `${arr_1[i][4]} ${arr_1[i][5]} ${arr_1[i][6]} ${arr_1[i][7]}`;
                        breakCheck = 1;
                        break;
                    }
                    // else if (arr_1[i][j])
                }
            }
        }
        if (train_04_05 == "1") {
            // console.log("first type");
            for (let i = 11; i <= 37; i++) {
                if (breakCheck) {
                    output = "仅查找车号11~13, 14~16, 26~37的列车\n\n" + output;
                    break;
                }
                if (i == 14 || 17 <= i && i <= 25) {
                    continue;
                }
                for (let j = 0; j < 8; j++) {
                    if (arr_1[i][j] == ("01" + id)) {
                        // console.log(id);
                        if (i > 10 && i < 17 && i != 14) {
                            output = output + `1号线 1${i}\n01A02 伪八二世(111~113, 115, 116)\n`;
                        } else if (i == 17) {
                            output = output + `1号线 117\n01A03 不死老八(117)\n`;
                        } else if (i > 17 && i < 26) {
                            output = output + `1号线 1${i}\n01A03 老八(118~125)\n`;
                        } else if (i > 25 && i < 38) {
                            output = output + `1号线 1${i}\n01A04 伪八(126~137)\n`;
                        }
                        output = output + `${arr_1[i][0]} ${arr_1[i][1]} ${arr_1[i][2]} ${arr_1[i][3]}\n`;
                        output = output + `${arr_1[i][4]} ${arr_1[i][5]} ${arr_1[i][6]} ${arr_1[i][7]}`;
                        breakCheck = 1;
                        break;
                    }
                    else if (arr_1[i][j] == id) {
                        if (i > 10 && i < 17 && i != 14) {
                            output = output + `1号线 1${i}\n01A02 伪八二世(111~113, 115, 116)\n`;
                        } else if (i == 17) {
                            output = output + `1号线 117\n01A03 不死老八(117)\n`;
                        } else if (i > 17 && i < 26) {
                            output = output + `1号线 1${i}\n01A03 老八(118~125)\n`;
                        } else if (i > 25 && i < 38) {
                            output = output + `1号线 1${i}\n01A04 伪八(126~137)\n`;
                        }
                        output = output + `${arr_1[i][0]} ${arr_1[i][1]} ${arr_1[i][2]} ${arr_1[i][3]}\n`;
                        output = output + `${arr_1[i][4]} ${arr_1[i][5]} ${arr_1[i][6]} ${arr_1[i][7]}`;
                        breakCheck = 1;
                        break;
                    }
                    // else if (arr_1[i][j])
                }
            }
        }
        if (train_04_05 == "2") {
            if (id.slice(0, 3) == "257" || id.slice(0, 5) == "01257") {
                output = output + `请输入[012373]查找错印的0140车\n`;
            }
            for (let i = 40; i <= 86; i++) {
                if (breakCheck) {
                    output = "仅查找车号40~86的列车\n\n" + output;
                    break;
                }
                for (let j = 0; j < 8; j++) {
                    // special: 012373 014681
                    if (arr_1[i][j] == ("01" + id)) {
                        // console.log(id);
                        if (i > 39 && i < 56) {
                            output = output + `1号线 01${i} 第${j + 1}节\n01A05 胖头鱼(0140~0155)\n`;
                        } else if (i > 55 && i < 67) {
                            output = output + `1号线 01${i} 第${j + 1}节\n01A06 钢铁侠(0156~0166)\n`;
                        } else {
                            output = output + `1号线 010${i} 第${j + 1}节\n01A07 钢铁侠二世(01067~01086)\n`
                        }
                        output = output + `${arr_1[i][0]} ${arr_1[i][1]} ${arr_1[i][2]} ${arr_1[i][3]}\n`;
                        output = output + `${arr_1[i][4]} ${arr_1[i][5]} ${arr_1[i][6]} ${arr_1[i][7]}`;
                        breakCheck = 1;
                        break;
                    }
                    else if (arr_1[i][j] == id) {
                        if (i > 39 && i < 56) {
                            output = output + `1号线 01${i} 第${j + 1}节\n01A05 胖头鱼(0140~0155)\n`;
                        } else if (i > 55 && i < 67) {
                            output = output + `1号线 01${i} 第${j + 1}节\n01A06 钢铁侠(0156~0166)\n`;
                        } else {
                            output = output + `1号线 010${i} 第${j + 1}节\n01A07 钢铁侠二世(01067~01086)\n`
                        }
                        output = output + `${arr_1[i][0]} ${arr_1[i][1]} ${arr_1[i][2]} ${arr_1[i][3]}\n`;
                        output = output + `${arr_1[i][4]} ${arr_1[i][5]} ${arr_1[i][6]} ${arr_1[i][7]}`;
                        breakCheck = 1;
                        break;
                    }
                    //012373[错印为012573] 014681[开始错印]
                    else if (id == "2373" && arr_1[i][j] == "012373[错印为012573]" || id == "4681" && arr_1[i][j] == "014681[开始错印]") {
                        if (i > 39 && i < 56) {
                            output = output + `1号线 01${i} 第${j + 1}节\n01A05 胖头鱼(0140~0155)\n`;
                        } else if (i > 55 && i < 67) {
                            output = output + `1号线 01${i} 第${j + 1}节\n01A06 钢铁侠(0156~0166)\n`;
                        } else {
                            output = output + `1号线 010${i} 第${j + 1}节\n01A07 钢铁侠二世(01067~01086)\n`
                        }
                        output = output + `${arr_1[i][0]} ${arr_1[i][1]} ${arr_1[i][2]} ${arr_1[i][3]}\n`;
                        output = output + `${arr_1[i][4]} ${arr_1[i][5]} ${arr_1[i][6]} ${arr_1[i][7]}`;
                        breakCheck = 1;
                        break;
                    }
                    else {
                        let status = 0;
                        if (arr_1[i][j] == undefined) {
                            continue;
                        }
                        // console.log(arr_1[i][j]);
                        if (arr_1[i][j].slice(0, 5) == "01" + id.slice(0, 3)) {
                            status = 1;
                        }
                        else if (arr_1[i][j].slice(0, 5) == id.slice(0, 5)) {
                            status = 2;
                        }
                        if (status) {
                            // console.log(status, i);
                            if (i > 39 && i < 56) {
                                output = output + `你可能想找${arr_1[i][j]}\n1号线 01${i} 第${j + 1}节\n01A05 胖头鱼(0140~0155)\n`;
                            } else if (i > 55 && i < 67) {
                                output = output + `你可能想找${arr_1[i][j]}\n1号线 01${i} 第${j + 1}节\n01A06 钢铁侠(0156~0166)\n`;
                            } else {
                                output = output + `你可能想找${arr_1[i][j]}\n1号线 010${i} 第${j + 1}节\n01A07 钢铁侠二世(01067~01086)\n`
                            }
                            output = output + `${arr_1[i][0]} ${arr_1[i][1]} ${arr_1[i][2]} ${arr_1[i][3]}\n`;
                            output = output + `${arr_1[i][4]} ${arr_1[i][5]} ${arr_1[i][6]} ${arr_1[i][7]}`;
                            breakCheck = 1;
                            break;
                        }
                    }
                }
            }
        }
    }
    // console.log(output);
    if (output == "") {
        output = "无匹配项";
    }
    return output;
}
// function line02
function line06(id, type) {
    //06C Table
    const arr_6 = [
        [],
        ["060011", "060022", "060032", "060041"],
        ["060051", "060062", "060072", "060081"],
        ["060091", "060102", "060112", "060121"],
        ["", "", "", ""],
        ["060131", "060142", "060152", "060161"],
        ["060171", "060182", "060192", "060201"],
        ["060211", "060222", "060232", "060241"],
        ["060251", "060262", "060272", "060281"],
        ["060291", "060302", "060312", "060321"],
        ["060331", "060342", "060352", "060361"],
        ["060371", "060382", "060392", "060401"],
        ["060411", "060422", "060432", "060441"],
        ["060451", "060462", "060472", "060481"],
        ["", "", "", ""],
        ["060491", "060502", "060512", "060521"],
        ["060531", "060542", "060552", "060561"],
        ["060571", "060582", "060592", "060601"],
        ["060611", "060622", "060632", "060641"],
        ["060651", "060662", "060672", "060681"],
        ["060691", "060702", "060712", "060721"],
        ["060731", "060742", "060752", "060761"],
        ["060771", "060782", "060792", "060801"],
        ["060811", "060822", "060832", "060841"],
        ["", "", "", ""],
        ["060851", "060862", "060872", "060881"],
        ["060891", "060902", "060912", "060921"],
        ["060931", "060942", "060952", "060961"],
        ["060971", "060982", "060992", "061001"],
        ["061011", "061022", "061032", "061041"],
        ["061051", "061062", "061072", "061081"],
        ["061091", "061102", "061112", "061121"],
        ["061131", "061142", "061152", "061161"],
        ["061171", "061182", "061192", "061201"],
        ["", "", "", ""],
        ["061211", "061222", "061232", "061241"],
        ["061251", "061262", "061272", "061281"],
        ["061291", "061302", "061312", "061321"],
        ["061331", "061342", "061352", "061361"],
        ["061371", "061382", "061392", "061401"],
        ["061411", "061422", "061432", "061441"],
        ["061451", "061462", "061472", "061481"],
        ["061491", "061502", "061512", "061521"],
        ["061531", "061542", "061552", "061561"],
        ["", "", "", ""],
        ["061571", "061582", "061592", "061601"],
        ["061611", "061622", "061632", "061641"],
        ["061651", "061662", "061672", "061681"],
        ["061691", "061702", "061712", "061721"],
        ["061731", "061742", "061752", "061761"],
        ["061771", "061782", "061792", "061801"],
        ["061811", "061822", "061832", "061841"],
        ["061851", "061862", "061872", "061881"],
        ["061891", "061902", "061912", "061921"],
        ["", "", "", ""],
        ["061931", "061942", "061952", "061961"],
        ["061971", "061982", "061992", "062001"],
        ["062011", "062022", "062032", "062041"],
        ["062051", "062062", "062072", "062081"],
        ["062091", "062102", "062112", "062121"],
        ["062131", "062142", "062152", "062161"],
        ["062171", "062182", "062192", "062201"],
        ["062211", "062222", "062232", "062241"],
        ["062251", "062262", "062272", "062281"],
        ["062291", "062302", "062312", "062321"],
        ["062331", "062342", "062352", "062361"],
        ["062371", "062382", "062392", "062401"],
        ["062411", "062422", "062432", "062441"],
        ["062451", "062462", "062472", "062481"],
        ["062491", "062502", "062512", "062521"],
        ["062531", "062542", "062552", "062561"],
        ["062571", "062582", "062592", "062601"],
        ["062611", "062622", "062632", "062641"],
        ["062651", "062662", "062672", "062681"],
        ["062691", "062702", "062712", "062721"],
        ["062731", "062742", "062752", "062761"],
        ["062771", "062782", "062792", "062801"],
        ["062811", "062822", "062832", "062841"],
        ["062851", "062862", "062872", "062881"],
        ["062891", "062902", "062912", "062921"],
        ["062931", "062942", "062952", "062961"],
        ["062971", "062982", "062992", "063001"],
        ["063011", "063022", "063032", "063041"]
    ];
    let output = ``;
    if (type == 0) {
        if (!(id > 0 && id < 83) || id == 4 || id == 14 || id == 24 || id == 34 || id == 44 || id == 54) {
            return "此列车不存在, 6号线允许车号: 1~82 (不含4,14,24,34,44,54)";
        }
        if (id > 0 && id <= 23) {
            let p = '0';
            if (id >= 10) {
                p = '';
            }
            output = output + `6号线 060${p}${id}\n06C01 Kitty (06001~06003,06005~06013,06015~06023)\n`;
        } else if (id >= 25 && id <= 36) {
            output = output + `6号线 060${id}\n06C02 花木兰 (06025~06033,06035,06036)\n`;
        } else if (id > 36 && id < 57) {
            output = output + `6号线 060${id}\n06C03 花木兰二世 (06037~06043,06045~06053,06055,06056)\n`;
        } else {
            output = output + `6号线 060${id}\n06C04 花木兰三世 (06057~06082)\n`;
        }
        output = output + `${arr_6[id][0]} ${arr_6[id][1]} `;
        output = output + `${arr_6[id][2]} ${arr_6[id][3]}`;
    } else if (type == 1) {
        for (let i = 11; i <= 13; i++) {

        }
    }
    return output;
}
function line07(id, type) {
    //07A Table
    // 07A Tc Mp M M Mp Tc
    let output = ``;
    if (type == 0) {
        if (!(id > 0 && id < 80)) {
            return "此列车不存在, 7号线允许车号: 1~79";
        }
        if (id >= 1 && id <= 42) {
            let p = '';
            if (id < 10) {
                p = "0";
            }
            output = output + `7号线 07${p}${id}\n07A01 芬达(0701~0742)\n`;
        } else if (id >= 43 && id <= 72) {
            output = output + `7号线 07${id}\n07A02 邦迪(0743~0772)\n`;
        } else if (id >= 73 && id <= 79) {
            output = output + `7号线 070${id}\n07A03 邦迪二世(07073~07079)\n`;
        }
        // console.log(id);
        let id_ = id - 1, train_type;
        let base = id_ * 6;
        let cur = base;
        for (let X = 1; X <= 6; X++) {
            cur = base + X;
            if (cur < 10) cur = `00${cur}`
            else if (cur < 100) cur = `0${cur}`;
            else cur = `${cur}`;
            if (X == 1 || X == 6) train_type = 1;
            else if (X == 2 || X == 5) train_type = 2;
            else train_type = 3;
            // console.log(X, cur, train_type);
            output = output + `07${cur}${train_type} `;
            // if (X == 3) output = output + '\n';
        }
        // console.log(output);
        // output = output + `${arr_8[id][0]} ${arr_8[id][1]} ${arr_8[id][2]} ${arr_8[id][3]} `;
        // output = output + `${arr_8[id][4]} ${arr_8[id][5]} ${arr_8[id][6]}`;
    } else if (type == 1) {

    }
    return output;
}
function line08(id, type) {
    //08C Table deleted
    // 08C01 Tc Mp M M Mp Tc
    // 08C02~04 Tc Mp M M M Mp Tc
    let output = ``;
    if (type == 0) {
        if (!(id > 0 && id < 91)) {
            return "此列车不存在, 8号线允许车号: 1~90";
        }
        if (id > 0 && id <= 28) {
            let p = '0';
            if (id == 10) {
                p = '';
            }
            output = output + `8号线 080${p}${id}\n08C01 蓝精灵(08001~08028)\n`;
            let id_ = id - 1, train_type;
            let base = id_ * 6;
            let cur = base;
            for (let X = 1; X <= 6; X++) {
                cur = base + X;
                if (cur < 10) cur = `00${cur}`;
                else if (cur < 100) cur = `0${cur}`
                if (X == 1 || X == 6) train_type = 1;
                else if (X == 2 || X == 5) train_type = 2;
                else train_type = 3;
                output = output + `08${cur}${train_type} `;
            }
            // output = output + `${arr_8[id][0]} ${arr_8[id][1]} ${arr_8[id][2]} `;
            // output = output + `${arr_8[id][3]} ${arr_8[id][4]} ${arr_8[id][5]}`;
        }
        else {
            if (id >= 29 && id <= 46) {
                output = output + `8号线 080${id}\n08C02 泥鳅(08029~08046)\n`;
            } else if (id >= 47 && id <= 66) {
                output = output + `8号线 080${id}\n08C03 泥鳅二世(08047~08066)\n`;
            } else if (id >= 67 && id <= 90) {
                output = output + `8号线 080${id}\n08C04 泥鳅三世(08067~08090)\n`;
            }
            // console.log(id);
            let id_ = id - 5, train_type;
            let base = id_ * 7;
            let cur = base;
            for (let X = 1; X <= 7; X++) {
                cur = base + X;
                if (cur < 10) cur = `00${cur}`;
                else if (cur < 100) cur = `0${cur}`;
                if (X == 1 || X == 7) train_type = 1;
                else if (X == 2 || X == 6) train_type = 2;
                else train_type = 3;
                // console.log(X, cur, train_type);
                output = output + `08${cur}${train_type} `;
                if (X == 4) output = output + '\n';
            }
            // output = output + `${arr_8[id][0]} ${arr_8[id][1]} ${arr_8[id][2]} ${arr_8[id][3]} `;
            // output = output + `${arr_8[id][4]} ${arr_8[id][5]} ${arr_8[id][6]}`;
        }
    } else if (type == 1) {

    }
    return output;
}
function line09(id, type) {
    //09A Table
    let output = ``;
    if (type == 0) {
        if (!(id > 0 && id < 106)) {
            return "此列车不存在, 9号线允许车号: 1~105";
        }
        if (id > 0 && id < 11) {
            let p = '0';
            if (id == 10) {
                p = '';
            }
            output = output + `9号线 09${p}${id}\n09A01 蚕宝宝(0901~0910)\n`;
        } else if ((id > 10 && id < 42 || id > 45 && id < 52) && id != 48) {
            output = output + `9号线 09${id}\n09A02 坂田(0911~0951)\n`;
        } else if (id > 41 && id < 46 || id == 48) {
            output = output + `9号线 09${id}\n09A02 世博坂田(0942~0945, 0948)\n`;
        } else if (id == 52) {
            output = output + `9号线 0952\n09ASY 电气男孩(0952)\n`;
        } else if (id > 52 && id < 89) {
            output = output + `9号线 09${id}\n09A03 创可贴(0953~0988)\n`;
        } else if (id > 88 && id < 106) {
            let p = '0';
            if (id > 99) {
                p = ''
            }
            output = output + `9号线 09${p}${id}\n09A05 创可贴二世(09089~09105)\n`;
        }
        /*
        let cars = 6, id_ = id - 1, train_type;
        let base = id_ * cars;
        let cur = base;
        for (let X = 1; X <= cars; X++) {
            cur = base + X;
            if (cur < 10) cur = `00${cur}`;
            else if (cur < 100) cur = `0${cur}`;
            if (X == 1 || X == cars) train_type = 1;
            else if (X == 2 || X == cars - 1) train_type = 2;
            else train_type = 3;
            // console.log(X, cur, train_type);
            output = output + `09${cur}${train_type} `;
            // if (X == 4) output = output + '\n';
        }
        // output = output + `${arr_9[id][0]} ${arr_9[id][1]} ${arr_9[id][2]} `;
        // output = output + `${arr_9[id][3]} ${arr_9[id][4]} ${arr_9[id][5]}`;
        */
        output += get_carriage(9, id, 6, 1);
    } else if (type == 1) {
        // console.log(id);
        carriage_id = id;
        let flag = false;
        if (carriage_id.length > 6) {
            return "内容未填或有误";
        }
        if (!(carriage_id > 0 && carriage_id < 631)) {
            flag = true;
        }
        carriage_id = carriage_id.slice(0, 5);
        // console.log(carriage_id);
        if (flag) {
            if (id.slice(0, 2) == "09") {
                id = parseInt(id.slice(2, 5));
                if (carriage_id > 0 && carriage_id < 631) {
                    flag = false;
                }
            }
        }
        if (flag) {
            return "此车厢不存在, 9号线允许车体号: 1~630";
        }
        id = get_train(9, id, 6, 1);
        if (id > 0 && id < 11) {
            let p = '0';
            if (id == 10) {
                p = '';
            }
            output = output + `9号线 09${p}${id}\n09A01 蚕宝宝(0901~0910)\n`;
        } else if ((id > 10 && id < 42 || id > 45 && id < 52) && id != 48) {
            output = output + `9号线 09${id}\n09A02 坂田(0911~0951)\n`;
        } else if (id > 41 && id < 46 || id == 48) {
            output = output + `9号线 09${id}\n09A02 世博坂田(0942~0945, 0948)\n`;
        } else if (id == 52) {
            output = output + `9号线 0952\n09ASY 电气男孩(0952)\n`;
        } else if (id > 52 && id < 89) {
            output = output + `9号线 09${id}\n09A03 创可贴(0953~0988)\n`;
        } else if (id > 88 && id < 106) {
            let p = '0';
            if (id > 99) {
                p = ''
            }
            output = output + `9号线 09${p}${id}\n09A05 创可贴二世(09089~09105)\n`;
        }

        output = output + get_carriage(9, id, 6, 1);
    }
    return output;
}

function special_carriage(line, id, trains, D, C = 0, train_code, is_special) { // (Y - C) / trains + D = A ...... X; A = id - D
    let A = id - D, train_type;
    line = parseInt(line);
    let base = A * trains;
    let cur = base;
    let result = '';
    if (line < 10) {
        line = `0${line}`;
    }
    else {
        line = `${line}`;
    }
    if (train_code.slice(0, 3) == "02A") {
        if (train_code == "02A01") {
            return "未支持";
        }
        else{
            for (let X = 1; X <= trains; X++) {
                cur = base + X + C;
                if (cur < 10) cur = `00${cur}`;
                else if (cur < 100) cur = `0${cur}`;
                else cur = `${cur}`;
                if (X == 1 || X == 8) train_type = 1;
                else if ((train_code == "02A02" || train_code == "02A05") && (X == 2 || X == 4 || X == 7)) train_type = 2;
                else if ((train_code == "02A03" || train_code == "02A04") && (X == 2 || X == 4 || X == 6 || X == 7)) train_type = 2;
                else train_type = 3;
                result = result + `${line}${cur}${train_type} `;
                if (trains == 8 && X == 4) {
                    result = result + '\n';
                }
            }
        }
    }
    // special rules
    return result;
}

function linespecial(id, type, line) {
    let output = ``;
    //      0        1     2        3
    // train_types A_min A_max train_detail

    //    0    1     2       3     4     5      6     7    8   9   10
    // Special No Nickname A_min A_max trains Y_min Y_max  D   C  digits
    // (Y - C) / trains + D = A ...... X;
    /* Special Code:
        0: No Special(Can't exist with 1 or 2)
        1: Different Calculation
        2: Same Train Type, Different A
     */
    data_special = [
        // 0留空, 1预留
        [], [],
        // line 2
        [5, 1, 116, [
            [1, "02A01", "西瓜", 1, 16, 8, -1, -1, -1, -1, -1],
            [0, "02A02", "青鱼", 33, 53, 8, 129, 296, 17, 0, 2],
            [0, "02A03", "鲶鱼", 54, 69, 8, 297, 424, 17, 0, 2],
            [1, "02A04", "扩编鲶鱼", 70, 85, 8, 425, 552, -1, 0, 2],
            [0, "02A05", "绿灯侠", 86, 116, 8, 553, 800, 17, 0, 3]
        ]],
        // line 3
        [3, 1, 49, [
            [1, "03A01", "黄鱼", 1, 28, 6, -1, -1, -1, -1, -1],
            [0, "03A02", "包公", 29, 36, 6, 169, 216, 1, 0, 2],
            [1, "04A02", "叛徒包公", 37, 49, 6, 217, 294, 1, 0, 2]
        ]],
        // line 4
        [4, 1, 55, [
            [0, "04A01", "奶嘴", 1, 28, 6, 1, 168, 1, 0, 2],
            [2, "04A02", "包公", 29, 36, 6, 169, 216, 1, 0, 2],
            [1, "04A02", "叛徒包公", 37, 49, 6, 217, 294, 1, 0, 2],
            [2, "04A02", "包公", 50, 55, 6, 295, 330, 1, 0, 2]
        ]],
        // line 5
        [2, 1, 51, [
            [12, "05C01", "番茄炒蛋", 1, 13, 4, -1, -1, -1, -1, 3],
            [12, "05C01", "番茄炒蛋", 15, 18, 4, -1, -1, -1, -1, 3],
            [0, "05C02", "紫罗兰", 19, 51, 6, 69, 266, 8, 2, 2]
        ]]
    ]
    trains_allowed = ["", "", "1~16, 33~116", "1~49", "1~55", "1~51"];
    if (type == 0) {
        let train_type = -1;
        for (let t = 0; t < data_special[line][0]; t++) {
            if (id >= data_special[line][3][t][3] && id <= data_special[line][3][t][4]) {
                train_type = data_special[line][3][t];
                break;
            }
        }
        if (train_type == -1) {
            return `此列车不存在, ${line}号线允许车号: ${trains_allowed[line]}`;
        }
        let train_id = `${line}`, A_min = `${line}`, A_max = `${line}`;
        if (train_type[10] == -1) {
            if (id < 10) train_id += `0${id}`;
            else train_id += `${id}`;
            if (train_type[3] < 10) A_min += `0${train_type[3]}`;
            else  A_min += `${train_type[3]}`;
            if (train_type[4] < 10) A_max += `0${train_type[4]}`;
            else A_max += `${train_type[4]}`;
        }
        else if (train_type[10] == 2) {
            train_id = `0${line}`, A_min = `0${line}`, A_max = `0${line}`;
            if (id < 10) train_id += `0${id}`;
            else train_id += `${id}`;
            if (train_type[3] < 10) A_min += `0${train_type[3]}`;
            else  A_min += `${train_type[3]}`;
            if (train_type[4] < 10) A_max += `0${train_type[4]}`;
            else A_max += `${train_type[4]}`;
        }
        else if (train_type[10] == 3) {
            train_id = `0${line}`, A_min = `0${line}`, A_max = `0${line}`;
            if (id < 10) train_id += `00${id}`;
            else if (id < 100) train_id += `0${id}`;
            else train_id += `${id}`;
            if (train_type[3] < 10) A_min += `00${train_type[3]}`;
            else if (train_type[3] < 100) A_min += `0${train_type[3]}`;
            else  A_min += `${train_type[3]}`;
            if (train_type[4] < 10) A_max += `00${train_type[4]}`;
            else if (train_type[4] < 100) A_max += `0${train_type[4]}`;
            else A_max += `${train_type[4]}`;
        }
        output = output + `${line}号线 ${train_id}\n`;
        output = output + `${train_type[1]} ${train_type[2]} (${A_min}~${A_max})\n`;
        output = output + special_carriage(line, id, train_type[5], train_type[8], train_type[9], train_type[1], train_type[0]);
    } else if (type == 1) {
        output = "未支持";
    }
    return output;
}
function linedefault(id, type, line) {
    // (Y - C) / trains + D = A ...... X;
    //   0      1       2    3  4    5      6         7
    // Y_min, Y_max, trains, D, C, A_min, A_max, train_types
    data_lines = [
        [], [], [],
        [], [], [], [], [], [], [],
        // start from line 10
        [1, 402, 6, 1, 0, 1, 67, 2],
        [1, 492, 6, 1, 0, 1, 82, 3],
        [1, 450, 6, 1, 0, 1, 75, 3],
        [1, 552, 6, 1, 0, 1, 92, 3],
        [1, 392, 8, 1, 0, 1, 49, 1],
        [1, 324, 6, 1, 0, 1, 54, 1],
        [1, 228, -1, -1, -1, 1, 61, 2], // 因为包含16A01&02, 所以后面特殊处理
        [1, 228, 6, 1, 0, 1, 38, 2],
        [1, 336, 6, 1, 0, 1, 56, 2],
        [1, 44, 4, 1, 0, 1, 11, 1] // T01 PJ Line
    ]
    // No, Nickname, A_min, A_max, digits(after line num)
    diff_trains = [
        // line 0~9
        [], [], [], [], [], [], [], [], [], [],
        //line 10~T01 (No JC)
        [
            ["10A01", "热带鱼", 1, 41, 3],
            ["10A02", "热带鱼二世", 42, 67, 3]
        ],
        [
            ["11A01", "奶咖", 1, 66, 2],
            ["11A02", "伪咖", 67, 72, 2],
            ["11A03", "奶咖二世", 73, 82, 2],
        ],
        [
            ["12A01", "雪碧", 1, 41, 2],
            ["12A02", "雪碧二世", 42, 56, 2],
            ["12A03", "雪碧三世", 57, 75, 3]
        ],
        [
            ["13A01", "奶粉", 1, 24, 2],
            ["13A02", "奶粉二世", 25, 62, 2],
            ["13A03", "奶粉三世", 63, 92, 3]
        ],
        [
            ["14A01", "高达", 1, 49, 3]
        ],
        [
            ["15A01", "长鼻猴", 1, 54, 3]
        ],
        [
            ["16A01", "抹茶", 1, 46, 2],
            ["16A02", "抹茶二世", 47, 61, 3]
        ],
        [
            ["17A01", "西柚", 1, 28, 2],
            ["17A02", "西柚二世", 29, 38, 3]
        ],
        [
            ["18A01", "闪电侠", 1, 50, 3],
            ["18A02", "闪电侠二世", 51, 56, 3]
        ],
        [
            ["APM300", "小灰灰", 1, 11, 2]
        ]
    ]
    let output = ``;
    if (type == 0) {
        // console.log(line);
        // console.log(line, data_lines[line]);
        // console.log(data_lines[line][5]);
        if (!(id >= data_lines[line][5] && id <= data_lines[line][6])) {
            if (line == 19) return `此列车不存在, 浦江线允许车号: ${data_lines[line][5]}~${data_lines[line][6]}`;
            return `此列车不存在, ${line}号线允许车号: ${data_lines[line][5]}~${data_lines[line][6]}`;
        }
        let line16 = -1;
        // 找车型
        for (let t = 0; t < data_lines[line][7]; t++) {
            if (id >= diff_trains[line][t][2] && id <= diff_trains[line][t][3]) {
                const digits = diff_trains[line][t][4];
                let A_min = diff_trains[line][t][2];
                let A_max = diff_trains[line][t][3];
                if (digits == 2) {
                    if (id < 10) id = `0${id}`;
                    else id = `${id}`;
                    if (A_min < 10) A_min = `${line}0${A_min}`;
                    else A_min = `${line}${A_min}`;
                    if (A_max < 10) A_max = `${line}0${A_max}`;
                    else A_max = `${line}${A_max}`;

                } else {
                    // 3 digits
                    if (id < 10) id = `00${id}`;
                    else if (id < 100) id = `0${id}`;
                    else id = `${id}`;
                    if (A_min < 10) A_min = `${line}00${A_min}`;
                    else if (A_min < 100) A_min = `${line}0${A_min}`;
                    else A_min = `${line}${A_min}`;
                    if (A_max < 10) A_max = `${line}00${A_max}`;
                    else if (A_max < 100) A_max = `${line}0${A_max}`;
                    else A_max = `${line}${A_max}`;
                }
                // x号线 xxyy xxAzz/xxCzz Nickname (A1~A2) trains
                if (line == 19) output = output + `浦江线 T01${id}\n${diff_trains[line][t][0]} ${diff_trains[line][t][1]}(${A_min}~${A_max})\n`;
                else output = output + `${line}号线 ${line}${id}\n${diff_trains[line][t][0]} ${diff_trains[line][t][1]}(${A_min}~${A_max})\n`;
                if (line == 16) line16 = t;
                break;
            }
        }
        // (Y - C) / trains + D = A ...... X;
        //   0      1       2    3  4    5      6         7
        // Y_min, Y_max, trains, D, C, A_min, A_max, train_types
        // console.log(line16);
        if (line16 == 0) {
            output += get_carriage(line, id, 3, 1, 0);
        }
        else if (line16 == 1) {
            output += get_carriage(line, id, 6, 24, 0);
        }
        else {
            output += get_carriage(line, id, data_lines[line][2], data_lines[line][3], data_lines[line][4]);
        }
    } else if (type == 1) {
        // console.log(id);
        return "未支持";
        carriage_id = id;
        let flag = false;
        if (carriage_id.length > 6) {
            return "内容未填或有误";
        }
        if (!(carriage_id >= data_lines[line][0] && carriage_id <= data_lines[line][1])) {
            flag = true;
        }
        carriage_id = carriage_id.slice(0, 5);
        console.log(carriage_id);
        if (flag) {
            if (id.slice(0, 2) == "09") {
                id = parseInt(id.slice(2, 5));
                if (carriage_id > 0 && carriage_id < 631) {
                    flag = false;
                }
            }
        }
        if (flag) {
            return "此车厢不存在, 9号线允许车体号: 1~630";
        }
        id = get_train(9, id, 6, 1);
        if (id > 0 && id < 11) {
            let p = '0';
            if (id == 10) {
                p = '';
            }
            output = output + `9号线 09${p}${id}\n09A01 蚕宝宝(0901~0910)\n`;
        } else if ((id > 10 && id < 42 || id > 45 && id < 52) && id != 48) {
            output = output + `9号线 09${id}\n09A02 坂田(0911~0951)\n`;
        } else if (id > 41 && id < 46 || id == 48) {
            output = output + `9号线 09${id}\n09A02 世博坂田(0942~0945, 0948)\n`;
        } else if (id == 52) {
            output = output + `9号线 0952\n09ASY 电气男孩(0952)\n`;
        } else if (id > 52 && id < 89) {
            output = output + `9号线 09${id}\n09A03 创可贴(0953~0988)\n`;
        } else if (id > 88 && id < 106) {
            let p = '0';
            if (id > 99) {
                p = ''
            }
            output = output + `9号线 09${p}${id}\n09A05 创可贴二世(09089~09105)\n`;
        }

        output = output + get_carriage(9, id, 6, 1);
    }
    return output;
}

function submitInfo() {
    const train = document.getElementById("train-id").value.trim();
    const carry = document.getElementById("carriage-id").value.trim();
    // const t_car = document.getElementById("train-carriage-id").value.trim();
    if (cl_time >= 10) line = document.getElementById("line-dev").value.trim();
    else line = document.getElementById("line").value.trim();
    // console.log(line);
    // console.log(train, carry);
    let output = "";
    if (line == "select-notice-line") {
        output = "请选择线路";
        document.getElementById("outputBox").textContent = output;
        return;
    }
    if (line == "line-01") {
        document.getElementById("line-01-type").style.display = "";
    }
    else {
        document.getElementById("line-01-type").style.display = "none";
    }
    // console.log(train);
    // console.log(parseInt(train));
    // console.log("line", line, "train", train, "carry", carry);
    if (train && carry) {
        output += "同时输入则仅计算车号转车体号\n";
    }
    if (train) {
        // console.log(linedefault(train, 0, parseInt(line.split("-")[1], 10)));

        if (line == "line-01") {
            output += line01(parseInt(train), 0);
        }
        else if (line == "line-06") {
            output += line06(parseInt(train), 0);
        }
        else if (line == "line-07") {
            output += line07(parseInt(train), 0);
        }
        else if (line == "line-08") {
            output += line08(parseInt(train), 0);
        }
        else if (line == "line-09") {
            output += line09(parseInt(train), 0);
        }
        else if (line == "line-jc") {
            output += "未支持";
        }
        else if (line == 'line-02') {
            output += linespecial(parseInt(train), 0, 2);
        }
        else if (line == 'line-03') {
            output += linespecial(parseInt(train), 0, 3);
        }
        else if (line == 'line-04') {
            output += linespecial(parseInt(train), 0, 4);
        }
        else if (line == 'line-05') {
            output += linespecial(parseInt(train), 0, 5);
        }
        else if (line == 'line-t01') {
            // line T01
            // console.log("T01");
            document.getElementById("carriage-id").placeholder = "车体号(请勿输入T01)";
            output += linedefault(parseInt(train), 0, 19, 10);
        }
        else {
            // line 10~18
            output += linedefault(parseInt(train), 0, parseInt(line.split("-")[1], 10));
        }
    } else if (carry) {
        // console.log(linedefault(carry, 1, parseInt(line)));
        if (line == "line-01") {
            output += line01(carry, 1);
        }
        else if (line == "line-02") {
            output += line02(carry, 1);
        }
        else if (line == "line-03") {
            output += line03(carry, 1);
        }
        else if (line == "line-04") {
            output += line04(carry, 1);
        }
        else if (line == "line-05") {
            output += line05(carry, 1);
        }
        else if (line == "line-06") {
            output += line06(carry, 1);
        }
        else if (line == "line-07") {
            output += line07(carry, 1);
        }
        else if (line == "line-08") {
            output += line08(carry, 1);
        }
        else if (line == "line-09") {
            output += line09(carry, 1);
        }
        else {
            output += linedefault(carry, 1, parseInt(line.split("-")[1], 10));
        }
    }
    // else if (t_car) {
    //     output = "";
    // }
    else {
        output = "内容未填或有误";
    }
    document.getElementById("outputBox").textContent = output;
}
const inputs = document.querySelectorAll('input');
const selects = document.querySelectorAll('select');
inputs.forEach(input => {
    input.addEventListener('input', submitInfo);
});
selects.forEach(select => {
    select.addEventListener('input', submitInfo);
});
submitInfo();
function saveTextToFile(filename, textContent) {
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename; // 设定下载的文件名
    link.click();
    URL.revokeObjectURL(link.href); // 清理内存
}