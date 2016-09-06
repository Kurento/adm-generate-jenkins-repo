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
var Trello = require("node-trello");
var t = new Trello("7d4cd779f4ff430c4dfb3c1bccb437cd", "16fbb7dd9a3b2b7fa8b6a71eaf4657c2600348cd64b35fa57c30e6e52c38834f");

var jobs = require('./js/jobs');
var issues = require('./js/issues');
var utils = require('./js/utils');

var argv = minimist(process.argv.slice(2), {});

var authJenkins = argv.authJenkins;
var authRedmine = argv.authRedmine;

if (authJenkins == undefined || authRedmine == undefined) {
    console.error("Please type: npm start -- --authJenkins=user:jenkinsToken --authRedmine=user:password")
    return;
}

var allIssues = new Array();
var filePath = "./";
var fileName = "jenkinsReport.html";




var dashboards = [{
    name: "Datachannels",
    jobs: jobs.datachannels
}, {
    name: "SFU",
    jobs: jobs.sfu
}, {
    name: "Capabilities",
    jobs: jobs.capabilities
}, {
    name: "WebRtc",
    jobs: jobs.ice
}, {
    name: "Cluster",
    jobs: jobs.cluster
}];

// First message
var reportHtml = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <font size="3" color="black">Nota: En el dashboard de Kurento todavía no se está usando Firefox, porque hay que adaptar las estadísticas a cómo se obtienen desde Firefox y hay un detalle con el currentTime de Firefox que hay que averiguar si es problema de Firefox o nuestro.</font>';

async.series([
        function(callback) {
            // Get All Issues (Redmine/Trello)
            issues.getAllIssues(authRedmine, t, function(allIssues_) {
                allIssues = allIssues_;
                callback();
            })
        },
        function(callback) {
            reportHtml = reportHtml + '<h2>Última ejecución:</h2>';
            // Get Last Execution
            async.eachOfSeries(dashboards, function(dashboard, key, callback) {
                console.log("Processing last execution for ", dashboard.name, " ...")
                utils.getLastExecution(dashboard.jobs, dashboard.name, authJenkins, function(html) {
                    reportHtml = reportHtml + html;
                    callback(null);
                })
            }, function() {
                callback(null)
            });

        },
        function(callback) {
            reportHtml = reportHtml + '<h2> Estado de los Dashboards </h2>';
            // Get Status
            async.eachOfSeries(dashboards, function(dashboard, key, callback) {
                console.log("Processing status for ", dashboard.name, " ...")
                utils.getStatus(dashboard.jobs, dashboard.name, authJenkins, allIssues, function(html) {
                    reportHtml = reportHtml + html;
                    callback(null);
                })
            }, function() {
                callback(null);
            });
        },
        function(callback) {
            reportHtml = reportHtml + '<h2>Estabilidad VS Issues</h2>';
            // Get Stability
            async.eachOfSeries(dashboards, function(dashboard, key, callback) {
                console.log("Processing stability for ", dashboard.name, " ...")
                utils.getStability(dashboard.jobs, dashboard.name, authJenkins, allIssues, function(html) {
                    reportHtml = reportHtml + html;
                    callback(null);
                })
            }, function() {
                callback(null);
            });
        },
        function(callback) {
            reportHtml = reportHtml + '<h2>Warnings/Errors</h2>';
            // Get Stability
            console.log("Processing metrics for Cluster ...")
            utils.getMetricsByJob(jobs.cluster, "Cluster", function(html) {
                reportHtml = reportHtml + html;
                callback(null);
            })
        }
    ],
    // optional callback
    function(err, results) {
        console.log("Report created at: ", filePath + fileName);
        fs.writeFile(filePath + fileName, reportHtml, 'utf8', function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });