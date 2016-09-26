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
    "sfu_functional_one2many_chrome_beta_firefox", "sfu_functional_one2many_chrome_chrome",
    "sfu_functional_one2many_chrome_dev_chrome_dev", "sfu_functional_one2many_chrome_dev_firefox",
    "sfu_functional_one2many_chrome_firefox",
    "sfu_functional_one2many_firefox_chrome",
    "sfu_functional_one2many_firefox_chrome_dev", "sfu_functional_one2many_firefox_firefox",
    "sfu_functional_one2many_chrome_beta_chrome_beta", "sfu_functional_one2many_firefox_chrome_beta"
];
//   "sfu_functional_one2many_firefox_beta_chrome_beta", "sfu_functional_one2many_firefox_beta_firefox_beta",
//   "sfu_functional_one2many_firefox_beta_chrome", "sfu_functional_one2many_firefox_beta_chrome_dev",
//   "sfu_functional_one2many_chrome_beta_firefox_beta", "sfu_functional_one2many_chrome_dev_firefox_beta", "sfu_functional_one2many_chrome_firefox_beta"

//];

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
    "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_tcp_chrome_beta", "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_tcp_chrome",
    "ice_ipv6_host_kms_bridge_selenium_bridge_udp_firefox", "ice_ipv4_reflexive_kms_dnat_selenium_dnat_udp_firefox",
    "ice_ipv4_reflexive_kms_dnat_selenium_bridge_udp_firefox", "ice_ipv4_reflexive_kms_bridge_selenium_dnat_udp_firefox", "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_udp_firefox",
    "ice_ipv4_host_kms_bridge_selenium_bridge_udp_firefox"
];
//    "ice_ipv4_host_kms_bridge_selenium_bridge_udp_firefox_beta", "ice_ipv6_host_kms_bridge_selenium_bridge_udp_firefox_beta",
//    "ice_ipv4_browser_relay_kms_dnat_selenium_dnat_udp_firefox_beta", "webrtc_functional_firefox_beta_audit",
//    "ice_ipv4_reflexive_kms_dnat_selenium_dnat_udp_firefox_beta", "ice_ipv4_reflexive_kms_dnat_selenium_bridge_udp_firefox_beta", "ice_ipv4_reflexive_kms_bridge_selenium_dnat_udp_firefox_beta"
//];

var datachannels = ["datachannel_functional_chrome_chrome", "datachannel_functional_chrome_firefox",
    "datachannel_functional_chrome_beta_chrome_beta", "datachannel_functional_chrome_beta_firefox",
    "datachannel_functional_chrome_dev_chrome_dev", "datachannel_functional_chrome_dev_firefox",
    "datachannel_functional_firefox_firefox", "datachannel_functional_firefox_chrome", "datachannel_functional_firefox_chrome_beta"
];
//"datachannel_functional_firefox_chrome_dev", "datachannel_functional_firefox_beta_firefox_beta",
//"datachannel_functional_firefox_beta_chrome", "datachannel_functional_firefox_beta_chrome_beta",
//"datachannel_functional_firefox_beta_chrome_dev", "datachannel_functional_chrome_firefox_beta",
//"datachannel_functional_chrome_beta_firefox_beta", "datachannel_functional_chrome_dev_firefox_beta"
//];

var mergedMediaServerXenial = ["kms_backgroundextractor_merged_xenial",
    "kms_chroma_merged_xenial",
    "kms_cmake_utils_merged_xenial",
    "kms_core_merged_xenial",
    "kms_crowddetector_merged_xenial",
    "kms_datachannelexample_merged_xenial",
    "kms_elements_merged_xenial",
    "kms_facesegmentator_merged_xenial",
    "kms_filters_merged_xenial",
    "kms_jsonrpc_merged_xenial",
    "kms_marker_detector_merged_xenial",
    "kms_platedetector_merged_xenial",
    "kms_pointerdetector_merged_xenial",
    "kms_s3_merged_xenial",
    "kms_sfu_merged_xenial",
    "kurento_media_server_merged_xenial",
    "kurento_module_creator_merged_xenial"
];

var mergedMediaServerTrusty = ["kms_backgroundextractor_merged",
    "kms_chroma_merged",
    "kms_cmake_utils_merged",
    "kms_core_merged",
    "kms_crowddetector_merged",
    "kms_datachannelexample_merged",
    "kms_elements_merged",
    "kms_facesegmentator_merged",
    "kms_fec_merged",
    "kms_filters_merged",
    "kms_gstreamer_marshall_merged",
    "kms_jsonrpc_merged",
    "kms_marker_detector_merged",
    "kms_platedetector_merged",
    //"kms_plumberendpoint_merged",
    "kms_pointerdetector_merged",
    "kms_profiling_merged",
    //  "kms_recorder_merged",
    "kms_s3_merged",
    "kms_sfu_merged",
    "kurento_maven_plugin_merged",
    "kurento_media_server_merged",
    "kurento_module_creator_merged"
];

var mergedJavaJs = ["kurento_appsession_merged",
    "kurento_client_core_js_merged",
    "kurento_client_elements_js_merged",
    "kurento_client_filters_js_merged",
    "kurento_client_js_merged",
    "kurento_demo_js_merged",
    "kurento_demo_merged",
    "kurento_demo_node_merged",
    "kurento_developer_portal_merged",
    "kurento_java_merged",
    "kurento_jsonrpc_js_merged",
    "kurento_module_backgroundextractor_js_merged",
    "kurento_module_chroma_js_merged",
    "kurento_module_crowddetector_js_merged",
    "kurento_module_datachannelexample_js_merged",
    "kurento_module_facesegmentator_js_merged",
    "kurento_module_markerdetector_js_merged",
    "kurento_module_platedetector_js_merged",
    "kurento_module_plumberendpoint_js_merged",
    "kurento_module_pointerdetector_js_merged",
    "kurento_module_selectablemixer_js_merged",
    "kurento_module_sfu_js_merged",
    "kurento_nubomedia_tutorial_merged",
    "kurento_qa_pom_merged",
    "kurento_room_merged",
    "kurento_sfu_merged",
    "kurento_tree_merged",
    "kurento_tutorial_java_merged",
    "kurento_tutorial_java_merged",
    "kurento_tutorial_js_merged",
    "kurento_tutorial_node_merged",
    "kurento_tutorial_test_merged",
    "kurento_utils_js_merged",
    "sdp_translator_js_merged"
];

module.exports = {
    capabilities: capabilities,
    sfu: sfu,
    cluster: cluster,
    datachannels: datachannels,
    ice: ice,
    mergedJavaJs: mergedJavaJs,
    mergedMediaServerTrusty: mergedMediaServerTrusty,
    mergedMediaServerXenial: mergedMediaServerXenial
}