'use strict';

class $SPData {

    constructor() {
        throw '$SPList is a static class and cannot be instantiated';
    }


    /**
  * 
  * @param {string} listName
  * @param {string} fields
  * @param {string} webUrl
  */
    static GetListFields(listName, fields, webUrl) {
        let e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
        { name: 'fields', type: Array, elementMayBeNull: false, elementType: String, mayBeNull: false, optional: false },
        { name: 'webUrl', type: String, mayBeNull: false, optional: true }], true);
        if (e) throw e;

        let args_length = arguments.length;
        let promise = new Promise(function (resolve, reject) {
            let ctx = args_length === 2 ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            let oFields = {}
            let oList = ctx.get_web().get_lists().getByTitle(listName);
            for (let i = 0; i < fields.length; i++) {
                let oField = oList.get_fields().getByInternalNameOrTitle(fields[i]);
                ctx.load(oField);
                oFields[fields[i]] = oField;
            }

            ctx.executeQueryAsync(function () {
                resolve(oFields);
            }, function (sender, args) {
                reject(args.get_message());
            });
        });

        return promise;
    }

    
    static DeleteItem = function (listName, itemId, webUrl) {

        let args_length = arguments.length;
        let promise = new Promise(function (resolve, reject) {
            let ctx = (args_length === 2) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            let oList = ctx.get_web().get_lists().getByTitle(listName);
            let oListItem = oList.getItemById(itemId);
            oListItem.deleteObject();
            ctx.executeQueryAsync(function () {
                resolve();
            }, function (sender, args) {
                reject(args.get_message());
            });
        });

        return promise;
    };

    static DeleteAttachments = function (listName, itemId, files, webUrl) {
        let e = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
        { name: 'itemId', type: String, optional: false, mayBeNull: false },
        { name: 'files', type: Array, optional: false, mayBeNull: false, elementType: String, elementMayBeNull: false },
        { name: 'webUrl', type: String, optional: true, mayBeNull: false }], true);
        if (e) throw e;

        let args_length = arguments.length;
        let promise = new Promise(function (resolve, reject) {
            let ctx = (args_length === 3) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            let oList = ctx.get_web().get_lists().getByTitle(listName);
            let oItem = oList.getItemById(itemId);
            for (let n = 0; n < files.length; n++) {
                let file = files[n];
                let attachment = oItem.get_attachmentFiles().getByFileName(file);
                attachment.deleteObject();
            }

            ctx.executeQueryAsync(function () {
                resolve();
            }, function (sender, args) {
                reject(args.get_message());
            });
        });
        return promise;
    }

    static GetAttachments = function (listName, itemId, webUrl) {

        return new Promise(function (resolve, reject) {
            let args_length = arguments.length;
            let ctx = args_length === 2 ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            let oList = ctx.get_web().get_lists().getByTitle(listName);
            let oListItem = oList.getItemById(itemId);
            let files = oListItem.get_attachmentFiles();
            ctx.load(files);

            ctx.executeQueryAsync(function (sender, args) {
                if (files.get_count() === 0) {
                    resolve(new Array());
                    return;
                }
                var results = [];
                for (let i = 0; i < files.get_count(); i++) {
                    let file = files.itemAt(i);
                    results.push({ 'fileName': file.get_fileName(), 'serverRelativeUrl': file.get_serverRelativeUrl() });
                    resolve(results);
                }
            }, function (sender, args) {
                reject(args.get_message());
            });
        });
    }

    static readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }


    static add_file = function (listName, itemId, fileContent, fileName, webUrl) {
        return new Promise(function (resolve, reject) {
            let executor = new SP.RequestExecutor(webUrl);
            executor.executeAsync({
                url: webUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items(" + itemId + ")/AttachmentFiles/add(FileName='" + fileName + "')",
                method: "POST",
                binaryStringRequestBody: true,
                body: fileContent,
                state: "Update",
                success: function () {
                    resolve(itemId);
                },
                fail: function (data) {
                    reject(data.responseText);
                }
            });
        });
    }

    /**
     * 
     * @param {HTMLElement} fileInput
     */
    static _readFile = function (fileInput) {
        let parts = '';
        let fileName = '';
        let promise = new Promise(function (resolve, reject) {
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
    }

    static readFile = function (fileInput, listName, itemId) {
        let parts = fileInput.value.split("\\");
        let fileName = parts[parts.length - 1];
        let promise = new Promise(function (resolve, reject) {
            let executor = new SP.RequestExecutor(webUrl);
            executor.executeAsync({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items(" + itemId + ")/AttachmentFiles/add(FileName='" + fileName + "')",
                method: "POST",
                binaryStringRequestBody: true,
                body: fileContent,
                state: "Update",
                success: function () {
                    resolve(itemId);
                },
                fail: function (data) {
                    reject(data.responseText);
                }
            });
        });
        return promise;
    }

    /**
     * 
     * @param {String} listName
     * @param {any} itemId
     * @param {any} fileInput
     * @param {String} webUrl
     */
    static AddAttachments(listName, itemId, fileInputs, success, fail) {
        var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, optional: false, mayBeNull: false },
        { name: 'itemId', type: String, optional: false, mayBeNull: false },
        { name: 'fileInputs', type: Array, elementType:  HTMLElement, optional: false, mayBeNull: false }], true);
        if (e) throw e;

        let promises = [];
        for (let i = 0; i < fileInputs.length; i++) {
            promises.push($SPData.readFile(fileInputs, listName, itemId));
        }

        Promise.all(promises, function (values) {
            success(values);
        }, function (err) {
            fail(err);
        });
    }

    /**
     * 
     * @param {String} listName
     * @param {String} listItems
     * @param {String} webUrl
     */
    static UpdateItems(listName, listItems, webUrl) {
        var e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
        { name: 'listItems', type: Array, elementType: Object, elementMayBeNull: false, mayBeNull: false, optional: false },
        { name: 'webUrl', type: String, mayBeNull: false, optional: true }], true);
        if (e) throw e;

        let args_length = arguments.length;
        let promise = new Promise(function (resolve, reject) {
            let ctx = args_length === 2 ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            let oListItems = [];
            let oList = ctx.get_web().get_lists().getByTitle(listName);
            for (let k = 0; k < listItems.length; k++) {
                let listItem = listItems[k];
                let oListItem = oList.getItemById(parseInt(listItem['ID']));
                for (let field in listItem) {
                    if (listItem.hasOwnProperty(field) === true && field !== 'ID') {
                        oListItem.set_item(field, listItem[field]);
                    }
                }
                oListItem.update();
                ctx.load(oListItem);
                oListItems.push(oListItem);
            }

            ctx.executeQueryAsync(function () {
                resolve(oListItems);
            }, function (sender, args) {
                reject(args.get_message());
            });
        });

        return promise;
    }


    static UpdateItem(listName, listItem, webUrl) {
        let e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
        { name: 'listItem', type: Object, optional: false, mayBeNull: false },
        { name: 'webUrl', type: String, optional: true, mayBeNull: false }], true);
        if (e) throw e;

        let args_length = arguments.length;
        let promise = new Promise(function (resolve, reject) {
            let ctx = (args_length === 2) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            let oList = ctx.get_web().get_lists().getByTitle(listName);
            var oListItem = oList.getItemById(parseInt(listItem['ID']))
            for (var field in listItem) {
                if (listItem.hasOwnProperty(field) === true && field !== 'ID') {
                    oListItem.set_item(field, listItem[field]);
                }
            }
            oListItem.update();
            ctx.load(oListItem);


            ctx.executeQueryAsync(function () {
                resolve(oListItem);
            }, function (sender, args) {
                reject(args.get_message());
            });
        });
        return promise;
    }

    /**
     * 
     * @param {any} listName
     * @param {any} listItem
     * @param {any} webUrl
     */
    static AddItem(listName, listItem, webUrl) {
        let e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
            { name: 'listItem', type: Object, optional: false, mayBeNull: false },
        { name: 'webUrl', type: String, optional: true, mayBeNull: false }], true);
        if (e) throw e;

        let args_length = arguments.length;
        let promise = new Promise(function (resolve, reject) {
            let ctx = (args_length === 2) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            let oList = ctx.get_web().get_lists().getByTitle(listName);
            let itemCreateInfo = new SP.ListItemCreationInformation();
            let oListItem = oList.addItem(itemCreateInfo);
            for (let field in listItem) {
                oListItem.set_item(field, listItem[field]);
            }
            oListItem.update();
            ctx.load(oListItem);

            ctx.executeQueryAsync(function (sender, args) {
                resolve(oListItem);
            }, function (sender, args) {
                reject(args.get_message());
            });
        });

        return promise;
    }
    

    /**
     * 
     * @param {string} listName
     * @param {Array} listItems
     * @param {string} webUrl
     */
    static AddItems(listName, listItems, webUrl) {
        let e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
            { name: 'listItems', type: Array, optional: false, mayBeNull: false },
            { name: 'webUrl', type: String, optional: true, mayBeNull: false }], true);
        if (e) throw e;

        let args_length = arguments.length;
        let promise = new Promise(function (resolve, reject) {
            let results = [];
            let ctx = (args_length === 2) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            let oList = ctx.get_web().get_lists().getByTitle(listName);
            for (let k = 0; k < listItems.length; k++) {
                let itemCreateInfo = new SP.ListItemCreationInformation();
                let oListItem = oList.addItem(itemCreateInfo);
                let listItem = listItems[k];
                for (let field in listItem) {
                    oListItem.set_item(field, listItem[field]);
                }
                oListItem.update();
                ctx.load(oListItem);
                results.push(oListItem);
            }
            ctx.executeQueryAsync(function (sender, args) {
                resolve(results);
            }, function (sender, args) {
                reject(args.get_message());
            });
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
    static GetListItems(listName, caml, webUrl) {
        let e = Function.validateParameters(arguments, [{ name: 'listName', type: String, mayBeNull: false, optional: false },
            { name: 'caml', type: String, mayBeNull: false, optional: false },
            { name: 'webUrl', type: String, mayBeNull: false, optional: true }], true);
        if (e) throw e;

       
        let promise = new Promise(function (resolve, reject) {
            let ctx = (arguments.length === 2) ? SP.ClientContext.get_current() : new SP.ClientContext(webUrl);
            let oList = ctx.get_web().get_lists().getByTitle(listName);
            let camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(caml);
            let oListItems = oList.getItems(camlQuery);
            ctx.load(oListItems);
            ctx.executeQueryAsync(function () {
                resolve(oListItems);
            }, function (sender, args) {
                reject(args.get_message());
            });
        });
        return promise;
    } 

}






   




