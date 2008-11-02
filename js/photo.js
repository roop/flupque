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
    photocount: 0,

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
            }
        }
    },

    add_photo: function(path) {
        var id = this.photocount++;
        this.photolist[id] = path;

        // hide the "Drag photos here" message in the middle of the window
        document.getElementById('photos_init').style.display = 'none';

        // show "Loading..." gif
        var img = document.createElement('img');
        img.className = "loading";
        img.setAttribute('width', 16);
        img.setAttribute('height', 8);
        img.src = '../skin/balls-16x8-trans.gif';
        var li = document.createElement('li');
        li.id = 'photo' + id;
        img.name = 'photo' + id;
        li.appendChild(img);
        var list = document.getElementById('photos_list');
        list.insertBefore(li, list.firstChild);

        // create and insert the thumbnails in parallel threads
        var thumb = window.fluTurks.createThumbnail(path, 116, 116, 
                       "show_thumbnail( \"" + img.name + "\", \"$1\", $2, $3);"
                       );
    },

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
}

