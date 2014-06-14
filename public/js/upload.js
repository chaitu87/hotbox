$(function() {
    var ul = $('.uploadbars');
    // Initialize the jQuery File Upload plugin
    $('#upload-hidden').fileupload({
        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),
        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function(e, data) {
            var tpl = $('<li><div class="progress progress-uploader"><div class="progress-bar progress-bar-uploader" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"><span class="sr-only">60% Complete</span></div></div></li>');
            // var tpl = $('<li class="working no-bullets"><input type="text" value="0" data-width="48" data-height="48"'+ ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');
            // Append the file name and file size
            tpl.find('p').text(data.files[0].name).append(' ' + '<i>' + formatFileSize(data.files[0].size) + '</i>');
            // Add the HTML to the UL element
            data.context = tpl.appendTo(ul);
            // Listen for clicks on the cancel icon
            tpl.find('span').click(function() {
                if (tpl.is('progress')) {
                    jqXHR.abort();
                }
                tpl.fadeOut(function() {
                    tpl.remove();
                });
            });
            // console.log(data.files[0].name);
            // console.log(data.Val);
            // Automatically upload the file once it is added to the queue
            var jqXHR = data.submit();
        },
        progress: function(e, data) {
            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);
            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            // data.context.find('input').val(progress).change();
            var item = $(".progress-bar-uploader");
            data.context.find(item).css("width", progress + '%').change();
            if (progress == 100) {
                data.context.addClass('hide');
            }
        },
        fail: function(e, data) {
            // Something has gone wrong!
            data.context.addClass('error');
        }
    }).bind('fileuploadsubmit', function(e, data) {
        data.formData = {
            key: "uploads/" + window.uid + "/" + data.files[0].name,
            AWSAccessKeyId: 'AKIAICXYZEQIRW422JIQ',
            acl: "public-read",
            success_action_status: "201",
            policy: "eyAiZXhwaXJhdGlvbiI6ICIyMDIwLTEyLTAxVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJhY2wiOiAicHVibGljLXJlYWQiIH0sCiAgICB7ImJ1Y2tldCI6ICJwcm9qZWN0eC10ZXN0LXNjcmlwdHMiIH0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRzdWNjZXNzX2FjdGlvbl9zdGF0dXMiLCAiMjAxIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAibXAzIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAidXBsb2Fkcy8iXSwKICAgIFsgImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwgMjA0OCwgMjA5NzE1MjAgXQogIF0KfQ==",
            signature: "av5oZd1K395fRMgAfstNW+YXSOY=",
            "Content-Type": "mp3"
        };
        if (!data.formData.key) {
            input.focus();
            return false;
        }
    }).bind('fileuploaddone', function(e, data) { // Executed once a file upload is done
        console.log(data.files[0].name + ' is uploaded');
        var xml = data.jqXHR.responseText;
        xmlDoc = $.parseXML(xml);
        $xml = $(xmlDoc);
        $title = $xml.find("Location");
        var trackinfo = new Array();
        trackinfo[0] = data.files[0].name.slice(0, -4).replace(/\s/g, "");
        trackinfo[1] = data.files[0].name.slice(0, -4);
        trackinfo[2] = $title.text();
        trackinfo[3] = localStorage.getItem("latency");
        // Add song to playlist-ui
        pubnub.publish({
            channel: "playlist-upload",
            message: trackinfo
        });
    });
    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function(e) {
        e.preventDefault();
    });
    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }
        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }
        return (bytes / 1000).toFixed(2) + ' KB';
    }
});