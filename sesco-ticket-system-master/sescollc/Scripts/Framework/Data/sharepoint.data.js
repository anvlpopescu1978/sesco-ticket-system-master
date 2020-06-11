"use strict";

function _instanceof(left, right) {
    if (
        right != null &&
        typeof Symbol !== "undefined" &&
        right[Symbol.hasInstance]
    ) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

var $SPData =
    /*#__PURE__*/
    (function () {
        function $SPData() {
            _classCallCheck(this, $SPData);

            throw "$SPList is a static class and cannot be instantiated";
        }
        /**
         *
         * @param {string} listName
         * @param {string} fields
         * @param {string} webUrl
         */

        _createClass($SPData, null, [
            {
                key: "GetListFields",
                value: function GetListFields(listName, fields, webUrl) {
                    var e = Function.validateParameters(
                        arguments,
                        [
                            {
                                name: "listName",
                                type: String,
                                mayBeNull: false,
                                optional: false
                            },
                            {
                                name: "fields",
                                type: Array,
                                elementMayBeNull: false,
                                elementType: String,
                                mayBeNull: false,
                                optional: false
                            },
                            {
                                name: "webUrl",
                                type: String,
                                mayBeNull: false,
                                optional: true
                            }
                        ],
                        true
                    );
                    if (e) throw e;
                    var args_length = arguments.length;
                    var promise = new Promise(function (resolve, reject) {
                        var ctx =
                            args_length === 2
                                ? SP.ClientContext.get_current()
                                : new SP.ClientContext(webUrl);
                        var oFields = {};
                        var oList = ctx
                            .get_web()
                            .get_lists()
                            .getByTitle(listName);

                        for (var i = 0; i < fields.length; i++) {
                            var oField = oList
                                .get_fields()
                                .getByInternalNameOrTitle(fields[i]);
                            ctx.load(oField);
                            oFields[fields[i]] = oField;
                        }

                        ctx.executeQueryAsync(
                            function () {
                                resolve(oFields);
                            },
                            function (sender, args) {
                                reject(args.get_message());
                            }
                        );
                    });
                    return promise;
                }
            },
            {
                key: "readFileAsync",
                value: function readFileAsync(file) {
                    return new Promise(function (resolve, reject) {
                        var reader = new FileReader();

                        reader.onload = function () {
                            resolve(reader.result);
                        };

                        reader.onerror = reject;
                        reader.readAsArrayBuffer(file);
                    });
                }
            },
            {
                key: "AddAttachments",

                /**
                 *
                 * @param {String} listName
                 * @param {any} itemId
                 * @param {any} fileInput
                 * @param {String} webUrl
                 */
                value: function AddAttachments(
                    listName,
                    itemId,
                    fileInputs,
                    success,
                    fail
                ) {
                    var e = Function.validateParameters(
                        arguments,
                        [
                            {
                                name: "listName",
                                type: String,
                                optional: false,
                                mayBeNull: false
                            },
                            {
                                name: "itemId",
                                type: String,
                                optional: false,
                                mayBeNull: false
                            },
                            {
                                name: "fileInputs",
                                type: Array,
                                elementType: HTMLElement,
                                optional: false,
                                mayBeNull: false
                            }
                        ],
                        true
                    );
                    if (e) throw e;
                    var promises = [];

                    for (var i = 0; i < fileInputs.length; i++) {
                        promises.push($SPData.readFile(fileInputs, listName, itemId));
                    }

                    Promise.all(
                        promises,
                        function (values) {
                            success(values);
                        },
                        function (err) {
                            fail(err);
                        }
                    );
                }
                /**
                 *
                 * @param {String} listName
                 * @param {String} listItems
                 * @param {String} webUrl
                 */
            },
            {
                key: "UpdateItems",
                value: function UpdateItems(listName, listItems, webUrl) {
                    var e = Function.validateParameters(
                        arguments,
                        [
                            {
                                name: "listName",
                                type: String,
                                mayBeNull: false,
                                optional: false
                            },
                            {
                                name: "listItems",
                                type: Array,
                                elementType: Object,
                                elementMayBeNull: false,
                                mayBeNull: false,
                                optional: false
                            },
                            {
                                name: "webUrl",
                                type: String,
                                mayBeNull: false,
                                optional: true
                            }
                        ],
                        true
                    );
                    if (e) throw e;
                    var args_length = arguments.length;
                    var promise = new Promise(function (resolve, reject) {
                        var ctx =
                            args_length === 2
                                ? SP.ClientContext.get_current()
                                : new SP.ClientContext(webUrl);
                        var oListItems = [];
                        var oList = ctx
                            .get_web()
                            .get_lists()
                            .getByTitle(listName);

                        for (var k = 0; k < listItems.length; k++) {
                            var listItem = listItems[k];
                            var oListItem = oList.getItemById(parseInt(listItem["ID"]));

                            for (var field in listItem) {
                                if (listItem.hasOwnProperty(field) === true && field !== "ID") {
                                    oListItem.set_item(field, listItem[field]);
                                }
                            }

                            oListItem.update();
                            ctx.load(oListItem);
                            oListItems.push(oListItem);
                        }

                        ctx.executeQueryAsync(
                            function () {
                                resolve(oListItems);
                            },
                            function (sender, args) {
                                reject(args.get_message());
                            }
                        );
                    });
                    return promise;
                }
            },
            {
                key: "UpdateItem",
                value: function UpdateItem(listName, listItem, webUrl) {
                    var e = Function.validateParameters(
                        arguments,
                        [
                            {
                                name: "listName",
                                type: String,
                                mayBeNull: false,
                                optional: false
                            },
                            {
                                name: "listItem",
                                type: Object,
                                optional: false,
                                mayBeNull: false
                            },
                            {
                                name: "webUrl",
                                type: String,
                                optional: true,
                                mayBeNull: false
                            }
                        ],
                        true
                    );
                    if (e) throw e;
                    var args_length = arguments.length;
                    var promise = new Promise(function (resolve, reject) {
                        var ctx =
                            args_length === 2
                                ? SP.ClientContext.get_current()
                                : new SP.ClientContext(webUrl);
                        var oList = ctx
                            .get_web()
                            .get_lists()
                            .getByTitle(listName);
                        var oListItem = oList.getItemById(parseInt(listItem["ID"]));

                        for (var field in listItem) {
                            if (listItem.hasOwnProperty(field) === true && field !== "ID") {
                                oListItem.set_item(field, listItem[field]);
                            }
                        }

                        oListItem.update();
                        ctx.load(oListItem);
                        ctx.executeQueryAsync(
                            function () {
                                resolve(oListItem);
                            },
                            function (sender, args) {
                                reject(args.get_message());
                            }
                        );
                    });
                    return promise;
                }
                /**
                 *
                 * @param {any} listName
                 * @param {any} listItem
                 * @param {any} webUrl
                 */
            },
            {
                key: "AddItem",
                value: function AddItem(listName, listItem, webUrl) {
                    var e = Function.validateParameters(
                        arguments,
                        [
                            {
                                name: "listName",
                                type: String,
                                mayBeNull: false,
                                optional: false
                            },
                            {
                                name: "listItem",
                                type: Object,
                                optional: false,
                                mayBeNull: false
                            },
                            {
                                name: "webUrl",
                                type: String,
                                optional: true,
                                mayBeNull: false
                            }
                        ],
                        true
                    );
                    if (e) throw e;
                    var args_length = arguments.length;
                    var promise = new Promise(function (resolve, reject) {
                        var ctx =
                            args_length === 2
                                ? SP.ClientContext.get_current()
                                : new SP.ClientContext(webUrl);
                        var oList = ctx
                            .get_web()
                            .get_lists()
                            .getByTitle(listName);
                        var itemCreateInfo = new SP.ListItemCreationInformation();
                        var oListItem = oList.addItem(itemCreateInfo);

                        for (var field in listItem) {
                            oListItem.set_item(field, listItem[field]);
                        }

                        oListItem.update();
                        ctx.load(oListItem);
                        ctx.executeQueryAsync(
                            function (sender, args) {
                                resolve(oListItem);
                            },
                            function (sender, args) {
                                reject(args.get_message());
                            }
                        );
                    });
                    return promise;
                }
                /**
                 *
                 * @param {string} listName
                 * @param {Array} listItems
                 * @param {string} webUrl
                 */
            },
            {
                key: "AddItems",
                value: function AddItems(listName, listItems, webUrl) {
                    var e = Function.validateParameters(
                        arguments,
                        [
                            {
                                name: "listName",
                                type: String,
                                mayBeNull: false,
                                optional: false
                            },
                            {
                                name: "listItems",
                                type: Array,
                                optional: false,
                                mayBeNull: false
                            },
                            {
                                name: "webUrl",
                                type: String,
                                optional: true,
                                mayBeNull: false
                            }
                        ],
                        true
                    );
                    if (e) throw e;
                    var args_length = arguments.length;
                    var promise = new Promise(function (resolve, reject) {
                        var results = [];
                        var ctx =
                            args_length === 2
                                ? SP.ClientContext.get_current()
                                : new SP.ClientContext(webUrl);
                        var oList = ctx
                            .get_web()
                            .get_lists()
                            .getByTitle(listName);

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

                        ctx.executeQueryAsync(
                            function (sender, args) {
                                resolve(results);
                            },
                            function (sender, args) {
                                reject(args.get_message());
                            }
                        );
                    });
                    return promise;
                }
                /**
                 * Get list items
                 * @param {string} listName
                 * @param {string} camlQuery
                 * @param {string} webUrl
                 * @param {Function} resolve
                 * @param {Function} reject
                 */
            },
            {
                key: "GetListItems",
                value: function GetListItems(listName, caml, webUrl) {
                    var e = Function.validateParameters(
                        arguments,
                        [
                            {
                                name: "listName",
                                type: String,
                                mayBeNull: false,
                                optional: false
                            },
                            {
                                name: "caml",
                                type: String,
                                mayBeNull: false,
                                optional: false
                            },
                            {
                                name: "webUrl",
                                type: String,
                                mayBeNull: false,
                                optional: true
                            }
                        ],
                        true
                    );
                    if (e) throw e;
                    var promise = new Promise(function (resolve, reject) {
                        var ctx =
                            arguments.length === 2
                                ? SP.ClientContext.get_current()
                                : new SP.ClientContext(webUrl);
                        var oList = ctx
                            .get_web()
                            .get_lists()
                            .getByTitle(listName);
                        var camlQuery = new SP.CamlQuery();
                        camlQuery.set_viewXml(caml);
                        var oListItems = oList.getItems(camlQuery);
                        ctx.load(oListItems);
                        ctx.executeQueryAsync(
                            function () {
                                resolve(oListItems);
                            },
                            function (sender, args) {
                                reject(args.get_message());
                            }
                        );
                    });
                    return promise;
                }
            }
        ]);

        return $SPData;
    })();

_defineProperty($SPData, "DeleteItem", function (listName, itemId, webUrl) {
    var args_length = arguments.length;
    var promise = new Promise(function (resolve, reject) {
        var ctx =
            args_length === 2
                ? SP.ClientContext.get_current()
                : new SP.ClientContext(webUrl);
        var oList = ctx
            .get_web()
            .get_lists()
            .getByTitle(listName);
        var oListItem = oList.getItemById(itemId);
        oListItem.deleteObject();
        ctx.executeQueryAsync(
            function () {
                resolve();
            },
            function (sender, args) {
                reject(args.get_message());
            }
        );
    });
    return promise;
});

_defineProperty($SPData, "DeleteAttachments", function (
    listName,
    itemId,
    files,
    webUrl
) {
    var e = Function.validateParameters(
        arguments,
        [
            {
                name: "listName",
                type: String,
                optional: false,
                mayBeNull: false
            },
            {
                name: "itemId",
                type: String,
                optional: false,
                mayBeNull: false
            },
            {
                name: "files",
                type: Array,
                optional: false,
                mayBeNull: false,
                elementType: String,
                elementMayBeNull: false
            },
            {
                name: "webUrl",
                type: String,
                optional: true,
                mayBeNull: false
            }
        ],
        true
    );
    if (e) throw e;
    var args_length = arguments.length;
    var promise = new Promise(function (resolve, reject) {
        var ctx =
            args_length === 3
                ? SP.ClientContext.get_current()
                : new SP.ClientContext(webUrl);
        var oList = ctx
            .get_web()
            .get_lists()
            .getByTitle(listName);
        var oItem = oList.getItemById(itemId);

        for (var n = 0; n < files.length; n++) {
            var file = files[n];
            var attachment = oItem.get_attachmentFiles().getByFileName(file);
            attachment.deleteObject();
        }

        ctx.executeQueryAsync(
            function () {
                resolve();
            },
            function (sender, args) {
                reject(args.get_message());
            }
        );
    });
    return promise;
});

_defineProperty($SPData, "GetAttachments", function (listName, itemId, webUrl) {
    return new Promise(function (resolve, reject) {
        var args_length = arguments.length;
        var ctx =
            args_length === 2
                ? SP.ClientContext.get_current()
                : new SP.ClientContext(webUrl);
        var oList = ctx
            .get_web()
            .get_lists()
            .getByTitle(listName);
        var oListItem = oList.getItemById(itemId);
        var files = oListItem.get_attachmentFiles();
        ctx.load(files);
        ctx.executeQueryAsync(
            function (sender, args) {
                if (files.get_count() === 0) {
                    resolve(new Array());
                    return;
                }

                var results = [];

                for (var i = 0; i < files.get_count(); i++) {
                    var file = files.itemAt(i);
                    results.push({
                        fileName: file.get_fileName(),
                        serverRelativeUrl: file.get_serverRelativeUrl()
                    });
                    resolve(results);
                }
            },
            function (sender, args) {
                reject(args.get_message());
            }
        );
    });
});

_defineProperty($SPData, "add_file", function (
    listName,
    itemId,
    fileContent,
    fileName,
    webUrl
) {
    return new Promise(function (resolve, reject) {
        var executor = new SP.RequestExecutor(webUrl);
        executor.executeAsync({
            url:
                webUrl +
                "/_api/web/lists/GetByTitle('" +
                listName +
                "')/items(" +
                itemId +
                ")/AttachmentFiles/add(FileName='" +
                fileName +
                "')",
            method: "POST",
            binaryStringRequestBody: true,
            body: fileContent,
            state: "Update",
            success: function success() {
                resolve(itemId);
            },
            fail: function fail(data) {
                reject(data.responseText);
            }
        });
    });
});

_defineProperty($SPData, "_readFile", function (fileInput) {
    var parts = "";
    var fileName = "";
    var promise = new Promise(function (resolve, reject) {
        var reader = new FileReader();

        reader.onload = function (e) {
            resolve(e.target.result);
        };

        reader.onerror = function (e) {
            reject(e.target.error);
        };

        reader.readAsBinaryString(fileInput.files[0]);
    });
    return promise;
});

_defineProperty($SPData, "readFile", function (fileInput, listName, itemId) {
    var parts = fileInput.value.split("\\");
    var fileName = parts[parts.length - 1];
    var promise = new Promise(function (resolve, reject) {
        var executor = new SP.RequestExecutor(webUrl);
        executor.executeAsync({
            url:
                _spPageContextInfo.webAbsoluteUrl +
                "/_api/web/lists/GetByTitle('" +
                listName +
                "')/items(" +
                itemId +
                ")/AttachmentFiles/add(FileName='" +
                fileName +
                "')",
            method: "POST",
            binaryStringRequestBody: true,
            body: fileContent,
            state: "Update",
            success: function success() {
                resolve(itemId);
            },
            fail: function fail(data) {
                reject(data.responseText);
            }
        });
    });
    return promise;
});
