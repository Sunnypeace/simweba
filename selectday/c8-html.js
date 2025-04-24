function c8html(args) {
  const [isavefilename, isex, iname, dateType, ibirthdate, ibirthtime] = args;
  const [year, month, day] = ibirthdate.split('-').map(Number);
  const [hour, minute] = ibirthtime.split(':').map(Number);

  let solarDate, lunarDate;

  if (dateType === 'lunar') {
      lunarDate = Lunar.fromYmd(year, month, day);
      solarDate = lunarDate.getSolar();    
  } else {
      solarDate = Solar.fromYmdHms(year, month, day, hour, minute, 0);
      lunarDate = solarDate.getLunar();
  }

  let sex = isex === "male" ? 1 : 0;
  let sexStr = isex === "male" ? "男" : "女";

  let dateTypeStr = dateType === "solar"
      ? `西曆: ${ibirthdate} 農曆:${lunarDate.getYear()}-${lunarDate.getMonth()}-${lunarDate.getDay()}`
      : `西曆:${solarDate.getYear()}-${solarDate.getMonth()}-${solarDate.getDay()} 農曆:${ibirthdate}`;

  const titleline = `${iname} ${sexStr} ：${dateTypeStr}`;

  const d = lunarDate.getEightChar();

  function replaceWords(text) {
      if (typeof text !== 'string') return text;
      const replacements = {
          '正印': '印', '劫财': '劫', '正官': '官', '七杀': '殺',
          '比肩': '比', '伤官': '傷', '正财': '財', '偏财': '才',
          '偏印': '梟', '食神': '食', '日主': '日'
      };
      return text.replace(/正印|劫财|正官|七杀|比肩|伤官|正财|偏财|偏印|食神|日主/g, 
        match => replacements[match]);
  }


  // as d.getTimeHideGan() and d.getTimeShiShenZhi() return an array, we need to take each array item to replaceWords()
// 定义一个函数processText，用于处理文本
function processText(input, applyReplacements = false) {
    // 判断输入是否为数组
    if (Array.isArray(input)) {
        // 如果是数组，则遍历数组中的每个元素
        return input.map(item => applyReplacements ? replaceWords(item) : item).join(' ');
    }
    // 如果不是数组，则直接返回处理后的文本
    return applyReplacements ? replaceWords(input) : input;
}

  var yun = d.getYun(sex);
  var daYunArr = yun.getDaYun();

  const eightCharactersTable = `
    <h2>八字排算</h2>
    <h3>${titleline}</h3>
    <table class="eight-char-table">
        <tr><td>${replaceWords(d.getTimeShiShenGan())}</td><td>${replaceWords(d.getDayShiShenGan())}</td><td>${replaceWords(d.getMonthShiShenGan())}</td><td>${replaceWords(d.getYearShiShenGan())}</td></tr>
        <tr><td>${d.getTimeGan()}</td><td>${d.getDayGan()}</td><td>${d.getMonthGan()}</td><td>${d.getYearGan()}</td></tr>
        <tr><td>${d.getTimeZhi()}</td><td>${d.getDayZhi()}</td><td>${d.getMonthZhi()}</td><td>${d.getYearZhi()}</td></tr>
        <tr><td>${processText(d.getTimeHideGan())}</td><td>${processText(d.getDayHideGan())}</td><td>${processText(d.getMonthHideGan())}</td><td>${processText(d.getYearHideGan())}</td></tr>
        <tr><td>${processText(d.getTimeShiShenZhi(), true)}</td><td>${processText(d.getDayShiShenZhi(), true)}</td><td>${processText(d.getMonthShiShenZhi(), true)}</td><td>${processText(d.getYearShiShenZhi(), true)}</td></tr>
    </table>
  `;


  let daYunRows = [[], [], []];
  for (let i = 1; i <= 10; i++) {
      if (daYunArr[i]) {
          daYunRows[0].push(`<td>${daYunArr[i].getStartYear()}</td>`);
          daYunRows[1].push(`<td>${daYunArr[i].getStartAge()}岁</td>`);
          daYunRows[2].push(`<td>${daYunArr[i].getGanZhi()}</td>`);
      }
  }
  const daYunTable = `
    <h2>大運</h2>
    <table class="dayun-table">
        <tr>${daYunRows[0].join('')}</tr>
        <tr>${daYunRows[1].join('')}</tr>
        <tr>${daYunRows[2].join('')}</tr>
    </table>
  `;

  let tableRows = "";
  for (let i = 1; i <= 6; i++) {
      let LiuNianArr = daYunArr[i].getLiuNian();
      for (let j = 0; j < LiuNianArr.length; j += 10) {
          tableRows += `<tr>` +
              LiuNianArr.slice(j, j + 10).map(liuNian => `<td>${liuNian.getYear()}</td>`).join('') +
              `</tr><tr>` +
              LiuNianArr.slice(j, j + 10).map(liuNian => `<td>${liuNian.getGanZhi()}</td>`).join('') +
              `</tr>`;
      }
  }

  const liuNianTable = `
    <h2>流年</h2>
    <table class="liunian-table">
        ${tableRows}
    </table>
  `;

    // Define showTitle by removing '.html' from isavefilename
    const showTitle = isavefilename.replace('.html', '');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${showTitle}</title>
        <style>
            table { border-collapse: collapse; width: 80%; margin: auto; }
            th, td { border: 1px solid black; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            .eight-char-table { margin-top: 20px; width: 60%; table-layout: fixed; }
            .eight-char-table tr:nth-child(2), .eight-char-table tr:nth-child(3) { font-size: 1.5em; font-weight: bold; color: blue; }
            .dayun-table, .liunian-table { margin-bottom: 30px; width: 80%; table-layout: fixed; }
            .dayun-table td, .liunian-table td { width: 10%; }
            body { justify-content: center; align-items: center; min-height: 100vh; max-width: 600px; margin: 0; }
            h2 { text-align: center; }
            h3 { text-align: center; font-size: large; font-weight: bold; }
        </style>
    </head>
    <body>
        ${eightCharactersTable}
        ${daYunTable}
        ${liuNianTable}
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const element = document.createElement('a');
  element.href = URL.createObjectURL(blob);
  element.download = isavefilename;

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  console.log(`Saved HTML filename: ${isavefilename}`);

  const result = {
    yearGan: d.getYearGan(),
    yearZhi: d.getYearZhi(),
    dayGan: d.getDayGan(),
    dayZhi: d.getDayZhi()
  };

  console.log(result); // Log the result object to the console
  return result; // Return the result object

//   const eightCharResult = c8html([saveFileName, sex, name, dateType, datePart, birthTime]);

// // Now you can access the values:
// console.log("Year Gan:", eightCharResult.yearGan);
// console.log("Year Zhi:", eightCharResult.yearZhi);
// console.log("Day Gan:", eightCharResult.dayGan);
// console.log("Day Zhi:", eightCharResult.dayZhi);
}

