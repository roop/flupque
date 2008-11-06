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
    frob: '',

    json: {
        onGotFrob: function (rsp) {
            if (rsp.stat != "ok") {
                alert("Error getting frob");
                return;
            }
            flickr_api.frob = rsp.frob._content;
            var user_authorization_url = create_signed_url(
                              "http://www.flickr.com/services/auth/",
                              {
                                 frob: flickr_api.frob,
                                 api_key: flickrApiKey,
                                 perms: "write"
                              });
            window.fluFlickrWebPage.setUrlString(user_authorization_url);
            window.fluFlickrWebPage.show();
        }
    },

    get_frob: function() {
        var flickr_frob_request = document.createElement('script');
        flickr_frob_request.type = 'text/javascript';
        flickr_frob_request.id = 'get_frob';
        var params = {
                        format: "json",
                        jsoncallback: "flickr_api.json.onGotFrob",
                        method: "flickr.auth.getFrob",
                        api_key: flickrApiKey
                     };
        flickr_frob_request.src = create_signed_url('http://www.flickr.com/services/rest/',
                                                    {
                                                       format: "json",
                                                       jsoncallback: "flickr_api.json.onGotFrob",
                                                       method: "flickr.auth.getFrob",
                                                       api_key: flickrApiKey
                                                    });
        document.getElementById('flickr_json_requests_container').appendChild(flickr_frob_request);
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

