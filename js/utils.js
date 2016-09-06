/*
 * (C) Copyright 2013-2015 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var request = require('request');
var async = require('async');

var path = "ci.kurento.org/jenkins/job/Development/view/4%20-%20Audit/view/";

function getStatus(jobs, auditFolder, authJenkins, allIssues, callbackEnd) {
    var statusHtml = "";

    var nameDashboard = auditFolder;
    if (auditFolder == "Capabilities") {
        nameDashboard = "Kurento";
    } else if (auditFolder == "WebRtc") {
        nameDashboard = "WebRTC"
    }

    var auditFolderLine = '<h3><a href="https://ci.kurento.org/jenkins/job/Development/view/1%20-%20Dashboards/view/' + nameDashboard + '" target="_blank">' + nameDashboard + '</a></h3><ul>';
    statusHtml = statusHtml + auditFolderLine;

    async.each(jobs, function(job, callback) {
        async.parallel([
                function(callback) {

                    var URI = 'https://' + authJenkins + '@' + path + auditFolder + '/job/' + job + '/lastBuild/testReport/api/json?pretty=true';

                    var options = {
                        url: URI,
                        headers: {
                            'Content-Type': 'Content-Type: application/json',
                            'Accept': 'application/json'
                        },
                        strictSSL: false,
                        method: 'POST'
                    }

                    request(options, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var json = JSON.parse(body);
                            if (json.failCount > 0) {
                                var jobLine = '<li><font size="3" color="black"><a href="https://' + path + auditFolder + '/job/' + job + '" target="_blank">' + job + '</a></font></li><ul>';
                                var line = "";
                                line = line + jobLine;
                                for (var i = 0; i < json.suites.length; i++) {
                                    var suite = json.suites[i].name;
                                    var pos = suite.lastIndexOf(".");
                                    var suiteUrl = suite.substring(0, pos) + '/' + suite.substring(pos + 1);
                                    var suiteLine = '<li><font size="3" color="black"><a href="https://' + path + auditFolder + '/job/' + job + '/lastBuild/testReport/' + suiteUrl + '" target="_blank">' + suite.substring(suite.lastIndexOf('.') + 1) + '</a></font>';
                                    var hasRegression = false;
                                    var casesLine = "<ul>";
                                    for (var j = json.suites[i].cases.length - 1; j >= 0; j--) {
                                        if ((json.suites[i].cases[j].status == "REGRESSION") || (json.suites[i].cases[j].status == "FAILED")) {
                                            var issueLine = "";
                                            for (issue in allIssues) {
                                                var message = allIssues[issue].description.split("****")
                                                if (message.length > 0) {
                                                    //https://redmine.kurento.org/redmine/issues/' + allIssues[issue].id
                                                    var existMessage = false;
                                                    for (var m = message.length - 1; m >= 0; m--) {
                                                        if ((message[m] != '' && message[m] != '\n') && json.suites[i].cases[j].errorDetails != null && json.suites[i].cases[j].errorDetails.indexOf(message[m]) != -1) {
                                                            existMessage = true;
                                                        }
                                                    };
                                                    if ((allIssues[issue].description.indexOf(job) != -1) && existMessage) {
                                                        issueLine = '<ul><li><font size="3" color="black">' + allIssues[issue].descriptionHtml + '</font></ul></li>';
                                                        break;
                                                    }
                                                }
                                            }
                                            if (issueLine == "") {
                                                issueLine = '<ul><li><font size="3" color="black"><b>Message error:</b> ' + json.suites[i].cases[j].errorDetails + '</font></ul></li>';
                                            }
                                            hasRegression = true;
                                            casesLine = casesLine + '<li><font size="3" color="black">' + json.suites[i].cases[j].name + ' ' + issueLine + '</font></li>';
                                        }
                                    };

                                    casesLine = casesLine + "</ul>";

                                    if (hasRegression) {
                                        suiteLine = suiteLine + casesLine;
                                        line = line + suiteLine + "</li>";
                                    }
                                };
                                statusHtml = statusHtml + line + '</ul>';
                            }
                        } else {
                            var jobLine = '<li><font size="3" color="black"><a href="https://' + path + auditFolder + '/job/' + job + '" target="_blank">' + job + '</a></font></li><ul><li><font size="3" color="black">No está la página de reporte. El job no ha terminado correctamente.</font></li></ul>';
                            statusHtml = statusHtml + jobLine;
                        }
                        callback(null, job);
                    })
                }
            ],
            // optional callback
            function(err, results) {

                callback();

            });
    }, function(err) {
        statusHtml = statusHtml + '</ul></ul>';
        callbackEnd(statusHtml);
    });

}

function getStability(jobs, auditFolder, authJenkins, allIssues, callbackEnd) {
    var stabilityHtml = "";

    var nameDashboard = auditFolder;
    if (auditFolder == "Capabilities") {
        nameDashboard = "Kurento";
    } else if (auditFolder == "WebRtc") {
        nameDashboard = "WebRTC"
    }

    var auditFolderLine = '<h3><a href="https://ci.kurento.org/jenkins/job/Development/view/4%20-%20Audit/view/' + auditFolder + '" target="_blank">' + nameDashboard + '</a></h3><ul>';
    stabilityHtml = stabilityHtml + auditFolderLine;

    var jobByScore = new Array();
    async.each(jobs, function(job, callback) {
        async.parallel([
                function(callback) {

                    var URI = 'https://' + authJenkins + '@' + path + auditFolder + '/job/' + job + '/api/json?pretty=true';

                    var options = {
                        url: URI,
                        headers: {
                            'Content-Type': 'Content-Type: application/json',
                            'Accept': 'application/json'
                        },
                        strictSSL: false,
                        method: 'POST'
                    }

                    request(options, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var json = JSON.parse(body);
                            var score = json.healthReport[0].score;

                            if (score < 80) {
                                jobByScore.push({ job: json.displayName, score: score });
                            }
                        }
                        callback(null, jobByScore);
                    })

                }
            ],
            // optional callback
            function(err, results) {
                callback();
            });
    }, function(err) {
        jobByScore = jobByScore.sort(function(a, b) {
            return a.score - b.score;
        });
        var jobLine = "";
        for (i in jobByScore) {
            var score = jobByScore[i].score;
            var job = jobByScore[i].job;
            jobLine = jobLine + '<li><font size="3" color="black">Estabilidad: ' + score + '%  <a href="https://' + path + auditFolder + '/job/' + job + '" target="_blank">' + job + '</a></font></li>';
            jobLine = jobLine + '<ul>';
            for (issue in allIssues) {
                if (allIssues[issue].description.indexOf(job) != -1) {
                    jobLine = jobLine + '<li><font size="3" color="black">' + allIssues[issue].descriptionHtml + '</font></li>';
                }
            }
            jobLine = jobLine + '</ul>';
        }
        jobLine = jobLine + "</ul>";
        stabilityHtml = stabilityHtml + jobLine;
        callbackEnd(stabilityHtml);
    });
}

function getLastExecution(jobs, auditFolder, authJenkins, callbackEnd) {
    var lastExecutionHtml = "";

    var nameDashboard = auditFolder;
    if (auditFolder == "Capabilities") {
        nameDashboard = "Kurento";
    } else if (auditFolder == "WebRtc") {
        nameDashboard = "WebRTC"
    }

    var auditFolderLine = '<h3><a href="https://ci.kurento.org/jenkins/job/Development/view/4%20-%20Audit/view/' + auditFolder + '" target="_blank">' + nameDashboard + '</a></h3><ul>';
    lastExecutionHtml = lastExecutionHtml + auditFolderLine;

    var jobByScore = new Array();
    async.each(jobs, function(job, callback) {
        async.parallel([
                function(callback) {

                    var URI = 'https://' + authJenkins + '@' + path + auditFolder + '/job/' + job + '/lastBuild/api/json?pretty=true';

                    var options = {
                        url: URI,
                        headers: {
                            'Content-Type': 'Content-Type: application/json',
                            'Accept': 'application/json'
                        },
                        strictSSL: false,
                        method: 'POST'
                    }

                    request(options, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var json = JSON.parse(body);
                            var lastExecution = Math.round(Math.floor((Date.now() - json.timestamp) / 1000) / 60 / 60);

                            if (lastExecution >= 20) {
                                var jobLine = '<li><font size="3" color="black">Última ejecución: ' + lastExecution + ' horas  <a href="https://' + path + auditFolder + '/job/' + job + '" target="_blank">' + job + '</a></font></li>';
                                jobLine = jobLine + '<ul>';
                                jobLine = jobLine + '</ul>';
                                lastExecutionHtml = lastExecutionHtml + jobLine;
                                callback();
                            } else {
                                callback();
                            }
                        }
                    })
                }
            ],
            // optional callback
            function(results) {
                callback(results);
            });
    }, function(results) {
        lastExecutionHtml = lastExecutionHtml + '</ul>';
        callbackEnd(lastExecutionHtml);
    });
}


function getMetricsByJob(jobs, auditFolder, callbackEnd) {
    var metricsHtml = "";

    var nameDashboard = auditFolder;
    if (auditFolder == "Capabilities") {
        nameDashboard = "Kurento";
    } else if (auditFolder == "WebRtc") {
        nameDashboard = "WebRTC"
    }

    var auditFolderLine = '<h3><a href="https://ci.kurento.org/jenkins/job/Development/view/1%20-%20Dashboards/view/' + nameDashboard + '" target="_blank">' + nameDashboard + '</a></h3><ul>';
    metricsHtml = metricsHtml + auditFolderLine;

    async.eachOfSeries(jobs, function(job, key, callback) {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday = yesterday.toJSON().slice(0, 10);
        var today = new Date().toJSON().slice(0, 10);
        getWarningErrosByJob(yesterday + "T21:00:00", today + "T23:59:59", job, function(metricsHtml_) {
            metricsHtml = metricsHtml + metricsHtml_;
            callback(null, job);
        });
    }, function(err) {
        // Nothing to do
        callbackEnd(metricsHtml)
    });
}


function getWarningErrosByJob(from, to, job, callback) {
    var metricsHtml = "";
    var queryes = { "sort": [{ "@timestamp": "asc" }], "query": { "indices": { "indices": ["<test.executions>"], "query": { "filtered": { "filter": { "bool": { "must": [{ "range": { "@timestamp": { "gte": from, "lte": to } } }, { "range": { "numWarnsAndErrors": { "gt": 0 } } }, { "multi_match": { "query": job, "type": "phrase", "fields": ["testName", "testFullName", "testClassName", "jobName"] } }] } } } }, "no_match_query": "none" } }, "size": 50, "_source": ["buildId", "buildTag", "buildUrl", "clusterName", "tclusterUri", "jobName", "jobUrl", "numWarnsAndErrors", "testMark", "testClassName", "testFullName", "testName", "@timestamp", "testEndTime", "testStartTime"] }

    var options = {
        url: 'http://elasticsearch.kurento.org:9200/_search?scroll=1m&filter_path=_scroll_id,hits.hits._source,hits.hits._type,hits',
        headers: {
            'Content-Type': 'Content-Type: application/json',
            'Accept': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(queryes)
    }

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body)

            var total = data.hits.total;
            if (total > 0) {
                var url = "https://ci.kurento.org/jenkins/view/1%20-%20Folders/job/Development/view/1%20-%20Dashboards/view/Cluster/job/" + job + "/lastSuccessfulBuild/artifact/kurento-cluster/kmscluster-controller/target/report.html";
                var testLine = '<li><font size="3" color="black"><a href="' + url + '" target="_blank">' + job + '</a></font></li>';
                metricsHtml = metricsHtml + testLine;
            }
        } else {
            console.log("Error:", error)
        }
        callback(metricsHtml)
    })
}


module.exports = {
    getStatus: getStatus,
    getMetricsByJob: getMetricsByJob,
    getLastExecution: getLastExecution,
    getStability: getStability
}