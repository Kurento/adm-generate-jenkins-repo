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
var sleep = require('sleep');

var issuesRedmine = new Array();

// Issues of Remine
function getIssuesRedmine(authRedmine, callback) {
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

// Issues of Trello

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

function getIssueTrelloById(t, id, dashboard, columnName, callback_) {
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

function getIssueTrello(trello, callback) {

    var dashboards = {
        "566562180f0520308b696468": "DevOps & CI Dashboard",
        "55e06936c58d0dd41677730a": "Apps, APIs Dashboard",
        "55dff5a0d6fef7a4d0dfe641": "MediaServer Dashboard"
    };
    async.eachOfSeries(dashboards, function(value, key, callback_) {
        trello.get("1/boards/" + key + "/lists", function(err, data) {
            if (err) throw err;
            var dashboard = value;
            async.eachOfSeries(data, function(column, undefined, callback__) {
                if (count == 60) {
                    sleep.sleep(12)
                    count = 0;
                }
                count++;
                getIssueTrelloById(trello, column.id, dashboard, column.name, callback__)
            }, function(err) {
                callback_()
            });
        })
    }, function(err) {
        callback()
    });
}

function getAllIssues(authRedmine, trello, callback) {
	console.log("Getting Redmine issues ...");
    getIssuesRedmine(authRedmine, function(issues) {
        issuesRedmine = issues;
        console.log("Getting Trello issues ...");
        getIssueTrello(trello, function(issues_) {
        	callback(issues);
        });
    });
}


module.exports = {
    getAllIssues: getAllIssues
}