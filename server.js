var request = require('request');
var async = require('async');
var minimist = require('minimist');
var fs = require('fs');

// Jobs:
var capabilities = ["agnostic_functional_audit", "webrtc_quality_audit",
    "repository_functional_audit", "recorder_stability_audit", "recorder_s3_functional_audit",
    "recorder_functional_audit", "player_stability_audit", "player_functional_audit",
    "dispatcher_functional_audit", "composite_functional_audit", "capability_stability_audit",
    "capability_functional_audit", "longstability_recorder_s3_audit"
];

var sfu = ["sfu_stability_audit", "sfu_quality_audit", "sfu_functional_recorder_audit",
    "sfu_functional_one2many_chrome_dev_chrome_dev", "sfu_functional_one2many_chrome_chrome"
];

var cluster = ["test_cluster_autoscaling", "test_cluster_cloud", "test_cluster_ha",
    "test_cluster_kurento_client_js", "test_cluster_recorder", "test_cluster_stability",
    "test_cluster_webrtc_cs_presenter", "test_cluster_webrtc_cs_session", "test_cluster_webrtc_cs_viewer",
    "test_cluster_longtermstability"
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

// Update this list when there is new issues or someone been closed
var issues = {
    "https://redmine.kurento.org/redmine/issues/4357": "Check audio. There were more than 2 seconds of silence",
    "https://redmine.kurento.org/redmine/issues/4386": "Timeout of 200 seconds waiting for file",
    "https://redmine.kurento.org/redmine/issues/4383": "Seek fails",
    "https://redmine.kurento.org/redmine/issues/4382": "is not between the bitrate range",
    "https://redmine.kurento.org/redmine/issues/4378": "Not received FLOWING IN event in webRtcEp",
    "https://redmine.kurento.org/redmine/issues/4377": "Not received media",
    "https://redmine.kurento.org/redmine/issues/4369": "The color of the recorded video should be",
    "https://redmine.kurento.org/redmine/issues/4369": "Not received media in the recording",
    "https://redmine.kurento.org/redmine/issues/4340": "Error in play time in the recorded video (expected",
    "https://redmine.kurento.org/redmine/issues/4353": "Not received FLOWING IN event in webRtcEp"
};

var argv = minimist(process.argv.slice(2), {});

var authJenkins = argv.authJenkins;

if (authJenkins == undefined) {
    console.error("Please type: npm start -- --authJenkins=user:jenkinsToken")
    return;
}

var path = "ci.kurento.org/jenkins/job/Development/view/4%20-%20Audit/view/";
var filePath = "/Users/rbenitez/";
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

                    var URI = 'https://' + authJenkins + '@' + path + auditFolder + '/job/' + job + '/lastCompletedBuild/testReport/api/json?pretty=true';

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
                                    var suiteLine = '<li><font size="2" color="black"><a href="https://' + path + auditFolder + '/job/' + job + '/lastCompletedBuild/testReport/' + suiteUrl + '" target="_blank">' + suite.substring(suite.lastIndexOf('.') + 1) + '</a></font>';
                                    var hasRegression = false;
                                    var casesLine = "<ul>";
                                    for (var j = json.suites[i].cases.length - 1; j >= 0; j--) {
                                        if ((json.suites[i].cases[j].status == "REGRESSION") || (json.suites[i].cases[j].status == "FAILED")) {
                                            var issueLine = "";
                                            for (issue in issues) {
                                                if (json.suites[i].cases[j].errorDetails.indexOf(issues[issue]) != -1) {
                                                    issueLine = '<font size="2" color="black">: Issue <a href="' + issue + '" target="_blank">#' + issue.substring(issue.lastIndexOf('/') + 1) + '</a></font>';
                                                    break;
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


// Init

fs.writeFile(filePath + fileName, '<h2>Estado de los Dashboards</h2><font size="2" color="black">Nota: No se está ejecutando ningún test con firefox por el problema eventual que hay entre Selenium 2.53.0 y Firefox 47. Estamos esperando a la versión 2.53.1 de Selenium</font>', function(err) {
    if (err) {
        return console.log(err);
    }
});

//getStatus(cluster, "Cluster", function() {});
getStatus(datachannels, "Datachannels", function() {
    getStatus(sfu, "SFU", function() {
        getStatus(capabilities, "Capabilities", function() {
            getStatus(ice, "WebRtc", function() {
                getStatus(cluster, "Cluster", function() {
                    fs.appendFile(filePath + fileName, '<h2>Estabilidad VS Issues</h2>', function(err) {
                        if (err) {
                            return console.log(err);
                        }
                        getStability(datachannels, "Datachannels", function() {
                            getStability(sfu, "SFU", function() {
                                getStability(capabilities, "Capabilities", function() {
                                    getStability(ice, "WebRtc", function() {
                                        getStability(cluster, "Cluster", function() {
                                        	console.log("Report created at: ", filePath + fileName);
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