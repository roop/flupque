/*
 * This file is part of the Flupque software
 *
 * Copyright (c) 2007 Yahoo! Inc.
 * Copyright (c) 2008 Roopesh Chander <roop@forwardbias.in>
 *
 * This library is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License (GPL), version 2
 * only.  This library is distributed WITHOUT ANY WARRANTY, whether
 * express or implied. See the GNU GPL for more details.
 * http://www.gnu.org/licenses/gpl.html
 *
 */

var photo = {
    // Member variables
    photolist: [],
    photocount: 0, // NOTE: photolist.length can be higher than photocount since when we
                   //       delete photos from a batch we only make photolist[i] as
                   //       undefined. photolist.length is unchanged.
    selectedcount: 0,
    metaeditorenabled: false,

    // Methods
    add_dialog: function() {
        var fluFileDialog = window.fluFileDialog;
        fluFileDialog.clearNameFilters();
        fluFileDialog.addNameFilter("Photos (*.jpg *.tiff)");
        fluFileDialog.addNameFilter("Images (*.jpg *.png *.gif *.bmp)");
        fluFileDialog.addNameFilter("All files (*.*)");
        if (fluFileDialog.exec()) {
            var files = fluFileDialog.selectedFiles();
            for (var i = 0; i < files.length; i++) {
                this.add_photo(files[i]);
                // store details of the last added photo in the settings file
                this.store_photodata_in_settings_file(this.photolist.length - 1);
            }
        }
        this.store_photocount_in_settings_file();
    },

    add_photo: function(path) {
        var id = this.photolist.length;
        this.photolist[id] = new Photo(path, id);
        this.photocount++;

        // hide the "Drag photos here" message in the middle of the window
        document.getElementById('photos_init').style.display = 'none';

        // show "Loading..." gif
        var img = document.createElement('img');
        img.className = "loading";
        img.setAttribute('width', 16);
        img.setAttribute('height', 8);
        img.src = '../skin/balls-16x8-trans.gif';
        var li = document.createElement('li');
        li.id = 'li_photo' + id;
        img.name = 'photo' + id;
        img.id = id;
        li.appendChild(img);
        var list = document.getElementById('photos_list');
        list.insertBefore(li, list.firstChild);

        // create and insert the thumbnails in parallel threads
        var thumb = window.fluTurks.createThumbnail(path, 116, 116, 
                       "show_thumbnail( \"" + img.name + "\", \"$1\", $2, $3);"
                       );

        if (this.photocount == 1) {
	        document.getElementById('meta_prompt').style.visibility = 'visible';
            this.show_meta_message();
        }
        return this.photolist[id];
    },

    select_photo: function(id) {
        this.save_meta_info_to_selection();
        document.images['photo' + id].className = 'selected';
        this.photolist[id].is_selected = true;
        this.selectedcount++;
        if (this.selectedcount == 1) {
            this.enable_photo_actions();
            this.show_meta_preview(id);
            this.show_meta_message();
        } else {
            this.hide_meta_preview();
            this.show_meta_message();
        }
        this.enable_meta_editor();
        this.load_meta_info_from_selection();
    },

    unselect_photo: function(id) {
        this.save_meta_info_to_selection();
        document.images['photo' + id].className = '';
        this.photolist[id].is_selected = false;
        this.selectedcount--;
        if (this.selectedcount == 0) {
            this.disable_photo_actions();
            this.hide_meta_preview();
            this.show_meta_message();
            this.disable_meta_editor();
        }
        if (this.selectedcount == 1) {
            for (var i = 0; i < this.photolist.length; i++) {
                if (this.photolist[i] != undefined && this.photolist[i].is_selected) {
                    this.show_meta_preview(i);
                    this.show_meta_message();
                    break;
                }
            }
        }
        this.load_meta_info_from_selection();
    },

    show_meta_message: function() {
       var status_elem = document.getElementById('meta_prompt_status');
       var meta_prompt = document.getElementById('meta_prompt');
       if (status_elem != undefined) {
           meta_prompt.removeChild(status_elem);
       }

       var msg_text;
       if (this.selectedcount == 0) {
            msg_text = "Select a photo (or many) to add titles, tags and descriptions"
       } else if (this.selectedcount == 1) {
            msg_text = "You can now change the title, description or tags of this photo"
       } else {
            msg_text = "You can now replace all titles with a new one, add to existing descriptions, or add more tags"
       }
       var status_msg = document.createTextNode(msg_text);
       var h3 = document.createElement('h3');
       h3.appendChild(status_msg);
       var new_status_elem = document.createElement('div');
       new_status_elem.id = 'meta_prompt_status';
       new_status_elem.className = "status";
       new_status_elem.appendChild(h3);
       meta_prompt.insertBefore(new_status_elem, meta_prompt.firstChild);
    },

    show_meta_preview: function(id) {
       var img = document.images['photo' + id];

       var preview_elem = document.getElementById('meta_single_preview');
       preview_elem.src = img.src;
       preview_elem.width = img.width;
       preview_elem.height = img.height;
       if (img.height > 100) { // portrait image
           preview_elem.width = img.width * 100.0 / img.height;
           preview_elem.height = '100';
       }
       preview_elem.style.display = 'block';

	   document.getElementById('meta_prompt').style.visibility = 'visible';
    },

    hide_meta_preview: function() {
       document.getElementById('meta_single_preview').style.display = 'none';
    },

    enable_photo_actions: function() {
        document.getElementById('t_remove').className = 'button';
        document.getElementById('t_rotate_l').className = 'enabled';
        document.getElementById('t_rotate_r').className = 'enabled';
    },

    disable_photo_actions: function() {
        document.getElementById('t_remove').className = 'disabled_button';
        document.getElementById('t_rotate_l').className = 'disabled';
        document.getElementById('t_rotate_r').className = 'disabled';
    },

    remove_selected_photos: function() {
        for (var i = 0; i < this.photolist.length; i++) {
            if (this.photolist[i] != undefined && this.photolist[i].is_selected) {
                var li = document.getElementById('li_photo' + this.photolist[i].id);
                li.parentNode.removeChild(li);
                delete this.photolist[i];
                this.remove_photodata_in_settings_file(i);
                this.photocount--;
            }
        }
        this.store_photocount_in_settings_file();
        this.selectedcount = 0;
        this.disable_photo_actions();
        this.load_meta_info_from_selection();
        this.hide_meta_preview();
        this.show_meta_message();
        this.disable_meta_editor();

        if (this.photocount == 0)
            document.getElementById('meta_prompt').style.visibility = 'hidden';
    },

    enable_meta_editor: function() {
        if (this.metaeditorenabled == true) {
            return;
        }
        for (var m = 1; m <= 2; m++) {
            var meta_column = document.getElementById('meta_column_' + m);
            meta_column.className = "column";
            apply_on_all_descendants(meta_column, 
                            function(node) {
                                if (node.tagName == 'input' || node.tagName == 'textarea' ||
                                    node.tagName == 'INPUT' || node.tagName == 'TEXTAREA') {
                                    node.disabled = false;
                                }
                            }
            );
        }
        this.metaeditorenabled = true;
    },

    disable_meta_editor: function() {
        if (this.metaeditorenabled == false) {
            return;
        }
        for (var m = 1; m <= 2; m++) {
            var meta_column = document.getElementById('meta_column_' + m);
            meta_column.className = "column_disabled";
            apply_on_all_descendants(meta_column, 
                            function(node) {
                                if (node.tagName == 'input' || node.tagName == 'textarea' ||
                                    node.tagName == 'INPUT' || node.tagName == 'TEXTAREA') {
                                    node.disabled = true;
                                    node.value = '';
                                    node.checked = false;
                                }
                            }
            );
        }
        this.metaeditorenabled = false;
    },

    save_meta_info_to_selection: function() {
        var title = document.forms.meta_column_1_form.meta_title.value;
        var description = document.forms.meta_column_1_form.meta_description.value;
        var tags = document.forms.meta_column_1_form.meta_tags.value;
        var is_public = document.forms.meta_column_2_form.meta_whocansee[1].checked;
        var is_public_undef = !is_public && !document.forms.meta_column_2_form.meta_whocansee[0].checked;
        var is_friend = document.forms.meta_column_2_form.meta_youandwho[0].checked;
        var is_family = document.forms.meta_column_2_form.meta_youandwho[1].checked;
        for (var i = 0; i < this.photolist.length; i++) {
            var photo = this.photolist[i];
            if (photo != undefined && photo.is_selected) {
                if (title != '')
                    photo.meta.title = title;
                if (!is_public_undef)
                    photo.meta.is_public = is_public;
                if (this.selectedcount == 1) {
                    photo.meta.description = description;
                    photo.meta.tags = tags;
                    photo.meta.is_friend = is_friend;
                    photo.meta.is_family = is_family;
                } else {
                    if (description != '') {
                        if (photo.meta.description != '')
                            photo.meta.description += ' ';
                        photo.meta.description += description;
                    }
                    if (tags != '') {
                        var existing_taglist = photo.meta.tags.split(/\s*,\s*/);
                        var new_taglist = tags.split(/\s*,\s*/);
                        var taghash = {};
                        for (var t = 0; t < existing_taglist.length; t++)
                            if (existing_taglist[t].search(/\S/) >= 0)
                                taghash[existing_taglist[t]] = 1;
                        for (var t = 0; t < new_taglist.length; t++)
                            if (new_taglist[t].search(/\S/) >= 0)
                                taghash[new_taglist[t]] = 1;
                        var combined_taglist = [];
                        for (var tag in taghash)
                            combined_taglist.push(tag);
                        photo.meta.tags = combined_taglist.sort().join(", ");
                    }
                    // the following checkbox state changes might result in bad ui:
                    // can never remove is_friend for multiple photos at once.
                    // but keeping it for now anyway, for want of a better ui (without an apply button)
                    photo.meta.is_friend = photo.meta.is_friend || is_friend;
                    photo.meta.is_family = photo.meta.is_family || is_family;
                }
                this.store_photodata_in_settings_file(i);
            }
        }
    },

    load_meta_info_from_selection: function() {
        document.forms.meta_column_1_form.meta_title.value = '';
        document.forms.meta_column_1_form.meta_description.value = '';
        document.forms.meta_column_1_form.meta_tags.value = '';
        var is_private = true;
        var is_public = true;
        var is_friend = true;
        var is_family = true;
        for (var i = 0; i < this.photolist.length; i++) {
            var photo = this.photolist[i];
            if (photo != undefined && photo.is_selected) {
                is_private = is_private && !photo.meta.is_public;
                is_public = is_public && photo.meta.is_public;
                is_friend = is_friend && photo.meta.is_friend;
                is_family = is_family && photo.meta.is_family;
                if (this.selectedcount == 1) {
                    document.forms.meta_column_1_form.meta_title.value = photo.meta.title;
                    document.forms.meta_column_1_form.meta_description.value = photo.meta.description;
                    document.forms.meta_column_1_form.meta_tags.value = photo.meta.tags;
                }
            }
        }
        if (!is_private) {
            is_friend = false;
            is_family = false;
        }
        if (this.selectedcount >= 1) {
            document.forms.meta_column_2_form.meta_whocansee[0].checked = is_private;
            document.forms.meta_column_2_form.meta_whocansee[1].checked = is_public;
            document.forms.meta_column_2_form.meta_youandwho[0].checked = is_friend;
            document.forms.meta_column_2_form.meta_youandwho[1].checked = is_family;
        } else {
            document.forms.meta_column_2_form.meta_whocansee[0].checked = false;
            document.forms.meta_column_2_form.meta_whocansee[1].checked = false;
            document.forms.meta_column_2_form.meta_youandwho[0].checked = false;
            document.forms.meta_column_2_form.meta_youandwho[1].checked = false;
        }
        this.meta_whocansee_changed();
    },

    meta_whocansee_changed: function() {
        var youandwho_disabled = !document.forms.meta_column_2_form.meta_whocansee[0].checked;
        var youandwho_list = document.forms.meta_column_2_form.meta_youandwho;
        for (var i = 0; i < youandwho_list.length; i++) {
            youandwho_list[i].disabled = youandwho_disabled;
            if (youandwho_disabled)
                youandwho_list[i].checked = false;
        }
        if (youandwho_disabled)
            document.getElementById('meta_youandwho_div').className = "youandwho_disabled";
        else
            document.getElementById('meta_youandwho_div').className = "youandwho";
    },

    store_photodata_in_settings_file: function(id) {
        var fluSettings = window.fluSettings;
        var photo = this.photolist[id];
        if (photo != undefined) {
            fluSettings.setValue("photos/" + id + "/path", photo.path);
            fluSettings.setValue("photos/" + id + "/title", photo.meta.title);
            fluSettings.setValue("photos/" + id + "/description", photo.meta.description);
            fluSettings.setValue("photos/" + id + "/tags", photo.meta.tags);
            fluSettings.setValue("photos/" + id + "/is_public", photo.meta.is_public);
            fluSettings.setValue("photos/" + id + "/is_friend", photo.meta.is_friend);
            fluSettings.setValue("photos/" + id + "/is_family", photo.meta.is_family);
        }
    },

    store_photocount_in_settings_file: function() {
        window.fluSettings.setValue("photos/size", this.photolist.length);
    },

    remove_photodata_in_settings_file: function(id) {
        window.fluSettings.remove("photos/" + id);
    },

    load_photos_from_settings_file: function() {
        var fluSettings = window.fluSettings;
        var size = fluSettings.valueString("photos/size");
        this.photolist.length = 0;
        this.photocount = 0;
        this.selectedcount = 0;
        for (var id = 0; id < size; id++) {
            if (fluSettings.contains("photos/" + id + "/path")) {
                var photo = this.add_photo(fluSettings.valueString("photos/" + id + "/path"));
                photo.meta.title = fluSettings.valueString("photos/" + id + "/title");
                photo.meta.description = fluSettings.valueString("photos/" + id + "/description");
                photo.meta.tags = fluSettings.valueString("photos/" + id + "/tags");
                photo.meta.is_public = (fluSettings.valueString("photos/" + id + "/is_public") == "true");
                photo.meta.is_friend = (fluSettings.valueString("photos/" + id + "/is_friend") == "true");
                photo.meta.is_family = (fluSettings.valueString("photos/" + id + "/is_family") == "true");
                photo.id = id;
                photo.name = 'photo' + id;
            }
        }
    }

};


function apply_on_all_descendants(node, fn) {
        var children = node.childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == undefined || children[i].tagName == undefined) {
                continue;
            }
            apply_on_all_descendants(children[i], fn);
            fn(children[i]);
        }
};

// The show_thumbnail function shall get called once the
// thumbnail gets created in the worker thread
function show_thumbnail(id, path, width, height) {
    var img = document.images[id];
    img.style.visibility = 'hidden';
    img.className = '';
    img.src = "file://" + path;
    img.width = width;
    img.height = height;
    img.style.visibility = 'visible';
    img.onclick = function() { image_clicked(img.name); };
}

function Photo(path, id) {
    this.path = path;
    this.id = id;
    this.name = name;
    this.is_selected = false;
    var basename = path.match(/([^\/]+)$/)[0];
    this.meta = {
        title: basename,
        description: "",
        tags: '',
        is_public: false,
        is_friend: false,
        is_family: false
    };
}

function image_clicked(imgname) {
    img = document.images[imgname];
    if (img.className == 'selected') {
        photo.unselect_photo(img.id);
    } else {
        photo.select_photo(img.id);
    }
}

