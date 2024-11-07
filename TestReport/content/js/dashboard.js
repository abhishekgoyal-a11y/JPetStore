/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7831715210355987, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Select Product - 4"], "isController": true}, {"data": [1.0, 500, 1500, "Select Item"], "isController": true}, {"data": [1.0, 500, 1500, "Select Category"], "isController": false}, {"data": [1.0, 500, 1500, "Select Product - 2"], "isController": true}, {"data": [1.0, 500, 1500, "Select Product - 3"], "isController": true}, {"data": [1.0, 500, 1500, "Sign In - 4"], "isController": true}, {"data": [1.0, 500, 1500, "Sign In - 3"], "isController": true}, {"data": [1.0, 500, 1500, "Select Product"], "isController": false}, {"data": [1.0, 500, 1500, "Select Item-17"], "isController": false}, {"data": [1.0, 500, 1500, "Select Category - 3"], "isController": true}, {"data": [1.0, 500, 1500, "Select Category - 4"], "isController": true}, {"data": [1.0, 500, 1500, "Select Product - 3-32"], "isController": false}, {"data": [1.0, 500, 1500, "Select Category - 2"], "isController": true}, {"data": [0.5, 500, 1500, "Open Url - 4"], "isController": true}, {"data": [1.0, 500, 1500, "Select Item - 3-33"], "isController": false}, {"data": [0.4918032786885246, 500, 1500, "Open Url - 2"], "isController": true}, {"data": [1.0, 500, 1500, "Select Item - 4-65"], "isController": false}, {"data": [0.5, 500, 1500, "Open Url - 3"], "isController": true}, {"data": [1.0, 500, 1500, "Select Item - 4"], "isController": true}, {"data": [1.0, 500, 1500, "Sign In - 4-61-0"], "isController": false}, {"data": [1.0, 500, 1500, "Select Category - 3-31"], "isController": false}, {"data": [1.0, 500, 1500, "Add to Cart - 3-35"], "isController": false}, {"data": [1.0, 500, 1500, "Sign In - 4-61-1"], "isController": false}, {"data": [1.0, 500, 1500, "Select Product - 4-64"], "isController": false}, {"data": [1.0, 500, 1500, "Select Category - 4-63"], "isController": false}, {"data": [1.0, 500, 1500, "Select Item - 2"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "Add to Cart - 3"], "isController": false}, {"data": [1.0, 500, 1500, "Select Item - 3"], "isController": true}, {"data": [1.0, 500, 1500, "Add to Cart - 4"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "Open URL - 1"], "isController": true}, {"data": [0.5, 500, 1500, "Open Url - 4-59"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "Open URL"], "isController": false}, {"data": [0.4927536231884058, 500, 1500, "Open Url"], "isController": false}, {"data": [1.0, 500, 1500, "Sign In - 4-61"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 339, 0, 0.0, 437.4188790560474, 0, 3026, 208.0, 825.0, 858.0, 1548.2000000000012, 17.10738796931772, 70.75953262199738, 9.858126403537545], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Select Product - 4", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 20.19794170673077, 3.197303185096154], "isController": true}, {"data": ["Select Item", 39, 0, 0.0, 193.05128205128204, 135, 291, 198.0, 212.0, 217.0, 291.0, 3.1195008798592228, 14.724909639457685, 2.0498282774756036], "isController": true}, {"data": ["Select Category", 49, 0, 0.0, 201.10204081632656, 176, 264, 200.0, 215.0, 225.0, 264.0, 3.632858837485172, 13.935419446915777, 2.302466196804567], "isController": false}, {"data": ["Select Product - 2", 49, 0, 0.0, 139.14285714285714, 0, 228, 191.0, 213.0, 222.0, 228.0, 3.706505295007564, 10.230784913956127, 1.710387906580938], "isController": true}, {"data": ["Select Product - 3", 8, 0, 0.0, 145.0, 0, 200, 189.5, 200.0, 200.0, 200.0, 0.7737692233291421, 2.289004316181449, 0.38594006915562434], "isController": true}, {"data": ["Sign In - 4", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 13.429588607594937, 4.212816455696203], "isController": true}, {"data": ["Sign In - 3", 8, 0, 0.0, 405.875, 390, 416, 411.0, 416.0, 416.0, 416.0, 0.8984725965858041, 4.766116352201258, 1.4951145552560647], "isController": true}, {"data": ["Select Product", 34, 0, 0.0, 200.52941176470586, 185, 228, 202.0, 217.5, 224.25, 228.0, 3.503348789283874, 13.936216029108706, 2.329863794435858], "isController": false}, {"data": ["Select Item-17", 8, 0, 0.0, 169.75, 135, 291, 155.0, 291.0, 291.0, 291.0, 0.8454872120059184, 7.286547505812725, 0.5507226273515113], "isController": false}, {"data": ["Select Category - 3", 8, 0, 0.0, 199.0, 185, 214, 199.0, 214.0, 214.0, 214.0, 0.8541533205210335, 3.6768631219303867, 0.5413530322442879], "isController": true}, {"data": ["Select Category - 4", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 20.4433692893401, 3.2172033629441623], "isController": true}, {"data": ["Select Product - 3-32", 6, 0, 0.0, 193.33333333333334, 186, 200, 193.5, 200.0, 200.0, 200.0, 0.8684324793747287, 3.4253894376899696, 0.5775415219279201], "isController": false}, {"data": ["Select Category - 2", 59, 0, 0.0, 167.0169491525423, 0, 264, 199.0, 212.0, 224.0, 264.0, 3.2567895782733496, 10.375410548686244, 1.714267170595054], "isController": true}, {"data": ["Open Url - 4", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 7.037213740458015, 0.6162531806615776], "isController": true}, {"data": ["Select Item - 3-33", 3, 0, 0.0, 201.33333333333334, 200, 202, 202.0, 202.0, 202.0, 202.0, 0.6286672254819782, 2.46125674507544, 0.41440466523470243], "isController": false}, {"data": ["Open Url - 2", 61, 0, 0.0, 814.4426229508197, 734, 1520, 794.0, 840.8, 865.9, 1520.0, 3.105906313645621, 16.1144248822556, 1.7317078506873727], "isController": true}, {"data": ["Select Item - 4-65", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 19.644119032663315, 3.307553391959799], "isController": false}, {"data": ["Open Url - 3", 8, 0, 0.0, 798.375, 752, 857, 797.0, 857.0, 857.0, 857.0, 0.8418394191308007, 4.656424287067241, 0.4472271914132379], "isController": true}, {"data": ["Select Item - 4", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 19.644119032663315, 3.307553391959799], "isController": true}, {"data": ["Sign In - 4-61-0", 9, 0, 0.0, 202.44444444444446, 190, 218, 201.0, 218.0, 218.0, 218.0, 1.0695187165775402, 0.24022393048128346, 1.0287850935828877], "isController": false}, {"data": ["Select Category - 3-31", 8, 0, 0.0, 199.0, 185, 214, 199.0, 214.0, 214.0, 214.0, 0.7601672367920943, 3.2722824021284684, 0.48178568034967695], "isController": false}, {"data": ["Add to Cart - 3-35", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 24.464142628205128, 3.3854166666666665], "isController": false}, {"data": ["Sign In - 4-61-1", 9, 0, 0.0, 201.66666666666666, 197, 211, 199.0, 211.0, 211.0, 211.0, 1.0696458283812693, 5.4338843742571905, 0.7510501470763015], "isController": false}, {"data": ["Select Product - 4-64", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 20.19794170673077, 3.197303185096154], "isController": false}, {"data": ["Select Category - 4-63", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 20.4433692893401, 3.2172033629441623], "isController": false}, {"data": ["Select Item - 2", 34, 0, 0.0, 181.5, 0, 217, 198.0, 212.0, 214.0, 217.0, 3.5022661722290893, 11.86088873223115, 2.103009438092295], "isController": true}, {"data": ["Add to Cart - 3", 3, 0, 0.0, 1008.6666666666667, 0, 3026, 0.0, 3026.0, 3026.0, 3026.0, 0.6564551422319475, 1.043874794857768, 0.1444543216630197], "isController": false}, {"data": ["Select Item - 3", 6, 0, 0.0, 100.66666666666666, 0, 202, 100.0, 202.0, 202.0, 202.0, 0.8924587237840249, 1.7470053826416778, 0.2941453313253012], "isController": true}, {"data": ["Add to Cart - 4", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": false}, {"data": ["Open URL - 1", 60, 0, 0.0, 852.8666666666667, 743, 1658, 803.0, 903.0, 1393.6999999999994, 1658.0, 5.666257436962886, 31.34148644820096, 3.010199263386533], "isController": true}, {"data": ["Open Url - 4-59", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 7.037213740458015, 0.6162531806615776], "isController": false}, {"data": ["Open URL", 60, 0, 0.0, 852.8666666666667, 743, 1658, 803.0, 903.0, 1393.6999999999994, 1658.0, 5.708848715509039, 31.577069457659373, 3.032825880114177], "isController": false}, {"data": ["Open Url", 69, 0, 0.0, 812.5507246376811, 734, 1520, 794.0, 841.0, 862.0, 1520.0, 3.5132382892057024, 18.367479872072302, 1.948102962703666], "isController": false}, {"data": ["Sign In - 4-61", 9, 0, 0.0, 404.6666666666667, 390, 416, 410.0, 416.0, 416.0, 416.0, 1.044689495066744, 5.541751305861869, 1.7384286128845037], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 339, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
