/*
 * This file is part of the Flupque software
 *
 * Copyright (c) 2008 Roopesh Chander <roop@forwardbias.in>
 *
 * This library is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License (GPL), version 2
 * only.  This library is distributed WITHOUT ANY WARRANTY, whether
 * express or implied. See the GNU GPL for more details.
 * http://www.gnu.org/licenses/gpl.html
 *
 */

var flickrApiKey = '20aa0424d0d816a1ef0af58678670bd4';

var flickr_api = {
    data: {
        frob: '',
        token: '',
        user: {
            nsid: '',
            username: '',
            fullname: '',
            ispro: '',
            buddyicon_url: '',
            photosurl: '',
            profileurl: ''
        },
    },

    login: function() {
        if (flickr_api.data.token == '' || flickr_api.data.user.nsid == '') {
            flickr_api.data.token = window.fluSettings.valueString("flickr/token", '');
            flickr_api.data.user.nsid = window.fluSettings.valueString("flickr/nsid", '');
        }
        if (flickr_api.data.user.buddyicon_url == '') {
            flickr_api.json.userinfo.get();
            return; // dont worry, we'll get a callback eventually
        }
        flickr_api.show_user_info();
        window.fluSettings.setValue("flickr/nsid", flickr_api.data.user.nsid);
        window.fluSettings.setValue("flickr/token", flickr_api.data.token);
    },

    autologin: function() {
        flickr_api.data.token = window.fluSettings.valueString("flickr/token", '');
        flickr_api.data.user.nsid = window.fluSettings.valueString("flickr/nsid", '');
        if (flickr_api.data.user.buddyicon_url == '') {
            flickr_api.json.userinfo.get();
            return; // dont worry, it'll call login() eventually
        }
        flickr_api.show_user_info();
    },

    show_user_info: function() {
        document.getElementById('buddyicon').src = flickr_api.data.user.buddyicon_url;
        if (parseInt(flickr_api.data.user.ispro) == 1)
            document.getElementById('photostream_pro').style.display = 'inline';
        else
            document.getElementById('photostream_pro').style.display = 'none';
        flickr_api.show_username();
    },

    show_username: function() {
        var name = flickr_api.data.user.fullname;
        var msg_txt = "You're working offline";
        if (flickr_api.data.user.username != '')
            msg_txt = "You are " + name;
        var user_elem = document.getElementById("username");
        user_elem.removeChild(user_elem.firstChild);
        var username_text = document.createTextNode(msg_txt);
        user_elem.appendChild(username_text);
    },

    json: {

        frob: {
            get: function() {
                var flickr_request = document.createElement('script');
                flickr_request.type = 'text/javascript';
                flickr_request.id = 'get_frob_js';
                flickr_request.src = create_signed_url('http://www.flickr.com/services/rest/',
                                                        {
                                                           format: "json",
                                                           jsoncallback: "flickr_api.json.frob.callback",
                                                           method: "flickr.auth.getFrob",
                                                           api_key: flickrApiKey
                                                        });
                document.getElementById('flickr_json_requests_container').appendChild(flickr_request);
            },
            callback: function (rsp) {
                if (rsp.stat != "ok") {
                    alert("Error getting frob");
                    return;
                }
                flickr_api.data.frob = rsp.frob._content;
                var js = document.getElementById('get_frob_js');
                js.parentNode.removeChild(js);
                var user_authorization_url = create_signed_url(
                                  "http://www.flickr.com/services/auth/",
                                  {
                                     frob: flickr_api.data.frob,
                                     api_key: flickrApiKey,
                                     perms: "write"
                                  });
                window.fluFlickrWebPage.setUrlString(user_authorization_url);
                window.fluFlickrWebPage.show();
                setTimeout("flickr_api.json.token.get()", 20000); // check if user has authorized after 20 secs
            }
        },

        token: {
            get: function() {
                if (flickr_api.data.frob == '') {
                    flickr_api.json.frob.get();
                    return; // dont worry, we'll get a callback eventually
                }

                var flickr_request = document.createElement('script');
                flickr_request.type = 'text/javascript';
                flickr_request.id = 'get_token_js';
                flickr_request.src = create_signed_url('http://www.flickr.com/services/rest/',
                                                        {
                                                           format: "json",
                                                           jsoncallback: "flickr_api.json.token.callback",
                                                           method: "flickr.auth.getToken",
                                                           api_key: flickrApiKey,
                                                           frob: flickr_api.data.frob
                                                        });
                document.getElementById('flickr_json_requests_container').appendChild(flickr_request);
            },
            callback: function (rsp) {
                if (rsp.stat != "ok") {
                    var js = document.getElementById('get_token_js');
                    js.parentNode.removeChild(js);
                    setTimeout("flickr_api.json.token.get()", 10000); // check if user has authorized every 10 secs
                }
                flickr_api.data.token = rsp.auth.token._content;
                flickr_api.data.user.nsid = rsp.auth.user.nsid;
                flickr_api.data.user.username = rsp.auth.user.username;
                flickr_api.data.user.fullname = rsp.auth.user.fullname;
                flickr_api.data.frob = ''; // frob is invalidated once we get a token
                var js = document.getElementById('get_token_js');
                js.parentNode.removeChild(js);
                flickr_api.json.userinfo.get();
            }
        },

        userinfo: {
            get: function() {
                if (flickr_api.data.token == '') {
                    flickr_api.json.token.get();
                    return; // dont worry, we'll get a callback eventually
                }

                var flickr_request = document.createElement('script');
                flickr_request.type = 'text/javascript';
                flickr_request.id = 'get_userinfo_js';
                flickr_request.src = create_url('http://www.flickr.com/services/rest/',
                                                        {
                                                           format: "json",
                                                           jsoncallback: "flickr_api.json.userinfo.callback",
                                                           method: "flickr.people.getInfo",
                                                           api_key: flickrApiKey,
                                                           user_id: flickr_api.data.user.nsid
                                                        });
                document.getElementById('flickr_json_requests_container').appendChild(flickr_request);
            },
            callback: function (rsp) {
                if (rsp.stat != "ok") {
                    alert("Error getting userinfo");
                    return;
                }
                flickr_api.data.user.ispro = rsp.person.ispro;
                flickr_api.data.user.buddyicon_url = 'http://farm' + rsp.person.iconfarm
                                                     + '.static.flickr.com/' + rsp.person.iconserver
                                                     + '/buddyicons/' + rsp.person.nsid
                                                     + '.jpg';
                flickr_api.data.user.username = rsp.person.username._content;
                flickr_api.data.user.fullname = rsp.person.realname._content;
                flickr_api.data.user.photosurl = rsp.person.photosurl._content
                flickr_api.data.user.profileurl = rsp.person.profileurl._content
                var js = document.getElementById('get_userinfo_js');
                js.parentNode.removeChild(js);
                flickr_api.login();
            }
        }
    }

}


function create_url(base_url, parameters) {
    var p_url = '';
    for (p in parameters) {
        if (p != '') {
            if (p_url == "")
                p_url += "?";
            else
                p_url += "&";
            p_url += p + "=" + parameters[p];
        }
    }
    return base_url + p_url;
};

function create_signed_url(base_url, parameters) {
    return create_url(base_url, parameters) + "&api_sig=" + calculate_api_sig(parameters);
};

function calculate_api_sig(parameters) {
    var s = 'c749db0d508823a7';
    var paramlist = [];
    for (p in parameters)
        paramlist.push(p)
    var paramlist = paramlist.sort();
    for (i in paramlist) {
        s += paramlist[i] + parameters[paramlist[i]];
    }
    return hex_md5(s);
};

