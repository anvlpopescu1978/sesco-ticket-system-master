(function () {
 
    var scriptName = 'SharePointDialog';

    function execute() {

        Type.registerNamespace('Shp.Dialog');


        Shp.Dialog.PromptDialog = function () {
             /// <summary>Info dialog static class</summary>
            throw 'Cannot create an instance Shp.Dialog.PromtDialog static class';
        };


        Shp.Dialog.PromptDialog._onClose = Function.emptyFunction;

        Shp.Dialog.PromptDialog.show = function (title, err, closeMethod) {
            /// <summary>Show a modal dialog containing prompt message</summary>
            var e = Function.validateParameters(arguments, [{ name: 'title', type: String, optional: false, mayBeNull: false },
            { name: 'err', type: String, optional: false, mayBeNull: false },
            { name: 'closeMethod', type: Function, optional: false, mayBeNull: false }], true);
            if (e) throw e;

            Shp.Dialog.PromptDialog._onClose = closeMethod;


            var $dialog = jq('<div id="promptDialog"  class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                '<div class="modal-dialog modal-s modal-dialog-centered">' +
                '<div class="modal-content">' +
                '<div class="modal-header" style="color: #fff; background-color: #0096D6">' +
                '<h3 style="margin:0;"><i class="fa fa-warning"></i> ' + title + '</h3>' +
                '</div>' +
                '<div class="modal-body">' + err + '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-primary" onclick="javascript:Shp.Dialog.PromptDialog._onClose()">Ok</button>' +
                '<button type="button" class="btn btn-primary" onclick="javascript:Shp.Dialog.PromptDialog.hide()">Cancel</button>' +
                '</div>' +
                '</div>' +
                '</div' +
                '</div');
            $dialog.modal();
        };

        Shp.Dialog.PromptDialog.hide = function () {
            jq('div[class*="modal-backdrop"]').remove();
            jq('#promptDialog').remove();
        };

        Shp.Dialog.PromptDialog.registerClass('Shp.Dialog.PromptDialog');


        Shp.Dialog.warningDialog = function () {
            /// <summary>Info dialog static class</summary>
            throw 'Cannot create an instance Shp.Dialog.ErrorDialog static class';
        };

        Shp.Dialog.warningDialog._onClose = Function.emptyFunction;

        Shp.Dialog.warningDialog.show = function (title, err, closeMethod) {
            /// <summary>Show a modal dialog containing error</summary>
            /// <param>Title</param>
            /// <param>Error</param>
            /// <param>Close function</param>
            var e = Function.validateParameters(arguments, [{ name: 'title', type: String, optional: false, mayBeNull: false },
                                                            { name: 'err', type: String, optional: false, mayBeNull: false },
                                                            { name: 'closeMethod', type: Function, optional: true, mayBeNull: false }], true);
            if (e) throw e;
            Shp.Dialog.warningDialog._onClose = closeMethod || Function.emptyFunction;

            var $dialog = jq('<div id="warningDialog"  class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                                             '<div class="modal-dialog modal-s">' +
                                                 '<div class="modal-content">' +
                                                     '<div class="modal-header" style="color: #fff; background-color: #6B3A97;">' +
                                                         '<h3 style="margin:0;"><i class="fa fa-warning"></i> ' + title + '</h3>' +
                                                      '</div>' +
                                                     '<div class="modal-body">' + err + '</div>' +
                                                     '<div class="modal-footer"><button type="button" class="btn btn-warning" onclick="javascript:Shp.Dialog.warningDialog.hide()">Close</button></div>' +
                                                 '</div>' +
                                             '</div' +
                                         '</div');
            $dialog.modal();
        };

        Shp.Dialog.warningDialog.hide = function () {
            /// <summary>Hide warining dialog</summary>
            jq('div[class*="modal-backdrop"]').remove();
            jq('#warningDialog').remove();
            Shp.Dialog.warningDialog._onClose();
        };


        Shp.Dialog.warningDialog.registerClass('Shp.Dialog.warningDialog');







        Shp.Dialog.ErrorDialog = function () {
            /// <summary>Error dialog static class</summary>
            throw 'Cannot create an instance Shp.Dialog.ErrorDialog static class';
        };

        Shp.Dialog.ErrorDialog._onClose = Function.emptyFunction;

        Shp.Dialog.ErrorDialog.show = function (title, err, closeMethod) {
            /// <summary>Show a modal dialog containing error</summary>
            /// <param>Title</param>
            /// <param>Error</param>
            /// <param>Close function</param>
            var e = Function.validateParameters(arguments, [{ name: 'title', type: String, optional: false, mayBeNull: false },
                                                            { name: 'err', type: String, optional: false, mayBeNull: false },
                                                            { name: 'closeMethod', type: Function, optional: true, mayBeNull: false }], true);
            if (e) throw e;
            Shp.Dialog.ErrorDialog._onClose = closeMethod || Function.emptyFunction;
            var $dialog = jq('<div id="errorDialog"  class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                                    '<div class="modal-dialog modal-s">' +
                                        '<div class="modal-content">' +
                                            '<div class="modal-header" style="color: #fff; background-color: #dc3545">' +
                                                '<h3 style="margin:0;"><i class="fa fa-warning"></i> ' + title + '</h3>' +
                                             '</div>' +
                                            '<div class="modal-body">' + err + '</div>' +
                                            '<div class="modal-footer"><button type="button" class="btn btn-danger" onclick="javascript:Shp.Dialog.ErrorDialog.hide()">Close</button></div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div');
            $dialog.modal();
        };

        Shp.Dialog.ErrorDialog.hide = function () {
            /// <summary>Hide modal dialog containing error</summary>
            jq('div[class*="modal-backdrop"]').remove();
            jq('#errorDialog').remove();
            Shp.Dialog.ErrorDialog._onClose();
        };


        Shp.Dialog.ErrorDialog.registerClass('Shp.Dialog.ErrorDialog');


        Shp.Dialog.EditFormDialog = function () {
            /// <summary>Iframe dialog static class</summary>
            throw 'Cannot create an instance Shp.Dialog.IframeDialog static class';

        };


        Shp.Dialog.EditFormDialog._saveEditForm = function () {
            /// <summary>Save edit form. On child window SaveEditForm is reserved function.</summary>
            document.getElementById('editFormFrame').contentWindow.SaveEditForm(Shp.Dialog.EditFormDialog._args);
        };

        Shp.Dialog.EditFormDialog._onLoad = function () {
            var contentH = jq('#editFormDialog').find('div.modal-content').height();
            jq('#editFormFrame').css('height', (contentH - 2) + 'px')
        };

        Shp.Dialog.EditFormDialog._args = null;
        Shp.Dialog.EditFormDialog._load = Function.emptyFunction;

        Shp.Dialog.EditFormDialog.set_load = function (loadMethod) {
            Shp.Dialog.EditFormDialog._load = loadMethod;
        }

        Shp.Dialog.EditFormDialog.get_args = function () {
            /// <summary>Get arguments passed to child window</summary>
            return Shp.Dialog.EditFormDialog._args;
        };

        Shp.Dialog.EditFormDialog.set_args = function (args) {
            /// <summary>Set arguments to edit form dialog</summary>
            Shp.Dialog.EditFormDialog._args = args;
        };

        Shp.Dialog.EditFormDialog.show = function (title, url, args) {
            /// <summary>Edit form dialog</summary>
            /// <param name="title" type="String" optional="False" mayBeNull="False">Dialog title</param>
            /// <param name="url" type="String" optional="False" mayBeNull="False">Url</param>
            /// <param name="args" type="Object" optional="False" mayBeNull="True">Target function arguments</param>
            var e = Function.validateParameters(arguments, [{ name: 'title', type: String, optional: false, mayBeNull: false },
                                                            { name: 'url', type: String, optional: false, mayBeNull: false },
                                                            { name: 'args', optional: true, mayBeNull: true }], true);
            if (e) throw e;

            var args = args || null;
            Shp.Dialog.EditFormDialog._args = args;
            var $dialog = jq('<div id="editFormDialog" class="iframe-container" style="position: fixed !important">' +
                                            '<iframe id="editFormFrame" onload="javascript:Shp.Dialog.EditFormDialog._load()" class="embed-responsive-item" src="' + url + '" />' +
                                '</div>');
            jq("body").append('<div class="modal-backdrop fade in" style="z-index:3000"></div>');
            jq("body").append($dialog);

    
        };

        Shp.Dialog.EditFormDialog.hide = function () {
            /// <summary>Hide waitting dialog</summary>
            jq('div[class*="modal-backdrop"]').remove();
            jq('#editFormDialog').remove();
           Shp.Dialog.EditFormDialog._args = null;
        };

        Shp.Dialog.EditFormDialog.registerClass('Shp.Dialog.EditFormDialog');



        Shp.Dialog.WaittingDialog = function () {
            /// <summary>Waitting dialog static class</summary>
            throw 'Cannot create an instance Shp.Dialog.WaittingDialog static class';
        };

        Shp.Dialog.WaittingDialog.show = function (message) {
            /// <summary>Show waitting dialog</summary>
            /// <param name="message">Message</param>
           
            var $dialog = jq('<div id="waittingDialog"  class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                                    '<div class="modal-dialog modal-s">' +
                                        '<div class="modal-content">' +
                                            '<div class="modal-header"><h3 style="margin:0;">' + message + '</h3></div>' +
                                            '<div class="modal-body">' +
                                                '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>');
            $dialog.modal();
        };

        Shp.Dialog.WaittingDialog.update_message = function (message) {
            /// <summary>Update waitting dialog message</summary>
            /// <param name="message">Message</param>
            jq('#waittingDialog').find('div.modal-header').find('h3').html(message);
        };

        Shp.Dialog.WaittingDialog.hide = function () {
            /// <summary>Hide waitting dialog</summary>
            jq('#waittingDialog').remove();
            jq('div[class*="modal-backdrop"]').remove();
        };

        Shp.Dialog.WaittingDialog.registerClass('Shp.Dialog.WaittingDialog');

    };

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, null, execute);
    }
    else {
        execute();
    }

}());


function centerModal() {
    // $(this).css('display', 'block');
    jq('.modal-dialog').css('display', 'block');
    var $dialog = jq(".modal-content");
    var offset = jq(window).height() - $dialog.height() / 2;
     //var marginTop = parseInt($dialog.css('marginTop'), 10);

    // Make sure you don't hide the top part of the modal w/ a negative margin if it's longer than the screen height, and keep the margin equal to the bottom margin of the modal
   // if (offset < marginTop) offset = marginTop;
    $dialog.css("top", '-' + offset + 'px');
}
