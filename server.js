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
var minimist = require('minimist');
var fs = require('fs');
var sleep = require('sleep');
var Trello = require("node-trello");
var t = new Trello("7d4cd779f4ff430c4dfb3c1bccb437cd", "16fbb7dd9a3b2b7fa8b6a71eaf4657c2600348cd64b35fa57c30e6e52c38834f");

// Jobs:
var capabilities = ["agnostic_functional_audit", "composite_functional_audit",
    "dispatcher_functional_audit", "kurento_api_client_java_W_audit",
    "kurento_api_client_js_W_browser_audit", "kurento_api_client_js_W_node_0_12_audit",
    "kurento_api_client_js_W_node_4_x_audit", "kurento_api_client_js_W_node_5_x_audit",
    "kurento_api_client_js_W_node_6_x_audit", "kurento_api_client_js_W_node_restart_audit",
    "kurento_api_modules_js_W_node_0_12_audit", "kurento_api_modules_js_W_node_4_x_audit",
    "kurento_api_modules_js_W_node_5_x_audit", "kurento_api_protocol_java_audit",
    "kurento_api_repository_java_audit", "kurento_room_audit", "kurento_tutorial_java_audit",
    "kurento_tutorial_java_fiware", "longstability_recorder_s3_audit", "player_functional_audit",
    "player_stability_audit", "recorder_functional_audit", "recorder_s3_functional_audit",
    "recorder_stability_audit", "repository_functional_audit", "longstability_check_memory_audit", "pipeline_stability_audit"
];

var sfu = ["sfu_stability_audit", "sfu_quality_audit", "sfu_functional_recorder_audit",
    "sfu_functional_one2many_chrome_beta_chrome_beta", "sfu_functional_one2many_chrome_dev_chrome_dev", "sfu_functional_one2many_chrome_chrome"
];

var cluster = ["test_cluster_autoscaling", "test_cluster_cloud", "test_cluster_ha", "test_cluster_kurento_client_js",
    "test_cluster_longtermstability", "test_cluster_recorder", "test_cluster_stability", "test_cluster_webrtc_cs_presenter",
    "test_cluster_webrtc_cs_session", "test_cluster_webrtc_cs_viewer", "test_cluster_webrtc_cs_viewer_chrome_beta"
];

var ice = ["ice_ipv4_cluster_udp_reflexive_chrome_dev", "ice_ipv4_cluster_udp_reflexive_chrome_beta", "ice_ipv4_cluster_udp_reflexive_chrome",
    "ice_ipv4_cluster_tcp_reflexive_chrome_dev", "ice_ipv4_cluster_tcp_reflexive_chrome_beta", "ice_ipv4_cluster_tcp_reflexive_chrome", "webrtc_cs_viewer_audit",
    "webrtc_stability_audit", "webrtc_functional_chrome_dev_audit", "webrtc_functional_chrome_beta_audit", "webrtc_functional_audit", "webrtc_cs_session_chrome_dev_audit",
    "webrtc_cs_session_chrome_beta_audit", "webrtc_cs_session_audit", "webrtc_cs_presenter_audit", "webrtc_cs_fake_audit", "ice_ipv6_host_kms_bridge_selenium_bridge_udp_chrome_dev",
    "ice_ipv6_host_kms_bridge_selenium_bridge_udp_chrome_beta", "ice_ipv6_host_kms_bridge_selenium_bridge_udp_chrome", "ice_ipv4_reflexive_kms_dnat_selenium_dnat_udp_chrome_dev",
    "ice_ipv4_reflexive_kms_dnat_selenium_dnat_udp_chrome_beta", "ice_ipv4_reflexive_kms_dnat_selenium_dnat_udp_chrome", "ice_ipv4_reflexive_kms_dnat_selenium_dnat_tcp_chrome_dev",
    "ice_ipv4_reflexive_kms_dnat_selenium_dnat_tcp_chrome_beta", "ice_ipv4_reflexive_kms_dnat_selenium_dnat_tcp_chrome", "ice_ipv4_reflexive_kms_dnat_selenium_bridge_udp_chrome_dev",
    "ice_ipv4_reflexive_kms_dnat_selenium_bridge_udp_chrome_beta", "ice_ipv4_reflexive_kms_dnat_selenium_bridge_udp_chrome", "ice_ipv4_reflexive_kms_dnat_selenium_bridge_tcp_chrome_dev",
    "ice_ipv4_reflexive_kms_dnat_selenium_bridge_tcp_chrome_beta", "ice_ipv4_reflexive_kms_dnat_selenium_bridge_tcp_chrome", "ice_ipv4_reflexive_kms_bridge_selenium_dnat_udp_chrome_dev",
    "ice_ipv4_reflexive_kms_bridge_selenium_dnat_udp_chrome_beta", "ice_ipv4_reflexive_kms_bridge_selenium_dnat_udp_chrome", "ice_ipv4_reflexive_kms_bridge_selenium_dnat_tcp_chrome_dev",
    "ice_ipv4_reflexive_kms_bridge_selenium_dnat_tcp_chrome_beta", "ice_ipv4_reflexive_kms_bridge_selenium_dnat_tcp_chrome", "ice_ipv4_kms_relay_kms_dnat_selenium_dnat_tcp_chrome_dev",
    "ice_ipv4_kms_relay_kms_dnat_selenium_dnat_tcp_chrome_beta", "ice_ipv4_kms_relay_kms_dnat_selenium_dnat_tcp_chrome", "ice_ipv4_host_kms_bridge_selenium_bridge_udp_chrome_dev",
    "ice_ipv4_host_kms_bridge_selenium_bridge_udp_chrome_beta", "ice_ipv4_host_kms_bridge_selenium_bridge_udp_chrome", "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_udp_chrome_dev",
    "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_udp_chrome_beta", "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_udp_chrome", "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_tcp_chrome_dev",
    "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_tcp_chrome_beta", "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_tcp_chrome"
];

var datachannels = ["datachannel_functional_chrome_dev_chrome_dev", "datachannel_functional_chrome_beta_chrome_beta", "datachannel_functional_chrome_chrome"];

var issuesRedmine = new Array();

var argv = minimist(process.argv.slice(2), {});

var authJenkins = argv.authJenkins;
var authRedmine = argv.authRedmine;

if (authJenkins == undefined || authRedmine == undefined) {
    console.error("Please type: npm start -- --authJenkins=user:jenkinsToken --authRedmine=user:password")
    return;
}

var path = "ci.kurento.org/jenkins/job/Development/view/4%20-%20Audit/view/";
var filePath = "./";
var fileName = "jenkinsReport.html";

function getStatus(jobs, auditFolder, callbackEnd) {

    var nameDashboard = auditFolder;
    if (auditFolder == "Capabilities") {
        nameDashboard = "Kurento";
    } else if (auditFolder == "WebRtc") {
        nameDashboard = "WebRTC"
    }

    var auditFolderLine = '<h3><a href="https://ci.kurento.org/jenkins/job/Development/view/1%20-%20Dashboards/view/' + nameDashboard + '" target="_blank">' + nameDashboard + '</a></h3><ul>';
    fs.appendFile(filePath + fileName, auditFolderLine, function(err) {
        if (err) {
            return console.log(err);
        }
    });

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
                                var jobLine = '<li><font size="2" color="black"><a href="https://' + path + auditFolder + '/job/' + job + '" target="_blank">' + job + '</a></font></li><ul>';
                                var line = "";
                                line = line + jobLine;
                                for (var i = 0; i < json.suites.length; i++) {
                                    var suite = json.suites[i].name;
                                    var pos = suite.lastIndexOf(".");
                                    var suiteUrl = suite.substring(0, pos) + '/' + suite.substring(pos + 1);
                                    var suiteLine = '<li><font size="2" color="black"><a href="https://' + path + auditFolder + '/job/' + job + '/lastBuild/testReport/' + suiteUrl + '" target="_blank">' + suite.substring(suite.lastIndexOf('.') + 1) + '</a></font>';
                                    var hasRegression = false;
                                    var casesLine = "<ul>";
                                    for (var j = json.suites[i].cases.length - 1; j >= 0; j--) {
                                        if ((json.suites[i].cases[j].status == "REGRESSION") || (json.suites[i].cases[j].status == "FAILED")) {
                                            var issueLine = "";
                                            for (issue in issuesRedmine) {
                                                var message = issuesRedmine[issue].description.split("****")
                                                if (message.length > 0) {
                                                    //https://redmine.kurento.org/redmine/issues/' + issuesRedmine[issue].id
                                                    var existMessage = false;
                                                    for (var m = message.length - 1; m >= 0; m--) {
                                                        if ((message[m] != '' && message[m] != '\n') && json.suites[i].cases[j].errorDetails.indexOf(message[m]) != -1) {
                                                            existMessage = true;
                                                        }
                                                    };
                                                    if ((issuesRedmine[issue].description.indexOf(job) != -1) && existMessage) {
                                                        issueLine = '<ul><li><font size="2" color="black">' + issuesRedmine[issue].descriptionHtml + '</font></ul></li>';
                                                        break;
                                                    }
                                                }
                                            }
                                            hasRegression = true;
                                            casesLine = casesLine + '<li><font size="2" color="black">' + json.suites[i].cases[j].name + ' ' + issueLine + '</font></li>';
                                        }
                                    };

                                    casesLine = casesLine + "</ul>";

                                    if (hasRegression) {
                                        suiteLine = suiteLine + casesLine;
                                        line = line + suiteLine + "</li>";
                                    }
                                };

                                fs.appendFile(filePath + fileName, line + "</ul>", function(err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                });

                            }
                        } else {
                            var jobLine = '<li><font size="2" color="black"><a href="https://' + path + auditFolder + '/job/' + job + '" target="_blank">' + job + '</a></font></li><ul><li><font size="2" color="black">No está la página de reporte. El job no ha terminado correctamente.</font></li></ul>';
                            fs.appendFile(filePath + fileName, jobLine, function(err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });
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
        // Nothing to do
        fs.appendFile(filePath + fileName, "</ul></ul>", function(err) {
            if (err) {
                return console.log(err);
            }
            callbackEnd();
        });
    });

}

function getStability(jobs, auditFolder, callbackEnd) {

    var nameDashboard = auditFolder;
    if (auditFolder == "Capabilities") {
        nameDashboard = "Kurento";
    } else if (auditFolder == "WebRtc") {
        nameDashboard = "WebRTC"
    }

    var auditFolderLine = '<h3><a href="https://ci.kurento.org/jenkins/job/Development/view/4%20-%20Audit/view/' + auditFolder + '" target="_blank">' + nameDashboard + '</a></h3><ul>';
    fs.appendFile(filePath + fileName, auditFolderLine, function(err) {
        if (err) {
            return console.log(err);
        }
    });
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
            jobLine = jobLine + '<li><font size="2" color="black">Estabilidad: ' + score + '%  <a href="https://' + path + auditFolder + '/job/' + job + '" target="_blank">' + job + '</a></font></li>';
            jobLine = jobLine + '<ul>';
            for (issue in issuesRedmine) {
                if (issuesRedmine[issue].description.indexOf(job) != -1) {
                    jobLine = jobLine + '<li><font size="2" color="black">' + issuesRedmine[issue].descriptionHtml + '</font></li>';
                }
            }
            jobLine = jobLine + '</ul>';
        }
        jobLine = jobLine + "</ul>";
        fs.appendFile(filePath + fileName, "" + jobLine + "", function(err) {
            if (err) {
                return console.log(err);
            }
            callbackEnd();
        });
    });
}

function getLastExecution(jobs, auditFolder, callbackEnd) {
    var nameDashboard = auditFolder;
    if (auditFolder == "Capabilities") {
        nameDashboard = "Kurento";
    } else if (auditFolder == "WebRtc") {
        nameDashboard = "WebRTC"
    }

    var auditFolderLine = '<h3><a href="https://ci.kurento.org/jenkins/job/Development/view/4%20-%20Audit/view/' + auditFolder + '" target="_blank">' + nameDashboard + '</a></h3><ul>';
    fs.appendFile(filePath + fileName, auditFolderLine, function(err) {
        if (err) {
            return console.log(err);
        }
    });
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
                                var jobLine = '<li><font size="2" color="black">Última ejecución: ' + lastExecution + ' horas  <a href="https://' + path + auditFolder + '/job/' + job + '" target="_blank">' + job + '</a></font></li>';
                                jobLine = jobLine + '<ul>';
                                jobLine = jobLine + '</ul>';
                                fs.appendFile(filePath + fileName, "" + jobLine + "", function(err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    callback();
                                });
                            } else {
                                callback();
                            }
                        }
                    })
                }
            ],
            // optional callback
            function(err, results) {
                callback();
            });
    }, function(err) {
        fs.appendFile(filePath + fileName, "</ul>", function(err) {
            if (err) {
                return console.log(err);
            }
            callbackEnd();
        });
    });
}


function getIssuesRedmine(callback) {
    var issuesList = new Array();
    var URI = 'https://' + authRedmine + '@redmine.kurento.org/redmine/projects/kurento-media-server/issues.json?status_id=*&limit=3000';

    var options = {
        url: URI,
        headers: {
            'Content-Type': 'Content-Type: application/json',
            'Accept': 'application/json'
        },
        strictSSL: false,
        method: 'GET'
    }

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            var issues = json.issues;
            for (var i = issues.length - 1; i >= 0; i--) {
                var issue = issues[i];
                var status = issue.status.name;
                var url = 'https://redmine.kurento.org/redmine/issues/' + issue.id;
                var descriptionHtml = '<b>Redmine; </b><b>Issue:</b> (' + issue.subject + '; <a href="' + url + '" target="_blank">#' + issue.id + '</a>); <b>Status:</b> ' + status
                if (issue.status.name == 'Closed' || issue.status.name == 'Resolved') {
                    status = status + " " + issue.updated_on.split('T')[0];
                    descriptionHtml = '<strike style="color:red"><span style="color:black">' + descriptionHtml + ' - ' + issue.updated_on.split('T')[0] + '</span></strike>';
                }
                var oneIssue = {
                    subject: issue.subject,
                    status: status,
                    id: issue.id,
                    description: issue.description,
                    url: url,
                    descriptionHtml: descriptionHtml
                };
                issuesList.push(oneIssue);
            };

        }
        callback(issuesList)
    })
}

// Init
fs.writeFile(filePath + fileName, '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <font size="2" color="black">Nota: No se está ejecutando ningún test con firefox por el problema eventual que hay entre Selenium 2.53.0 y Firefox 47. Estamos esperando a la versión 2.53.1 de Selenium</font>', 'utf8', function(err) {
    if (err) {
        return console.log(err);
    }
});


/*t.get("/1/members/me", function(err, data) {
  if (err) throw err;
  console.log(data);
});*/


// 566562180f0520308b696468 - https://trello.com/b/rF2FksBo/devops-ci-dashboard
// 55e06936c58d0dd41677730a - https://trello.com/b/ZU9T2a1w/apps-apis-dashboard
// 55e04479402e09ba324dd485 - https://trello.com/b/MgCVSBM8/media-server-backlog
// 55dff5a0d6fef7a4d0dfe641 - dhttps://trello.com/b/Y8zbXJOS/mediaserver-dashboard

/*t.get("/1/boards/55e06936c58d0dd41677730a?lists=open&list_fields=name&fields=name,desc", function(err, data) {
    if (err) throw err;
    console.log("55e06936c58d0dd41677730a", data);
});
*/
// 1/boards/55e06936c58d0dd41677730a?lists=open&list_fields=name&fields=name,desc
// Get list of issues
// 1/list/56bda041476abe11e0d54a59?fields=name&cards=open&card_fields=name

// Get information for each issue
// 1/cards/574c4c8d7b89d05856356f37/actions
// Get column for each board
//https://api.trello.com/1/boards/55e04479402e09ba324dd485/lists

var count = 0;

function getIssueTrelloById(id, dashboard, columnName, callback_) {
    t.get("1/list/" + id, { fields: "name", cards: "open", card_fields: "name" }, function(err, data) {
        if (err) throw err;
        async.eachOfSeries(data.cards, function(job, undefined, callback) {
            count++
            if (count == 60) {
                sleep.sleep(20);
                count = 0;
            }
            async.parallel([
                    function(callback) {
                        t.get("/1/cards/" + job.id, function(err, card) {
                            var url = card.shortUrl;
                            t.get("/1/cards/" + job.id + "/actions", function(err, infoCard) {
                                var description = "";
                                var subject = job.name;
                                var id = job.id;
                                for (elem in infoCard) {
                                    //console.log(infoCard[elem])
                                    if (infoCard[elem].type == "commentCard") {
                                        description = description + " " + infoCard[elem].data.text;
                                    }
                                }
                                var descriptionHtml = '<b>Dashboard:</b> ' + dashboard + '; <b>Issue:</b> (' + subject + '; <a href="' + url + '" target="_blank">#' + id + '</a>); <b>Status:</b> ' + columnName

                                if ((columnName.indexOf('Completada') != -1) || (columnName.indexOf('Complete') != -1)) {
                                    descriptionHtml = '<strike style="color:red"><span style="color:black">' + descriptionHtml + '</span></strike>';
                                }
                                var oneIssue = {
                                    subject: subject,
                                    status: columnName,
                                    id: id,
                                    description: description,
                                    url: url,
                                    descriptionHtml: descriptionHtml
                                };
                                issuesRedmine.push(oneIssue);
                                callback(oneIssue)
                            });
                        });
                    }
                ],
                // optional callback
                function(err, results) {
                    callback();
                });
        }, function(err) {
            callback_()
        });
    });
}

function getIssueTrello(callback) {

    var dashboards = {
        "566562180f0520308b696468": "DevOps & CI Dashboard",
        "55e06936c58d0dd41677730a": "Apps, APIs Dashboard",
        "55dff5a0d6fef7a4d0dfe641": "MediaServer Dashboard"
    };
    async.eachOfSeries(dashboards, function(value, key, callback_) {
        t.get("1/boards/" + key + "/lists", function(err, data) {
            if (err) throw err;
            var dashboard = value;
            async.eachOfSeries(data, function(column, undefined, callback__) {
                if (count == 60) {
                    sleep.sleep(12)
                    count = 0;
                }
                count++;
                getIssueTrelloById(column.id, dashboard, column.name, callback__)
            }, function(err) {
                callback_()
            });
        })
    }, function(err) {
        callback()
    });
}

function getMetricsByJob(jobs, auditFolder, callbackEnd) {

    var nameDashboard = auditFolder;
    if (auditFolder == "Capabilities") {
        nameDashboard = "Kurento";
    } else if (auditFolder == "WebRtc") {
        nameDashboard = "WebRTC"
    }

    var auditFolderLine = '<h3><a href="https://ci.kurento.org/jenkins/job/Development/view/1%20-%20Dashboards/view/' + nameDashboard + '" target="_blank">' + nameDashboard + '</a></h3><ul>';
    fs.appendFile(filePath + fileName, auditFolderLine, function(err) {
        if (err) {
            return console.log(err);
        }
    });

    async.eachOfSeries(jobs, function(job, key, callback) {
        var today = new Date().toJSON().slice(0, 10);
        getWarningErrosByJob(today + "T00:00:00", today + "T23:59:59", job, function() {
            callback(null, job);
        });
    }, function(err) {
        // Nothing to do
        callbackEnd()
    });
}


function getWarningErrosByJob(from, to, job, callback) {
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
                var testLine = '<li><font size="2" color="black"><a href="' + url + '" target="_blank">' + job + '</a></font></li>';

                fs.appendFile(filePath + fileName, testLine, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        } else {
            console.log("Error:", error)
        }
        callback()
    })
}

console.log("Getting Redmine issues ...");
getIssuesRedmine(function(issues) {
    issuesRedmine = issues;
    console.log("Getting Trello issues ...");
    getIssueTrello(function(issues_) {
        fs.appendFile(filePath + fileName, '<h2>Última ejecución:</h2>', function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("Processing Datachannels Last Execution ...")
            getLastExecution(datachannels, "Datachannels", function() {
                console.log("Processing SFU Last Execution ...")
                getLastExecution(sfu, "SFU", function() {
                    console.log("Processing Capabilities Last Execution ...")
                    getLastExecution(capabilities, "Capabilities", function() {
                        console.log("Processing WebRtc Last Execution ...")
                        getLastExecution(ice, "WebRtc", function() {
                            console.log("Processing Cluster Last Execution ...")
                            getLastExecution(cluster, "Cluster", function() {
                                fs.appendFile(filePath + fileName, '<h2> Estado de los Dashboards </h2>', function(err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    console.log("Processing Datachannels Dashboard ...")
                                    getStatus(datachannels, "Datachannels", function() {
                                        console.log("Processing SFU Dashboard ...");
                                        getStatus(sfu, "SFU", function() {
                                            console.log("Processing Kurento Dashboard ...");
                                            getStatus(capabilities, "Capabilities", function() {
                                                console.log("Processing WebRtc Dashboard ...");
                                                getStatus(ice, "WebRtc", function() {
                                                    console.log("Processing Cluster Dashboard ...")
                                                    getStatus(cluster, "Cluster", function() {
                                                        fs.appendFile(filePath + fileName, '<h2>Estabilidad VS Issues</h2>', function(err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                            console.log("Processing Datachannels Stability ...")
                                                            getStability(datachannels, "Datachannels", function() {
                                                                console.log("Processing SFU Stability ...")
                                                                getStability(sfu, "SFU", function() {
                                                                    console.log("Processing Kurento Stability ...")
                                                                    getStability(capabilities, "Capabilities", function() {
                                                                        console.log("Processing WebRtc Stability ...")
                                                                        getStability(ice, "WebRtc", function() {
                                                                            console.log("Processing Cluster Stability ...")
                                                                            getStability(cluster, "Cluster", function() {
                                                                                console.log("Getting Warning/Error from Cluster ...");
                                                                                fs.appendFile(filePath + fileName, '<h2>Warnings/Errors</h2>', function(err) {
                                                                                    if (err) {
                                                                                        return console.log(err);
                                                                                    }
                                                                                    getMetricsByJob(cluster, "Cluster", function() {
                                                                                        console.log("Report created at: ", filePath + fileName);
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        });
                    })
                })
            })
        })
    })
})