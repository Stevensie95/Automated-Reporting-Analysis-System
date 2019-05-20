/*jslint white:true */
/*global angular, Highcharts, $ */
//Felix handsome boi2 doing visualization
app.controller('visualizationController', function ($scope, $http, $window) {
    'use strict';
    $scope.chartDurationGarbageSelected = "Line";
    $scope.changeChartDurationGarbage = function (chart) {
        if (chart === 'Line') {
            $scope.chartDurationGarbageSelected = "Line";
        } else if (chart === 'Bar') {
            $scope.chartDurationGarbageSelected = "Bar";
        }
    }

    var stringToTime = function (string) {
        var strArray = string.split(":");
        var d = new Date();
        d.setHours(strArray[0], strArray[1], strArray[2]);

        return d;
    }
    var getElementList = function (element, data) {
        var objReturn = [];
        var i, j;
        var exist = false;
        var timeStart, timeEnd, duration;
        var dimension = false;
        //var countComplete, countIncomplete;
        for (i = 0; i < data.length; i += 1) {
            if (element === "reportCollectionDate") {
                objReturn.push(data[i].reportCollectionDate);
            } else if (element === "areaID") {
                objReturn.push(data[i].areaID);
            } else if (element === "garbageAmount") {
                objReturn.push(parseInt(data[i].garbageAmount));
            } else if (element === "duration") {
                timeStart = stringToTime(data[i].operationTimeStart)
                timeEnd = stringToTime(data[i].operationTimeEnd);
                duration = (timeEnd - timeStart) / 60 / 1000;
                
                objReturn.push(duration);
            }  else if (element === "area & duration") {
                exist = false;

                timeStart = stringToTime(data[i].operationTimeStart)
                timeEnd = stringToTime(data[i].operationTimeEnd);
                duration = (timeEnd - timeStart) / 60 / 1000;



                for (j = 0; j < objReturn.length; j += 1) {
                    if (objReturn[j].name === data[i].areaID) {
                        objReturn[j].data.push(duration);
                        exist = true;
                    }
                }
                if (!exist) {
                    objReturn.push({
                        "name": data[i].areaID,
                        "data": [duration]
                    });
                }
            } else if (element === "amountGarbageOnArea") {
                exist = false;
                for (j = 0; j < objReturn.length; j += 1) {
                    if (objReturn[j].name === data[i].areaID) {
                        objReturn[j].y += parseInt(data[i].garbageAmount);
                        exist = true;
                    }
                }
                if (!exist) {
                    objReturn.push({
                        "name": data[i].areaID,
                        "y": parseInt(data[i].garbageAmount)
                    });
                }
            }else if (element === "completionStatusArea"){
                exist = false;
                var complete = data[i].completionStatus === "1" ? true : false;
                
                if(!dimension){
                    for(var num = 0; num < 3; num+=1){
                        objReturn[num] = [];
                    }
                    dimension = true;
                }
                
                for(j = 0; j < objReturn[0].length; j += 1){
                    if(objReturn[0][j] === data[i].areaID){
                        objReturn[1][j] += complete === true ? -1 : 0;
                        objReturn[2][j] += complete === false ? 1 : 0;
                        
                        exist = true;
                    }
                    
                }
                //add new area
                if(!exist){
                    objReturn[0].push(data[i].areaID);
                    objReturn[1].push(complete === true ? -1 : 0);
                    objReturn[2].push(complete === false ? 1 : 0);
                }    
            }
        }

        return objReturn;
    }
    $http.get("/data_json/reports.json")
        .then(function (response) {
                $scope.reportList = response.data;
//                var obj = getElementList("completionStatusArea", $scope.reportList);
//                console.log(obj);
                displayChart();

            },
            function (response) {
                $window.console.log("errror retrieving json file - " + response);
            });
    //chart-line-duration-garbage
    var displayChart = function () {
        Highcharts.chart('chart-line-duration-garbage', {

            title: {
                text: 'Areas Collection Duration'
            },

            subtitle: {
                text: 'Trienekens'
            },
            xAxis: {
                categories: getElementList("reportCollectionDate", $scope.reportList)
            },
            yAxis: {
                title: {
                    text: 'Duration in Minutes'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} minutes</b></td></tr>'
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    }
                }
            },

            series: getElementList("area & duration", $scope.reportList),

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
        }]
            }

        });

        //chart-bar-duration-garbage
        Highcharts.chart('chart-bar-duration-garbage', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Areas Collection Duration'
            },
            subtitle: {
                text: 'Trienekens'
            },
            xAxis: {
                categories: getElementList("reportCollectionDate", $scope.reportList),
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Duration in Minutes'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} minutes</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: getElementList("area & duration", $scope.reportList)
        });

        //chart-pie-volume-area
        Highcharts.chart('chart-pie-volume-area', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Garbage Amount based on Area'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Amount',
                colorByPoint: true,
                data: getElementList("amountGarbageOnArea", $scope.reportList)
    }]
        });
    
    //chart-line-volume-day
    {
        $.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json',
            function (data) {

                Highcharts.chart('chart-line-volume-day', {
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: 'USD to EUR exchange rate over time'
                    },
                    subtitle: {
                        text: document.ontouchstart === undefined ?
                            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: 'Exchange rate'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [{
                        type: 'area',
                        name: 'USD to EUR',
                        data: data
            }]
                });
            }
        );
    }
    //chart-combine-durvol-day
    Highcharts.chart('chart-combine-durvol-day', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Comparison between Duration and Volume of Garbage Collection'
        },
        subtitle: {
            text: 'Trienekens'
        },
        xAxis: [{
            categories: getElementList("reportCollectionDate", $scope.reportList),
            crosshair: true
    }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}minutes',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Duration',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
    }, { // Secondary yAxis
            title: {
                text: 'Garbage Amount',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} ton',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
    }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'Garbage Amount',
            type: 'column',
            yAxis: 1,
            data: getElementList("garbageAmount", $scope.reportList),
            tooltip: {
                valueSuffix: ' ton'
            }

    }, {
            name: 'Duration',
            type: 'spline',
            data: getElementList("duration", $scope.reportList),
            tooltip: {
                valueSuffix: ' minutes'
            }
    }]
    });

    //chart-negativebar-status-area
    Highcharts.chart('chart-negativebar-status-area', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Areas Count of Completion Status'
        },
        subtitle: {
            text: 'Trienekens'
        },
        xAxis: [{
            categories: getElementList("completionStatusArea", $scope.reportList)[0],
            reversed: false,
            labels: {
                step: 1
            }
    }, { // mirror axis on right side
            opposite: true,
            reversed: false,
            categories: getElementList("completionStatusArea", $scope.reportList)[0],
            linkedTo: 0,
            labels: {
                step: 1
            }
    }],
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return Math.abs(this.value);
                }
            }
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + ', area ' + this.point.category + '</b><br/>' +
                    'Complete/Incomplete Count: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
            }
        },

        series: [{
            name: 'Complete',
            data: getElementList("completionStatusArea", $scope.reportList)[1]
    }, {
            name: 'Incomplete',
            data: getElementList("completionStatusArea", $scope.reportList)[2]
    }]
    });
    }
});