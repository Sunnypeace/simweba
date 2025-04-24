// yiday.js

// Usage examples:
// const csv = generateLunarCsvRange("2025-01", "2025-03"); // Returns CSV string for Jan to Mar 2025
// downloadLunarCsvRange("2025-01", "2025-03"); // Downloads CSV file for Jan to Mar 2025

// To get CSV content as a string
// const csvData = generateLunarCsvRange("2025-02", "2025-04");
// console.log(csvData);

// // To download the CSV file
// downloadLunarCsvRange("2025-02", "2025-04");

function generateLunarCsvRange(fromYearMonth, toYearMonth) {
    // Parse input strings (expected format: "YYYY-MM")
    const [fromYear, fromMonth] = fromYearMonth.split('-').map(Number);
    const [toYear, toMonth] = toYearMonth.split('-').map(Number);

    // Validate inputs
    if (isNaN(fromYear) || isNaN(fromMonth) || isNaN(toYear) || isNaN(toMonth)) {
        throw new Error("Invalid date format. Use 'YYYY-MM'");
    }
    if (fromMonth < 1 || fromMonth > 12 || toMonth < 1 || toMonth > 12) {
        throw new Error("Month must be between 1 and 12");
    }
    if (fromYear > toYear || (fromYear === toYear && fromMonth > toMonth)) {
        throw new Error("From date must be before or equal to To date");
    }

    let csvContent = "Solar Date,Lunar Date,Weekday,Jie,YrGZ,MnGZ,DyGZ,Yi Count,Ji Count,Yi Items,Ji Items\n";

    // Calculate start and end points in terms of total months
    const startTotalMonths = fromYear * 12 + (fromMonth - 1);
    const endTotalMonths = toYear * 12 + (toMonth - 1);

    for (let totalMonths = startTotalMonths; totalMonths <= endTotalMonths; totalMonths++) {
        const year = Math.floor(totalMonths / 12);
        const month = (totalMonths % 12) + 1;
        const lastDay = new Date(year, month, 0).getDate();

        for (let day = 1; day <= lastDay; day++) {
            const hour = 12;
            const minute = 0;
            const second = 0;

            const currentDate = Solar.fromYmdHms(year, month, day, hour, minute, second);
            const currentLunar = currentDate.getLunar();

            const yiCount = currentLunar.getDayYi().length;
            const jiCount = currentLunar.getDayJi().length;
            const weekdayNumber = currentLunar.getWeek();
            const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
            const weekday = weekdays[weekdayNumber];

            const solarDate = currentDate.toYmd();
            // const lunarDate = currentLunar.getMonthInChinese() + "月" + currentLunar.getDayInChinese();
            const lunarDate = currentLunar.getYear()+"-"+currentLunar.getMonth() + "-" + currentLunar.getDay();
            const jieQi = currentLunar.getJieQi();
            const yiItems = currentLunar.getDayYi().join('; ');
            const jiItems = currentLunar.getDayJi().join('; ');
            const bazi = currentLunar.getBaZi(); // Returns array like ["丙午", "庚寅", "己酉", "庚午"]
            const baziFiltered = bazi.slice(0, 3).join(','); // Keep first three pillars (Year, Month, Day), join with separator

            // Include filtered BaZi (Year, Month, Day pillars) in CSV
            csvContent += `${solarDate},${lunarDate},${weekday},${jieQi},${baziFiltered},${yiCount},${jiCount},"${yiItems}","${jiItems}"\n`;
         }
    }

    return csvContent;
}

// Optional: Function to download the CSV
function downloadLunarCsvRange(fromYearMonth, toYearMonth) {
    const csvData = generateLunarCsvRange(fromYearMonth, toYearMonth);
    // The following code will download the CSV file
    const csvFile = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.download = `LunarInfo_${fromYearMonth}_to_${toYearMonth}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    return csvData; // Return the CSV string instead of initiating download
}

