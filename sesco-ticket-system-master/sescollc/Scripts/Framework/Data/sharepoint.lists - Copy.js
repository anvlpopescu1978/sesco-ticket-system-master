/// <reference name="MicrosoftAjax.js" />
/// <reference name="MicrosoftAjaxWebForms.js" />

/* global Function, SP, Shp, item, Sys, Type, parseFloat */
/* eslint-disable */




(function () {

    var scriptName = 'SharePointData';


    function execute() {

        Type.registerNamespace('Shp');


        Shp.Attachments = function () {
            /// <summary>Shp Attachments static class</summary>
            throw 'Cannot initiate Shp.Attachments static class';
        }

        Shp.Attachments.get_file = function (fileInput) {
            /// <summary>This method is used to get the content of the file as binary string</summmary>

            var deffered = jQuery.Deferred();
            var reader = new FileReader();
            reader.onload = function (e) {
                deffered.resolve(e.target.result);
            };

            reader.onerror = function (e) {
                deffered.reject(e.target.error);
            };

            reader.readAsBinaryString(fileInput.files[0]);
            return deffered.promise();
        };

        Shp.Attachments.add = function (listName, itemId, fileInput, webUrl, success, fail) {
            /// <summary>Add attachments</summary>
            /// <param>List name</param>
            /// <param>Item Id</param>
            /// <param>File input controls</param>
            /// <param>Web url</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
                                                            { name: 'itemId', type: String, optional: false, mayBeNull: false },
                                                            { name: 'filesInput', type: HTMLElement, optional: false, mayBeNull: false },
                                                            { name: 'webUrl', type: String, optional: false, mayBeNull: true },
                                                            { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                            { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);
            if (e) throw e;

            var webUrl = webUrl || _spPageContextInfo.webAbsoluteUrl;
            var fail = fail || function (err) { alert(err); };

            Shp.Attachments.get_file(fileInput).then(function (fileContent) {
                var parts = fileInput.value.split("\\");
                var fileName = parts[parts.length - 1];
                // Attachments add internal method
                Shp.Attachments._add(listName, itemId, fileContent, fileName, webUrl, success, fail);
            });
        };


        Shp.Attachments._add = function (listName, itemId, fileContent, fileName, webUrl, success, fail) {

            var scriptBase = webUrl + "/_layouts/15/";
            jQuery.getScript(scriptBase + "SP.RequestExecutor.js", function () {

                var executor = new SP.RequestExecutor(webUrl);
                executor.executeAsync({
                    url: webUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items(" + itemId + ")/AttachmentFiles/add(FileName='" + fileName + "')",
                    method: "POST",
                    binaryStringRequestBody: true,
                    body: fileContent,
                    state: "Update",
                    success: function () {
                        success(itemId);
                    },
                    fail: function (data) {
                        fail(data.responseText);
                    }

                });

            });
        };

        Shp.Attachments.registerClass('Shp.Attachments');




        Shp.Number = function () { };

        Shp.Number.get_decimalSeparator = function () {

            var decSep = ".";
            try {

                var sep = parseFloat(3 / 2).toLocaleString().substring(1, 2);
                if (sep === '.' || sep === ',') {
                    decSep = sep;
                }
            }
            catch (e) {
            }

            return decSep;

        };

        Shp.Number.get_floatUsFormat = function (str) {
            var decimalSeparator = Shp.Number.get_decimalSeparator();

            if (decimalSeparator === ',') {
                // Remove decimar separator
                str = str.replace(new RegExp('.', 'g'), ',');
            }

            var nb = parseFloat(str);
            if (decimalSeparator === ',') {
                nb = jQuery.number(nb, ',');
            }

            return nb;

        };

        Shp.Number.registerClass('Shp.Number');

        Shp.Lists = function () {
            throw 'Cannot instantiate Shp.Lists static class';
        };



        Shp.Lists.RecycleItems = function (listName, listItems, web, success, fail) {
            /// <signature>
            ///	    <summary>Recycle items from the list</summary>
            /// 	<param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// 	<param name="listItems" type="Array" elementType="Number" elementInteger="true" elementMayBeNull="false" optional="false" mayBeNull="false">List items</param>
            ///     <param name="web" type="SP.Web" optional="true" mayBeNull="false">Web</param>
            /// </signature>
            /// <signature>
            ///	    <summary>Recycle items from the list</summary>
            /// 	<param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// 	<param name="listItems" type="Array" elementType="Number" elementInteger="true" elementMayBeNull="false" optional="false" mayBeNull="false">List items</param>
            ///     <param name="web" type="SP.Web" optional="false" mayBeNull="true">Web</param>
            /// </signature> 

            var e1 = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
                                                           { name: 'listItems', type: Array, elementType: Number, elementInteger: true, elementMayBeNull: false, optional: false, mayBeNull: false },
                                                           { name: 'web', type: SP.Web, optional: true, mayBeNull: false }], true);

            var e2 = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
                                                             { name: 'listItems', type: Array, elementType: Number, elementInteger: true, elementMayBeNull: false, optional: false, mayBeNull: false },
                                                             { name: 'web', type: SP.Web, optional: false, mayBeNull: true },
                                                             { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                             { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);
            if (e1 !== null && e2 !== null) {
                throw e1 || e2;
            }

            var ctx = (typeof web === 'undefined' || web === null) ? SP.ClientContext.get_current() : web.get_context();
            var web = (typeof web === 'undefined' || web === null) ? ctx.get_web() : web;

            // Use deferred
            if (e1 === null) {
                return Shp.Lists._DefferedRecycleItems(listName, listItems, ctx, web);
            }

        };


        Shp.Lists._DefferedRecycleItems = function (listName, listItems, ctx, web) {
            var deferred = jQuery.Deferred();
            var oList = web.get_lists().getByTitle(listName);
            var recycledItems = [];

            for (var i = 0; i < listItems.length; i++) {
                var oListItem = oList.getItemById(listItems[i]);
                var recycleItem = oListItem.recycle();
                recycledItems.push(recycleItem);
            }

            ctx.executeQueryAsync(function () {
                Array.forEach(recycledItems, function (element, index, array) {
                    array[index] = element['m_value']['_m_guidString$p$0'];
                }, null);
                deferred.resolve(recycledItems);
            }, function (sender, args) {
                deferred.reject(args.get_message());
            });

            return deferred.promise();
        };



        Shp.Lists.DeleteItems2 = function (listName, listItems, webUrl, success, fail) {
            ///	<summary>Delete items from the list</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="listItems" type="Array" elementType="Number" elementInteger="true" elementMayBeNull="false" optional="false" mayBeNull="false">List items</param>
            /// <param name="webUrl" type="String" optional="true" mayBeNull="true">Web URL</param>
            /// <param name="success" type="Function" optional="true" mayBeNull="false">Web URL</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Web URL</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
                                                             { name: 'listItems', type: Array, elementMayBeNull: false, optional: false, mayBeNull: false },
                                                             { name: 'webUrl', type: String, optional: false, mayBeNull: true },
                                                             { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                             { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);

            if (e) throw e;

            var fail = fail || function (err) { alert(err); };
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            Shp.Lists._DeleteItems2(listName, listItems, ctx, success, fail);
        };


        Shp.Lists._DeleteItems2 = function (listName, listItems, ctx, success, fail) {

            var oList = ctx.get_web().get_lists().getByTitle(listName);

            var executeOperation = function (index) {
                var _index = index || 0;
                var _itemsLength = listItems.length;
                var results = [];

                for (var k = _index; k < _itemsLength; k++) {
                    _index++;
                    oList.getItemById(listItems[k]).deleteObject();
                    if ((_index % 50 === 0 && _index > 0) || _index === _itemsLength) {
                        var _success = function () {
                            if (_index === _itemsLength) {
                                ctx.executeQueryAsync(function () {
                                    success();
                                }, function (sender, args) {
                                    fail(args.get_message());
                                });
                            }
                            else {
                                _index++;
                                ctx.executeQueryAsync(function () {
                                    executeOperation(_index - 1);
                                }, function (sender, args) {
                                    fail(args.get_message());
                                });
                            }
                        }
                        _success();
                        break;
                    }
                }
            };

            executeOperation();

        };


        Shp.Lists.DeleteItems = function (listName, listItems, webUrl, success, fail) {
            /// <signature>
            ///	    <summary>Delete items from the list</summary>
            /// 	<param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// 	<param name="listItems" type="Array" elementType="Number" elementInteger="true" elementMayBeNull="false" optional="false" mayBeNull="false">List items</param>
            ///     <param name="webUrl" type="String" optional="true" mayBeNull="true">Web URL</param>
            ///     <param name="success" type="Function" optional="true" mayBeNull="false">Web URL</param>
            ///     <param name="fail" type="Function" optional="true" mayBeNull="false">Web URL</param>
            /// </signature>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
                                                             { name: 'listItems', type: Array, elementType: Number, elementInteger: true, elementMayBeNull: false, optional: false, mayBeNull: false },
                                                             { name: 'webUrl', type: String, optional: false, mayBeNull: true },
                                                             { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                             { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);

            if (e) throw e;


            var fail = fail || function (err) { alert(err); };
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            Shp.Lists._DeleteItems(listName, listItems, ctx, success, fail);
        };

        Shp.Lists._DeleteItems = function (listName, listItems, ctx, success, fail) {
            var oList = ctx.get_web().get_lists().getByTitle(listName);
            for (var i = 0; i < listItems.length; i++) {
                var oListItem = oList.getItemById(listItems[i]);
                oListItem.deleteObject();
            }

            ctx.executeQueryAsync(function () {
                success();
            }, function (sender, args) {
                fail(args.get_message());
            });
        };


        Shp.Lists.DeleteItemsFromLists = function (items, webUrl, success, fail) {
            /// <summary>Delete items from multiple lists in the same operation</summary>
            /// <param type="Array" mayBeNull="false" optional="false" elementMayBeNull="false" elementType="Object">Items</param>
            /// <param name="success" type="Function" optional="false" mayBeNull="false">Success</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'items', type: Array, optional: false, mayBeNull: false, elementType: Object, elementMayBeNull: false },
                                                            { name: 'webUrl', type: String, mayBeNull: true, optional: false },
                                                            { name: 'success', type: Function, mayBeNull: false, optional: false },
                                                            { name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            if (e) throw e;
            var fail = fail || function (err) { alert(err); };
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            Shp.Lists._DeleteItemsFromLists(items, ctx, success, fail);
        };


        Shp.Lists._DeleteItemsFromLists = function (items, ctx, success, fail) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i], listName = item['listName'], itemsId = item['listItemsId'];
                var oList = ctx.get_web().get_lists().getByTitle(listName);
                for (var j = 0; j < itemsId.length; j++) {
                    var oListItem = oList.getItemById(parseInt(itemsId[j]));
                    oListItem.deleteObject();
                }
            }
            ctx.executeQueryAsync(function () {
                success();
            }, function (sender, args) {
                fail(args.get_message());
            });
        };


        Shp.Lists.UpdateItems = function (listName, listItems, webUrl, success, fail) {
            /// <summary>Builk items update</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="listItems" type="Array" elementType="Object" elementMayBeNull="false" optional="false" mayBeNull="false">List items</param>
            /// <param name="webUrl" type="SP.Web" optional="false" mayBeNull="true">Web URL</param>
            /// <param name="success" type="Function" optional="false" mayBeNull="false">Success</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'listItems', type: Array, elementType: Object, elementMayBeNull: false, mayBeNull: false, optional: false },
															{ name: 'webUrl', type: String, mayBeNull: true, optional: false },
															{ name: 'success', type: Function, mayBeNull: false, optional: false },
															{ name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            if (e) throw e;

            var fail = fail || function (message) { alert(message); };
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            Shp.Lists._UpdateItems(listName, listItems, ctx, success, fail);
        };



        Shp.Lists._UpdateItems = function (listName, listItems, ctx, success, fail) {

            var oListItems = [];
            var oList = ctx.get_web().get_lists().getByTitle(listName);
            for (var k = 0; k < listItems.length; k++) {
                var listItem = listItems[k];
                var oListItem = oList.getItemById(parseInt(listItem['ID']));
                for (var field in listItem) {
                    if (listItem.hasOwnProperty(field) === true && field !== 'ID') {
                        oListItem.set_item(field, listItem[field]);
                    }
                }
                oListItem.update();
                ctx.load(oListItem);
                oListItems.push(oListItem);
            }


            ctx.executeQueryAsync(function () {
                success(oListItems);
            }, function (sender, args) {
                fail(args.get_message());
            });

        };




        Shp.Lists.DeleteAttachments = function (listName, itemId, files, webUrl, success, fail) {
            /// <summary>Delete attachments</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="itemId" type="String" optional="false" mayBeNull="false">Item id</param>
            /// <param name="files" type="Array" optional="false" mayBeNull="false" elementType="String" elementMayBeNull="false" optional="false" mayBeNull="false">File names</param>
            ///  <param name="webUrl" type="String" optional="false" mayBeNull="true">Web URL</param>
            ///  <param name="success" type="Function" optional="false" mayBeNull="false">Success callback</param>
            ///  <param name="fail" type="Function" optional="true" mayBeNull="false">Fail callback</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
                                                            { name: 'itemId', type: String, optional: false, mayBeNull: false },
                                                            { name: 'files', type: Array, optional: false, mayBeNull: false, elementType: String, elementMayBeNull: false },
                                                            { name: 'webUrl', type: String, optional: false, mayBeNull: true },
                                                            { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                            { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);
            if (e) throw e;

            var fail = fail || function (err) { alert(err); };
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);

            Shp.Lists._DeleteAttachments(listName, itemId, files, ctx, success, fail);

        };

        Shp.Lists._DeleteAttachments = function (listName, itemId, files, ctx, success, fail) {
            var oList = ctx.get_web().get_lists().getByTitle(listName);
            var oItem = oList.getItemById(itemId);
            for (var n = 0; n < files.length; n++) {
                var file = files[n];
                var attachment = oItem.get_attachmentFiles().getByFileName(file);
                attachment.deleteObject();
            }

            ctx.executeQueryAsync(function () {
                success();
            }, function (sender, args) {
                fail(args.get_message());
            });
        };


        Shp.Lists.AddItems = function (listName, listItems, webUrl, success, fail) {
            /// <summary>Add items to the list</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            ///	<param name="listItems" type="Array" elementType="Object" elementMayBeNull="false" optional="false" mayBeNull="false">List items</param>
            //  <param name="webUrl" type="String" optional="false" mayBeNull="true">Web URL</param>
            //  <param name="success" type="Function" optional="false" mayBeNull="false">Success callback</param>
            //  <param name="fail" type="Function" optional="true" mayBeNull="false">Fail callback</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
                                                             { name: 'listItems', type: Array, optional: false, mayBeNull: false },
                                                             { name: 'webUrl', type: String, optional: false, mayBeNull: true },
                                                             { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                             { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);
            if (e) throw e;

            var fail = fail || function (err) { alert(err); };
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            Shp.Lists._AddItems(listName, listItems, ctx, success, fail);
        };

        Shp.Lists._AddItems = function (listName, listItems, ctx, success, fail) {

            var executeOperation = function (index) {
                // execute operation closure

                var _index = index || 0;
                var _itemsLength = listItems.length;
                var results = [];
                var oList = ctx.get_web().get_lists().getByTitle(listName);
                for (var k = _index; k < listItems.length; k++) {
                    _index++;
                    var itemCreateInfo = new SP.ListItemCreationInformation();
                    var oListItem = oList.addItem(itemCreateInfo);
                    var listItem = listItems[k];
                    for (var field in listItem) {
                        oListItem.set_item(field, listItem[field]);
                    }
                    oListItem.update();
                    ctx.load(oListItem);
                    results.push(oListItem);

                    if ((_index % 50 === 0 && _index > 0) || _index === _itemsLength) {
                        var _success = function () {
                            if (_index === _itemsLength) {
                                ctx.executeQueryAsync(function () {
                                    success(results);
                                }, function (sender, args) {
                                    fail(args.get_message());
                                });
                            }
                            else {
                                _index++;
                                ctx.executeQueryAsync(function () {
                                    executeOperation(_index - 1);
                                }, function (sender, args) {
                                    fail(args.get_message());
                                });
                            }
                        }
                        _success();
                        break;
                    }
                }
            }

            executeOperation(0);
        };


        Shp.Lists._AsyncAddItems = function (listName, listItems, ctx, web, success, fail) {
            var results = [];
            var oList = web.get_lists().getByTitle(listName);
            for (var k = 0; k < listItems.length; k++) {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                var oListItem = oList.addItem(itemCreateInfo);
                var listItem = listItems[k];
                for (var field in listItem) {
                    oListItem.set_item(field, listItem[field]);
                }
                oListItem.update();
                ctx.load(oListItem);
                results.push(oListItem);
            }

            ctx.executeQueryAsync(function () {
                success(results);
            }, function (sender, args) {
                fail(args.get_message());
            });
        };


        Shp.Lists.AddItemsInLists = function (addItemsArguments, webUrl, success, fail) {
            /// <summary>Add items in multiple lists calling execute query async once</summary>
            /// <param name="addItemsArguments" type="Array" elementType="Object" elementMayBeNull="false" mayBeNull="false" optional="false">Add items arguments</param>
            /// <param name="webUrl" type="String" mayBeNull="true" optional="false">Web url</param>
            /// <param name="success" type="Function" mayBeNull="false" optional="false">Success</param>
            /// <param name="fail" type="Function" mayBeNull="false" optional="true">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'addItemsArguments', type: Array, elementType: Object, elementMayBeNull: false, optional: false, mayBeNull: false },
                                                            { name: 'webUrl', type: String, optional: false, mayBeNull: true },
                                                            { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                            { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);
            if (e) throw e;
            var ctx = (typeof webUrl === 'undefined' || webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            var fail = fail || function (err) { alert(err); };
            Shp.Lists._AddItemsInLists(addItemsArguments, ctx, success, fail);
        };


        Shp.Lists._AddItemsInLists = function (addItemsArguments, ctx, success, fail) {
            var results = {}, current, i, k;

            for (i = 0; i < addItemsArguments.length; i++) {

                current = addItemsArguments[i]; // Store current item

                // We check if list name property if defined before do other operations
                if (current.hasOwnProperty('listName') === true) {

                    if (results.hasOwnProperty(current.listName) === false) results[current.listName] = []; // Results object doesn't have a slot for current list name, create it
                    var oList = ctx.get_web().get_lists().getByTitle(current.listName);

                    // We check if list items property is an array
                    if (current.hasOwnProperty('listItems') === true) {
                        for (k = 0; k < current.listItems.length; k++) {
                            var listItem = current.listItems[k];
                            var oListItem = oList.addItem(new SP.ListItemCreationInformation());
                            for (var field in listItem) {
                                oListItem.set_item(field, listItem[field]);
                            }
                            oListItem.update();
                            ctx.load(oListItem);
                            results[current.listName].push(oListItem);
                        }
                    }
                }
            }

            ctx.executeQueryAsync(function () {
                success(results);
            }, function (sender, args) {
                fail(args.get_message());
            });

        };


        Shp.Lists._SyncAddItems = function (listName, listItems, ctx, web) {
            var results = [];
            var deferred = jQuery.Deferred();
            var oList = web.get_lists().getByTitle(listName);

            // Iterate through list items parameter array and build sharepoint list items
            for (var k = 0; k < listItems.length; k++) {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                var oListItem = oList.addItem(itemCreateInfo);
                var listItem = listItems[k];
                for (var field in listItem) {
                    oListItem.set_item(field, listItem[field]);
                }
                oListItem.update();
                ctx.load(oListItem);
                results.push(oListItem);
            }

            ctx.executeQueryAsync(function () {
                deferred.resolve(results);
            }, function (sender, args) {
                deferred.reject(args.get_message());
            });

            return deferred.promise();

        };




        Shp.Lists.GetList = function (listName, web) {
            /// <summary>Get list</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="web" type="SP.Web" optional="false" mayBeNull="false">List name</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'web', type: SP.Web, mayBeNull: false, optional: true }], true);

            if (e) throw e;

            var ctx = (arguments.length === 1) ? SP.ClientContext.get_current() : web.get_context();
            var web = (arguments.length === 1) ? ctx.get_web() : web;

            var oList;
            var deffered = Shp.Lists._GetList(listName, web, ctx);
            return deffered;
        };

        Shp.Lists._GetList = function (listName, web, ctx) {

            var deferred = jQuery.Deferred();
            var oList = web.get_lists().getByTitle(listName);
            var oContentTypes = oList.get_contentTypes();
            ctx.load(oList);
            ctx.load(oContentTypes);


            ctx.executeQueryAsync(function () {
                // Success
                deferred.resolve(oList, oContentTypes);

            }, function (sender, args) {
                // Fail
                deferred.reject(args.get_message());
            });


            return deferred.promise();
        };



        Shp.Lists.SyncCreateFolder = function (docLibrary, folderName) {
            /// <summary>Create folder in document library (sync operation)</summary>
            /// <param name="docLibrary" type="String" mayBeNull="false" optional="false">Document Library Name</param>
            /// <param name="folderName" type="String" mayBeNull="false" optional="false">Folder Name</param>
            /// <param name="fail" type="Function" mayBeNull="false" optional="true">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'docLibrary', type: String, mayBeNull: false, optional: false },
                                                             { name: 'folderName', type: String, mayBeNull: false, optional: false }], true);
            if (e) throw e;

            return Shp.Lists._SyncCreateFolder(docLibrary, folderName);

        };

        Shp.Lists._SyncCreateFolder = function (docLibrary, folderName) {

            var deferred = jQuery.Deferred();

            var ctx = SP.ClientContext.get_current();
            var oWeb = ctx.get_web();
            var oList = oWeb.get_lists().getByTitle(docLibrary);
            var itemCreateInfo = new SP.ListItemCreationInformation();
            itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
            itemCreateInfo.set_leafName(folderName);
            var oFolder = oList.addItem(itemCreateInfo);
            oFolder.update();
            ctx.load(oFolder);

            ctx.executeQueryAsync(function () {
                // Success
                deferred.resolve(oFolder);

            }, function (sender, args) {
                // Fail
                deferred.reject(sender, args);
            });

            return deferred.promise();

        };



        Shp.Lists.CreateFolder = function (listName, folderName, success, fail) {
            /// <summary>Create folder in document library</summary>
            /// <param name="listName" type="String" mayBeNull="false" optional="false">List Name</param>
            /// <param name="folderName" type="String" mayBeNull="false" optional="false">Folder Name</param>
            /// <param name="success" type="Function" mayBeNull="false" optional="false">Success</param>
            /// <param name="fail" type="Function" mayBeNull="false" optional="true">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                             { name: 'folderName', type: String, mayBeNull: false, optional: false },
                                                             { name: 'success', type: Function, mayBeNull: false, optional: false },
                                                             { name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            if (e) throw 'Shp.Lists.CreateFolder method was called with invalid parameters.';

            var fail = fail || function (err) {
                alert(err);
            };
            Shp.Lists._CreateFolder(listName, folderName, success, fail);
        };

        Shp.Lists._CreateFolder = function (listName, folderName, success, fail) {

            var ctx = SP.ClientContext.get_current();
            var oWeb = ctx.get_web();
            var oList = oWeb.get_lists().getByTitle(listName);
            var itemCreateInfo = new SP.ListItemCreationInformation();
            itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
            itemCreateInfo.set_leafName(folderName);
            var oFolder = oList.addItem(itemCreateInfo);
            oFolder.update();
            ctx.load(oFolder);


            ctx.executeQueryAsync(function () {
                success(oFolder);
            }, function (sender, args) {
                fail(args.get_message());
            });
        };


        Shp.Lists.GetAttachments = function (listName, itemId, webUrl, success, fail) {
            /// <summary>Get attachments for an item</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="itemId" type="Number" integer="true" optional="false" mayBeNull="false">List item</param>
            /// <param name="success" type="Function" optional="false" mayBeNull="false">Success</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'itemId', type: Number, integer: true, mayBeNull: false, optional: false },
                                                            { name: 'webUrl', type: String, mayBeNull: true, optional: false },
                                                            { name: 'success', type: Function, mayBeNull: false, optional: false },
                                                            { name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            if (e) throw 'Shp.Lists.GetAttachments was called with invalid parameters. ' + e;
            var fail = fail || (function (err) { alert(err); });
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);

            Shp.Lists._GetAttachments(listName, itemId, ctx, success, fail);
        };


        Shp.Lists._GetAttachments = function (listName, itemId, ctx, success, fail) {
            var oList = ctx.get_web().get_lists().getByTitle(listName);
            var oListItem = oList.getItemById(itemId);
            var files = oListItem.get_attachmentFiles();
            ctx.load(files);

            ctx.executeQueryAsync(function () {
                var results = [];
                for (var i = 0; i < files.get_count() ; i++) {
                    var file = files.itemAt(i);
                    results.push({ 'fileName': file.get_fileName(), 'serverRelativeUrl': file.get_serverRelativeUrl() });
                }
                success(results);
            }, function (sender, args) {
                fail(args.get_message());
            });
        };


        Shp.Lists.DeleteItem = function (listName, itemId, webUrl, success, fail) {
            /// <summary>Delete item from list based on specified id</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="itemId" type="Number" integer="true" optional="false" mayBeNull="false">List item</param>
            /// <param name="success" type="Function" optional="false" mayBeNull="false">Success</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'itemId', type: Number, integer: true, mayBeNull: false, optional: false },
                                                            { name: 'webUrl', type: String, mayBeNull: true, optional: false },
                                                            { name: 'success', type: Function, mayBeNull: false, optional: false },
                                                            { name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            if (e) throw 'Shp.Lists.DeleteItem was called with invalid parameters';

            var fail = fail || (function (err) { alert(err); });
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            Shp.Lists._DeleteItem(listName, itemId, ctx, success, fail);
        };

        Shp.Lists._DeleteItem = function (listName, itemId, ctx, success, fail) {
            var oList = ctx.get_web().get_lists().getByTitle(listName);
            var oListItem = oList.getItemById(itemId);
            oListItem.deleteObject();
            ctx.executeQueryAsync(function () { success(); }, function (sender, args) { fail(args.get_message()); });
        };


        Shp.Lists.UpdateItem = function (listName, listItem, webUrl, success, fail) {
            /// <summary>Update SharePoint list item</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="listItem" type="Object" optional="false" mayBeNull="false">List item</param>
            /// <param name="webUrl" type="String" optional="false" mayBeNull="true">Web Url</param>
            /// <param name="success" type="Function" optional="false" mayBeNull="false">Success</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'listItem', type: Object, mayBeNull: false, optional: false },
                                                            { name: 'webUrl', type: String, mayBeNull: true, optional: false },
                                                            { name: 'success', type: Function, mayBeNull: false, optional: false },
                                                            { name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            if (e) throw e;


            var fail = fail || function (message) { alert(message); };
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            Shp.Lists._UpdateItem(listName, listItem, ctx, success, fail);
        };


        Shp.Lists._UpdateItem = function (listName, listItem, ctx, success, fail) {

            var oList = ctx.get_web().get_lists().getByTitle(listName);
            var oListItem = oList.getItemById(parseInt(listItem['ID']));
            for (var field in listItem) {
                if (listItem.hasOwnProperty(field) === true && field !== 'ID') {
                    oListItem.set_item(field, listItem[field]);
                }
            }
            oListItem.update();
            ctx.load(oListItem);
            ctx.executeQueryAsync(function () { success(oListItem); }, function (sender, args) { fail(args.get_message()); });
        };



        Shp.Lists.SyncUpdateItem = function (listName, listItem) {
            /// <summary>Sync. update item operation</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="listItems" type="Object" optional="false" mayBeNull="false">List items</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'listItem', type: Object, mayBeNull: false, optional: false }], true);
            if (e) throw e;

            return Shp.Lists._SyncUpdateItem(listName, listItem);
        };


        Shp.Lists._SyncUpdateItem = function (listName, listItem) {

            var deferred = jQuery.Deferred();

            var ctx = SP.ClientContext.get_current();
            var oWeb = ctx.get_web();
            var oList = oWeb.get_lists().getByTitle(listName);
            var oListItem = oList.getItemById(parseInt(listItem['ID']));
            for (var field in listItem) {
                if (listItem.hasOwnProperty(field) === true && field !== 'ID') {
                    oListItem.set_item(field, listItem[field]);
                }
            }
            oListItem.update();
            ctx.load(oListItem);


            ctx.executeQueryAsync(function () {
                deferred.resolve(oListItem);
            }, function (sender, args) {
                alert(args.get_message());
                deferred.reject(sender, args);
            });

            return deferred.promise();
        };




        Shp.Lists.SyncAddItems = function (listName, listItems) {
            /// <summary>Add items to the list (sync operation)</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="listItems" type="Array" elementType="Object" elementMayBeNull="false" optional="false" mayBeNull="false">List items</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'listItems', type: Array, elementType: Object, elementMayBeNull: false, mayBeNull: false, optional: false }], true);

            var deferred = jQuery.Deferred();

            var ctx = SP.ClientContext.get_current();
            var oWeb = ctx.get_web();
            var oList = oWeb.get_lists().getByTitle(listName);
            var results = new Array();

            for (var k = 0; k < listItems.length; k++) {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                var oListItem = oList.addItem(itemCreateInfo);
                var listItem = listItems[k];
                for (var field in listItem) {
                    oListItem.set_item(field, listItem[field]);
                }
                oListItem.update();
                ctx.load(oListItem);
                results.push(oListItem);
            }

            ctx.executeQueryAsync(function () {
                deferred.resolve(results);
            }, function (sender, args) {
                alert(args.get_message());
                deferred.reject(sender, args);
            });

            return deferred.promise();
        };


        Shp.Lists.AddItem = function (listName, listItem, webUrl, success, fail) {
            /// <summary>Add item to the list</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="listItem" type="Object" optional="false" mayBeNull="false">List item</param>
            /// <param name="success" type="Function" optional="false" mayBeNull="false">Success</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'listItem', type: Object, mayBeNull: false, optional: false },
                                                            { name: 'webUrl', type: String, mayBeNull: true, optional: false },
                                                            { name: 'success', type: Function, mayBeNull: false, optional: false },
                                                            { name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            if (e) throw 'Shp.Lists.AddItem was called with invalid parameters';


            var fail = fail || function (err) { alert(err); };
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);

            Shp.Lists._AddItem(listName, listItem, ctx, success, fail);
        };

        Shp.Lists._AddItem = function (listName, listItem, ctx, success, fail) {

            var oWeb = ctx.get_web();
            var oList = oWeb.get_lists().getByTitle(listName);
            var itemCreateInfo = new SP.ListItemCreationInformation();
            var oListItem = oList.addItem(itemCreateInfo);

            for (var field in listItem) {
                if (listItem.hasOwnProperty(field) === true) {
                    oListItem.set_item(field, listItem[field]);
                }
            };

            oListItem.update();
            ctx.load(oListItem);

            ctx.executeQueryAsync(function () {
                success(oListItem);
            }, function (sender, args) {
                fail(args.get_message());

            });
        }




        Shp.Lists.GetItemById = function (listName, itemId, success, fail) {
            /// <summary>Get item by ID</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List item</param>
            /// <param name="itemId" type="Number" integer="true" optional="false" mayBeNull="false">Item ID</param>
            /// <param name="success" type="Function" optional="false" mayBeNull="false">Success</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'itemId', type: Number, integer: true, mayBeNull: false, optional: false },
                                                            { name: 'success', type: Function, mayBeNull: false, optional: false },
                                                            { name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            if (e) throw 'Shp.Lists.AddItem was called with invalid parameters';

            var fail = fail || function (message) {
                alert(message);
            };


            var ctx = SP.ClientContext.get_current();
            var oWeb = ctx.get_web();
            var oList = oWeb.get_lists().getByTitle(listName);
            var oListItem = oList.getItemById(itemId);
            ctx.load(oListItem);
            ctx.executeQueryAsync(function () {
                success(oListItem);
            }, function (sender, args) {
                fail(args.get_message());
            });
        };



        Shp.Lists.RecycleItems = function (listName, listItems, web, success, fail) {
            /// <signature>
            ///	    <summary>Recycle items from the list</summary>
            /// 	<param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// 	<param name="listItems" type="Array" elementType="Number" elementInteger="true" elementMayBeNull="false" optional="false" mayBeNull="false">List items</param>
            ///     <param name="web" type="SP.Web" optional="true" mayBeNull="false">Web</param>
            /// </signature>
            /// <signature>
            ///	    <summary>Recycle items from the list</summary>
            /// 	<param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// 	<param name="listItems" type="Array" elementType="Number" elementInteger="true" elementMayBeNull="false" optional="false" mayBeNull="false">List items</param>
            ///     <param name="web" type="SP.Web" optional="false" mayBeNull="true">Web</param>
            /// </signature> 

            var e1 = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
                                                           { name: 'listItems', type: Array, elementType: Number, elementInteger: true, elementMayBeNull: false, optional: false, mayBeNull: false },
                                                           { name: 'web', type: SP.Web, optional: true, mayBeNull: false }], true);

            var e2 = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
                                                             { name: 'listItems', type: Array, elementType: Number, elementInteger: true, elementMayBeNull: false, optional: false, mayBeNull: false },
                                                             { name: 'web', type: SP.Web, optional: false, mayBeNull: true },
                                                             { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                             { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);
            if (e1 !== null && e2 !== null) {
                throw e1 || e2;
            }

            var ctx = (typeof web === 'undefined' || web === null) ? SP.ClientContext.get_current() : web.get_context();
            var web = (typeof web === 'undefined' || web === null) ? ctx.get_web() : web;

            // Use deferred
            if (e1 === null) {
                return Shp.Lists._DefferedRecycleItems(listName, listItems, ctx, web);
            }

        }


        Shp.Lists._DefferedRecycleItems = function (listName, listItems, ctx, web) {
            var deferred = jQuery.Deferred();
            var oList = web.get_lists().getByTitle(listName);
            var recycledItems = [];

            for (var i = 0; i < listItems.length; i++) {
                var oListItem = oList.getItemById(listItems[i]);
                var recycleItem = oListItem.recycle();
                recycledItems.push(recycleItem);
            }

            ctx.executeQueryAsync(function () {
                Array.forEach(recycledItems, function (element, index, array) {
                    array[index] = element['m_value']['_m_guidString$p$0'];
                }, null);
                deferred.resolve(recycledItems);
            }, function (sender, args) {
                deferred.reject(args.get_message());
            });

            return deferred.promise();
        };


        Shp.Lists.GetItems = function (listName, webUrl, query, success, fail) {
            /// <summary>Get list items based on provided CAML query</summary>
            /// <param name="listName" type="String" optional="false" mayBeNull="false">List name</param>
            /// <param name="webUrl" type="String" optional="false" mayBeNull="true">Web URL</param>
            /// <param name="query" type="String" optional="false" mayBeNull="false">Query</param>
            /// <param name="success" type="Function" optional="false" mayBeNull="false">Success callback</param>
            /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail callback</param>
            var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                            { name: 'webUrl', type: String, mayBeNull: true, optional: false },
                                                            { name: 'query', type: String, mayBeNull: false, optional: false },
                                                            { name: 'success', type: Function, mayBeNull: false, optional: false },
                                                            { name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            if (e) throw e;

            var fail = fail || function (err) { alert(err); };
            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            var oList = ctx.get_web().get_lists().getByTitle(listName);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(query);
            var oListItems = oList.getItems(camlQuery);
            ctx.load(oListItems);

            ctx.executeQueryAsync(function () {
                success(oListItems);
            }, function (sender, args) {
                fail(args.get_message());
            });
        };


        Shp.Lists.GetItemsFromLists = function (getItemsArguments, webUrl, success, fail) {
            /// <summary>Get items from muultple lists execute query once</summary>
            /// <param name="getItemsArguments" type="Array" elementType="Object" elementMayBeNull="false" optional="false" mayBeNull="false">Get items arguments</param>
            /// <param name="webUrl" type="String" optional="false" mayBeNull="true">Web url</param>
            /// <param name="success" type="Function" mayBeNull="false" optional="false">Success method</param>
            /// <param name="fail" type="Function" mayBeNull="false" optional="true">Fail method<</param>
            var e = Function.validateParameters(arguments, [{ name: 'getItemsArguments', type: Array, elementType: Object, elementMayByNull: false, optional: false, mayBeNull: false },
                                                            { name: 'webUrl', type: String, optional: false, mayBeNull: true },
                                                            { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                            { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);
            if (e) throw e;

            var ctx = (webUrl === null) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            var fail = fail || function (err) { alert(err); };
            Shp.Lists._GetItemsFromLists(getItemsArguments, ctx, success, fail);
        };


        Shp.Lists._GetItemsFromLists = function (getItemsArguments, ctx, success, fail) {
            var results = {};
            for (var i = 0; i < getItemsArguments.length; i++) {
                if (getItemsArguments[i].hasOwnProperty('listName') === true && getItemsArguments[i].hasOwnProperty('query') === true) {
                    var listName = getItemsArguments[i].listName, query = getItemsArguments[i].query;
                    if (results.hasOwnProperty(listName) === false) {
                        var oList = ctx.get_web().get_lists().getByTitle(listName);
                        var camlQuery = new SP.CamlQuery();
                        camlQuery.set_viewXml(query);
                        var oListItems = oList.getItems(camlQuery);
                        if (getItemsArguments[i].hasOwnProperty('include') === true && isArray(getItemsArguments[i].include) === true) {
                            ctx.load(oListItems, 'Include(' + getItemsArguments[i].include.join(',') + ')');
                        }
                        else {
                            ctx.load(oListItems);
                        }
                        results[listName] = oListItems;
                    }
                    else {
                        continue;
                    }
                }
            }

            ctx.executeQueryAsync(function () {
                success(results);
            }, function (sender, args) {
                fail(args.get_message());
            });
        };


        Shp.Lists.GetItemsWithSpecificFields = function (listName, query, fields, success, fail) {
            /// <summary>Get list items based on provided CAML query</summary>
            /// <param name="listName">List name</param>
            /// <param name="query">Query</param>
            /// <param name="success">Success callback</param>
            /// <param name="fail">Fail callback</param>

            var e, async, deffered = jQuery.Deferred();

            /// Determine if operation is async
            e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
                                                        { name: 'query', type: String, mayBeNull: false, optional: false },
														{ name: 'fields', type: Array, mayBeNull: false, optional: false, elementType: String, elementMayNeNull: false },
                                                        { name: 'success', type: Function, mayBeNull: false, optional: false },
                                                        { name: 'fail', type: Function, mayBeNull: false, optional: true }], true);
            async = true;
            if (e) {
                // Validation of async parameters failed, we check if parameters are valid for a sync operation
                async = false;
                e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
														    { name: 'fields', type: Array, mayBeNull: false, optional: false, elementType: String, elementMayNeNull: false },
                                                            { name: 'query', type: String, mayBeNull: false, optional: false }], true);
                if (e) throw e;
            }


            var ctx = SP.ClientContext.get_current();
            var oWeb = ctx.get_web();
            var oList = oWeb.get_lists().getByTitle(listName);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(query);
            var oListItems = oList.getItems(camlQuery);
            ctx.load(oListItems, 'Include(' + fields.join(',') + ')');

            ctx.executeQueryAsync(function () {
                if (async === true) {
                    success(oListItems);
                }
                else {
                    deffered.resolve(oListItems);
                }
            }, function (sender, args) {
                if (async === true) {
                    var fail = fail || function (msg) {
                        alert(msg);
                    };
                    fail(args.get_message());
                }
                else {
                    deffered.resolve(sender, args);
                }
            });

            return deffered;

        };



        Shp.Lists.registerClass('Shp.Lists');


    }


    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, null, execute);
    }
    else {
        execute();
    }



})();
