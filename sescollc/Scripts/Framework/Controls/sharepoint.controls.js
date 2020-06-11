
(function () {

    var scriptName = 'ClientControls';



    function execute() {


        if (typeof ("Sys") !== "undefined") {

            // We add Chrome in browser identification
            Sys.Browser.Chrome = {};
            var a = navigator.userAgent.toLowerCase();
            if (a.toLowerCase().indexOf("chrome") != -1) {
                Sys.Browser.agent = Sys.Browser.Chrome;
                Sys.Browser.version = parseInt(a.substring(a.indexOf("chrome/") + 7));
                Sys.Browser.name = "Chrome";
            }
        }

        // Creating class 'Shp'
        Type.registerNamespace('Shp');


        Shp.DefferExecution = function () {

            Shp.DefferExecution.initializeBase(this);
            this._interval = 100;
            this._timer = null;
            this._conditionCheck = null;
        }

        //Creating inheritances here 
        Shp.DefferExecution.prototype = {

            initialize: function () {
                /// <summary>Initialize DeffereExecution Ajax client control</summary>
                Shp.DefferExecution.callBaseMethod(this, 'initialize');
                this._startTimer();
            },

            dispose: function () {
                /// <summary>Dispose DeffereExecution Ajax client control</summary>
                Shp.DefferExecution.callBaseMethod(this, 'dispose');
            },

            add_onConditionChecked: function (handler) {
                /// <summary>Add handler to be executed when condition is true</summary>
                /// <param name="handler" type="Function" mayBeNull="false" optional="false">Handler</param>
                var e = Function.validateParameters(arguments, [{ name: 'handler', type: Function, mayBeNull: false, optional: false }], true);
                if (e) throw e;

                this.get_events().addHandler("onConditionChecked", handler);
            },

            remove_onConditionChecked: function () {
                /// <summary>Removed condition checked handler</summary>
                this.get_events().removeHandler("onConditionChecked", handler);
                return this;
            },

            set_conditionCheck: function (conditionCheckFunction) {
                /// <summary>Set function to check condition. Should return true or false.</summary>
                /// <param name="conditionCheckFunction" type="Function" mayBeNull="false" optional="false">Handler</param>
                var e = Function.validateParameters(arguments, [{ name: 'conditionCheckFunction', type: Function, mayBeNull: false, optional: false }], true);
                if (e) throw e;

                this._conditionCheck = conditionCheckFunction;
                return this;
            },

            get_conditionCheck: function () {
                this._conditionCheck = function () {
                    return false;
                }
            },

            get_interval: function () {
                return this._interval;
            },

            set_interval: function (interval) {
                this._interval = interval;
                return this;
            },

            _startTimer: function () {
                var instance = this;
                var interval = instance._interval;
                var fx = function () {
                    if (instance._conditionCheck() == true) {
                        var handler = instance.get_events().getHandler("onConditionChecked");
                        handler();
                    }
                    else {
                        instance._timer = window.setTimeout(function () { fx(); }, interval);
                    }
                }

                fx();

            },

        }

        Shp.DefferExecution.registerClass('Shp.DefferExecution', Sys.Component);


        Shp.Page = function () {
            /// <summary>Shp.Page static class</summary>
            throw 'Cannot instantiantiate Shp.Page static class.';
        }


        Shp.Page.GetParameterFromUrl = function (qs) {
            /// <summary>Get parameter from url</summary>
            /// <param name="qs" type="String" mayBeNull="false" optional="false">Query string parameter</param>
            /// <returns type="String" />
            var e = Function.validateParameters(arguments, [{ name: 'qs', type: String, mayBeNull: false, optional: false }], true);
            if (e) throw e;
            return Shp.Page._GetParameterFromUrl(qs);
        }

        Shp.Page.GetPathName = function () {
            JSRequest.EnsureSetup();
            return JSRequest['PathName'];
        }

        Shp.Page.GetFileName = function () {
        }


        Shp.Page._GetParameterFromUrl = function (qs) {
            JSRequest.EnsureSetup();
            var param = (typeof JSRequest.QueryString[qs] === 'undefined') ? '' : JSRequest.QueryString[qs];
            return unescapeProperly(param);
        }


        Shp.Page.registerClass('Shp.Page');


        // Register client object namespace
        Type.registerNamespace('Shp.ClientObjects');


        Shp.ClientObjects.User = function (entity) {
            /// <summary>Create an instance of Shp.ClientObjects.User class</summary>
            /// <param name="entity" type="Object" mayBeNull="true" optional="false">User entity</param>
            var e = Function.validateParameters(arguments, [{ name: 'entity', type: Object, mayBeNull: true, optional: false }], true);
            if (e) throw e;

            this._entity = entity;
        }


        Shp.ClientObjects.User.prototype = {

            get_email: function () {
                /// <summary>Get user email</summary>
                /// <returnts type="String" />
                var email = (this._entity === null) ? '' : this._entity['EntityData']['Email'];
                return email;
            },

            get_loginName: function () {
                var logineName = (this._entity === null) ? '' : this.get_user()['$2e_1'];
                return logineName;
            },

            get_title: function () {
                var title = (this._entity === null) ? '' : this._entity['EntityData']['Title'];
                return title;
            },

            get_key: function () {
                /// <summary>Get user key</summary>
                /// <returnts type="String" />
            },

            get_user: function () {
                /// <summary>Get user object</summary>
                /// <returnts type="Object" />
                var user = (this._entity === null) ? null : SP.FieldUserValue.fromUser(this._entity['Key']);
                return user;
            }
        }

        Shp.ClientObjects.User.registerClass('Shp.ClientObjects.User');

        Type.registerNamespace('Shp.Controls');


        Shp.Controls.NullControl = function () {
            /// <summary>Create an instance of null control class (returned when selector doesn't find the client control in the mark-up)</summary>
        }

        Shp.Controls.NullControl.prototype = {


            get_date: function () {
                return null;
            },

            get_value: function () {
                /// <summary>Return an empty string, respresenting the control value</summary>
                return '';
            },

            get_text: function () {
                /// <summary>Return an empty string, respresenting the control text</summary>
                return '';
            },

            get_lookupIds: function () {
                return '';
            },

            get_lookupValue: function () {
                return '';
            },

            get_account: function () {
                return '';
            },

            get_displayedName: function () {
                return '';
            },

            get_optionsAsText: function () {
                return '';
            },

            set_value: function () {
            },

            get_allUserInfo: function () {
                return null;
            },

            get_email: function () {
                return '';
            },

            check_validity: function() {
                return true;
            }
        }

        Shp.Controls.NullControl.registerClass('Shp.Controls.NullControl');


        Shp.Controls.ClientPeoplePicker = function (ctl) {
            /// <summary>Create an instance of Shp.Controls.ClientPeoplePicker class</summary>

            Shp.Controls.ClientPeoplePicker.initializeBase(this)
            this._ctl = ctl;
        }


        Shp.Controls.ClientPeoplePicker.prototype = {

            get_allUserInfo: function () {
                return this._ctl.GetAllUserInfo();
            },

            get_users: function () {
                /// <summary>Get users collection</summary>
                /// <returns type="Array" elementType="Shp.ClientObjects.User" elementMayBeNull="false" />
                var users = [];
                var d = this._ctl.GetAllUserInfo();
                for (var k = 0; k < d.length; k++) {
                    users.push(new Shp.ClientObjects.User(d[k]));
                }

                if (users.length === 0) {
                    users.push(new Shp.ClientObjects.User(null));
                }
                return users;
            }
        }

        Shp.Controls.ClientPeoplePicker.registerClass('Shp.Controls.ClientPeoplePicker', Shp.Controls.NullControl);

        Shp.Controls.TextBox = function (element) {
            /// <summary>Create an instance of Shp.Controls.TextBox class</summary>
            /// <param name="element" domElement="true" mayBeNull="false" optional="false">element</param>
            var e = Function.validateParameters(arguments, [{ name: 'element', domElement: true, mayBeNull: false, optional: false }], true);
            if (e) throw e;

            Shp.Controls.TextBox.initializeBase(this)
            this._element = element;
        }

        Shp.Controls.TextBox.prototype = {

            get_value: function () {
                /// <summary>Get value for current textbox control</summary>
                /// <returns type="String" />
                return this._element.value.toString().trim();
            },

            get_date: function (format) {
                var val = this.get_value();
                if (val === '') {
                    return null;
                }

                return Date.parseInvariant(val, format).format('yyyy-MM-ddThh:mm:ssZ');
            },

            set_value: function (val) {
                /// <summary>Set value for current textbox control</summary>
                /// <param name="val" type="String" mayBeNull="true" optional"false"></param>
                /// <returns type="Shp.Controls.TextBox" />
                var e = Function.validateParameters(arguments, [{ name: 'val', type: String, mayBeNull: true, optional: false }], true);
                if (e) throw e;

                var val = (val === null) ? '' : val;
                var instance = this;
                instance._element.value = val.trim();

                return instance;
            },

            check_validity: function () {
                return this._element.checkValidity();
            }

        }

        Shp.Controls.TextBox.registerClass('Shp.Controls.TextBox', Shp.Controls.NullControl);


        Shp.Controls.Tel = function (element) {
            /// <summary>Create an instance of Shp.Controls.Tel class</summary>
            /// <param name="element" domElement="true" mayBeNull="false" optional="false">element</param>
            var e = Function.validateParameters(arguments, [{ name: 'element', domElement: true, mayBeNull: false, optional: false }], true);
            if (e) throw e;

            this._element = element;
        }

        Shp.Controls.Tel.prototype = {

            get_value: function () {
                /// <summary>Get value for current textbox control</summary>
                /// <returns type="String" />
                return this._element.value.toString().trim();
            },

            check_validity: function () {
                return this._element.checkValidity();
            }
        }

        Shp.Controls.Tel.registerClass('Shp.Controls.Tel', Shp.Controls.NullControl);



        Shp.Controls.DatePicker = function (element) {
            /// <summary>Create an instance of Shp.Controls.DatePicker class</summary>
            /// <param name="element" domElement="true" mayBeNull="false" optional="false">element</param>
            var e = Function.validateParameters(arguments, [{ name: 'element', domElement: true, mayBeNull: false, optional: false }], true);
            if (e) throw e;

            Shp.Controls.DatePicker.initializeBase(this)
            this._element = element;
        }

        Shp.Controls.DatePicker.prototype = {

            get_value: function () {
                /// <summary>Get value for current textbox control</summary>
                /// <returns type="String" />
                return this._element.value.toString().trim();
            },

            get_date: function () {
                var format = 'yyyy-MM-dd';
                var val = this.get_value();
                if (val === '') {
                    return null;
                }

                return Date.parseInvariant(val, format).format('yyyy-MM-ddThh:mm:ssZ');
            },

            check_validity: function () {
                return this._element.checkValidity();
            }
        }

        Shp.Controls.DatePicker.registerClass('Shp.Controls.DatePicker', Shp.Controls.NullControl);



        Shp.Controls.Number = function (element) {
            /// <summary>Create an instance of Shp.Controls.Number class</summary>
            /// <param name="element" domElement="true" mayBeNull="false" optional="false">element</param>
            var e = Function.validateParameters(arguments, [{ name: 'element', domElement: true, mayBeNull: false, optional: false }], true);
            if (e) throw e;

            Shp.Controls.Number.initializeBase(this)
            this._element = element;
        }


        Shp.Controls.Number.prototype = {

            get_value: function () {
                /// <summary>Get value for current textbox control</summary>
                /// <returns type="String" />
                return this._element.value.toString().trim();
            },

            get_number: function () {
                /// <summary>Get number from input element</summary>
                var nr = this.get_value();
                return parseFloat(nr);
            },

            check_validity: function () {
                return this._element.checkValidity();
            }

        }

        Shp.Controls.Number.registerClass('Shp.Controls.Number', Shp.Controls.NullControl);


        Shp.Controls.RichTextArea = function (element) {
            /// <summary>Create an instance of Shp.Controls.RichTextArea</summary>
            /// <param name="element" domElement="true" mayBeNull="false" optional="false">Element</param>
            var e = Function.validateParameters(arguments, [{ name: 'element', domElement: true, optional: false, mayBeNull: false }], true);
            if (e) throw "Shp.Controls.RichTextArea client control was initialized with invalid parameter. Please check if provided parameter is a DOM element.";

            this._element = element;
        }

        Shp.Controls.RichTextArea.prototype = {

            get_value: function () {
                var content = this._element.contentDocument;
                var el = content.querySelector('body');
                if (el === null) {
                    return '';
                }
                else {
                    return el.innerHTML;
                }
            }
        }

        Shp.Controls.RichTextArea.registerClass('Shp.Controls.RichTextArea', Shp.Controls.NullControl);



        Shp.Controls.TextArea = function (element) {
            /// <summary>Create an instance of single select client control</summary>
            /// <param name="element" domElement="true" mayBeNull="false" optional="false">Element</param>
            var e = Function.validateParameters(arguments, [{ name: 'element', domElement: true, optional: false, mayBeNull: false }], true);
            if (e) throw "Textarea client control was initialized with invalid parameter. Please check if provided parameter is a DOM element.";

            this._element = element;
        }

        Shp.Controls.TextArea.prototype = {

            get_value: function (trimValue) {
                /// <summary>Get textarea value</summary>
                /// <param name="trimValue" type="Boolean" mayBeNull="false" optional="true">Trim value (true is not specified)</param>
                var e = Function.validateParameters(arguments, [{ name: 'trimValue', type: Boolean, optional: true, mayBeNull: false }], true);
                if (e) throw "Get value method for textarea client control was called with invalid parameter.";

                var trimValue = trimValue || true;
                var val = (trimValue === true) ? this._element.value.toString().trim() : this._element.value.toString();
                return val;
            },

            set_value: function (val) {
                /// <summary>Set textarea value</summary>
                /// <param name="val" type="String" mayBeNull="true" optional="true">Value</param>
                var e = Function.validateParameters(arguments, [{ name: 'val', type: String, optional: false, mayBeNull: true }], true);
                if (e) throw e;

                var val = (val === null) ? '' : val;
                var instance = this;
                instance._element.value = val.trim()

                return instance;
            },

            check_validity: function () {
                return this._element.checkValidity();
            }

        }

        Shp.Controls.TextArea.registerClass('Shp.Controls.TextArea');



        Shp.Controls.SingleSelect = function (element) {
            /// <summary>Create an instance of single select client control</summary>
            /// <param name="element" domElement="true" mayBeNull="false" optional="false">Element</param>
            var e = Function.validateParameters(arguments, [{ name: 'element', domElement: true, optional: false, mayBeNull: false }], true);
            if (e) throw "Single select client control was initialized with invalid parameter. Please check if provided parameter is a DOM element.";

            this._element = element;
        }

        // This is where he defines behaviour for dropdowns
        Shp.Controls.SingleSelect.prototype = {

            keep_options: function (opts) {
                var el_opts = this._element.getElementsByTagName("option");
                for (var i = 0; i < el_opts.length; i++) {
                    var el_opt = el_opts[i];
                    if (Array.contains(opts, el_opt.value) === true) {
                        el_opt.disabled = false
                    }
                    else {
                        el_opt.disabled = true;
                    }
                }
            },

            //set dropdown options
            set_options: function (opts) {

                var el = this._element;
                el.options.length = 0;
                for (var i = 0; i < opts.length; i++) {
                    var opt = opts[i];
                    var n = document.createElement('option');
                    n.value = opt['value'];
                    n.innerHTML = opt['text'];
                    el.appendChild(n);
                }
            },

            //return selected dropdown element
            get_value: function () {
                /// <summary>Get value for current select control</summary>
                /// <returns type="String" />
                return this._element.options[this._element.selectedIndex].value;
            },

            get_text: function () {
                /// <summary>Get text  for current select control</summary>
                /// <returns type="String"
                return this._element.options[this._element.selectedIndex].text;
            },


            set_value: function (val) {
                var options = this._element.options;
                for (var i = 0; i < options.length; i++) {
                    if (options[i].value === val) {
                        this._element.selectedIndex = i;
                        return this;
                    }
                }

                return this;
            },

            check_validity: function () {
                return this._element.checkValidity();
            },
            //create fields in markup - might not need
            bindToSingle: function (field, values) {
                var _values = values || [];
                var choices = field.get_objectData().get_properties().Choices;
                for (let i = 0; i < choices.length; i++) {
                    var choice = choices[i];
                    var n = document.createElement('option');
                    n.value = choice;
                    n.innerHTML = choice;
                    if (Array.contains(_values, choice) === true) {
                        n.setAttribute('selected', 'selected');
                    }
                    this._element.appendChild(n);
                }
            } 
        }

        Shp.Controls.SingleSelect.registerClass('Shp.Controls.SingleSelect');




        Shp.Controls.MultipleSelect = function (element) {
            this._element = element;
        }

        Shp.Controls.MultipleSelect.prototype = {

            check_validity: function () {
                return this._element.checkValidity();
            },

            //Maybe use this and create function in dropdown class to bind objects to dropdown
            bindToField: function (field, values) {
                var _values = values || [];
                var choices = field.get_objectData().get_properties().Choices;
                for (var i = 0; i < choices.length; i++) {
                    var choice = choices[i];
                    var n = document.createElement('option');
                    n.value = choice;
                    n.innerHTML = choice;
                    if (Array.contains(_values, choice) === true) {
                        n.setAttribute('selected', 'selected');
                    }
                    this._element.appendChild(n);
                }
            },

            set_value: function (values) {
                for (var i = 0; i < this._element.options.length; i++) {
                    let opt = this._element.options[i];
                    if (Array.contains(values, opt.value)) {
                        opt.setAttribute('selected','selected');
                    }
                }
            },

            get_optvalues: function () {

                var opts = new Array();

                for (var i = 0; i < this._element.options.length; i++) {
                    opts.push(this._element.options[i].value);
                }
                return opts;
            },


            get_optionsAsText: function (selectedOnly) {
                /// <summary>Get options as text, separated by ; sign<summary>
                /// <param name="selectedOnly" type="Boolean" mayBeNull="false" optional="true">Get only selected options</param>
                /// <returns type="String" />
                var selectedOnly = selectedOnly || true;
                return this._get_optionsAsText(selectedOnly);
            },

            _get_optionsAsText: function (selectedOnly) {
                var results = new Array();
                var elementOptions = this._element.options;
                for (var i = 0; i < elementOptions.length; i++) {
                    if (selectedOnly === false) {
                        results.push(elementOptions[i].text);
                    }
                    else {
                        if (elementOptions[i].selected === true) {
                            results.push(elementOptions[i].text);
                        }
                    }
                }

                return results;
            },

            get_value: function (selectedOnly) {
                var selectedOnly = selectedOnly || true;
                return this.get_lookupIds(selectedOnly);
            },


            get_lookupIds: function (selectedOnly) {
                /// <summary>Get values of control<summary>
                /// <param>Only selected values</param>
                /// <returns type="Array" elementType="SP.FieldLookupValue" />
                var e = Function.validateParameters(arguments, [{ name: 'selectedOnly', type: Boolean, optional: true, mayBeNull: false }], true);
                if (e) throw 'get_lookupIds was called with invalid parameter.';

                var selectedOnly = selectedOnly || true;
                var lookupIds = (selectedOnly === true) ? this._get_selectedLookupIds() : this._get_lookupIds();
                return lookupIds;
            },

            _get_selectedLookupIds: function () {
                var lookupIds = [];
                var elementOptions = this._element.options;
                for (var i = 0; i < elementOptions.length; i++) {
                    if (elementOptions[i].selected === true) {
                        var lv = new SP.FieldLookupValue();
                        lv.set_lookupId(elementOptions[i].value);
                        lookupIds.push(lv);
                    }
                }
                return lookupIds;
            },


            _get_lookupIds: function () {
                var lookupIds = [];
                var elementOptions = this._element.options;
                for (var i = 0; i < elementOptions.length; i++) {

                    var lv = new SP.FieldLookupValue();
                    lv.set_lookupId(elementOptions[i].value);
                    lookupIds.push(lv);

                }
                return lookupIds;
            }




        }


        Shp.Controls.MultipleSelect.registerClass('Shp.Controls.MultipleSelect');

        Shp.Controls.PeopleSelector = function (element) {
            /// <summayr>Create an instance of PeopleEditor class</summary>
            /// <param name="element" isDomElement="true" optional="false" mayBeNull="false">Element</param>
            this._element = element
            this._innerElement = element.querySelector('#divEntityData');
        }


        Shp.Controls.PeopleSelector.prototype = {

            get_account: function () {
                if (this._innerElement === null) {
                    return '';
                }
                return SP.FieldUserValue.fromUser(this._innerElement.getAttribute('description'));
            },

            get_displayedName: function () {
                if (this._innerElement === null) {
                    return '';
                }
                return this._innerElement.getAttribute('displaytext');
            },

            get_key: function () {
                if (this._innerElement === null) {
                    return '';
                }
                return this._innerElement.getAttribute('key');

            }
        }

        Shp.Controls.PeopleSelector.registerClass('Shp.Controls.PeopleSelector');



        Shp.Controls.Selector = function () {
            /// <summary>Shp.Controls.Selector static class</summary>
            throw 'Cannot instantiate Shp.Controls.Selector static class';
        }


        Shp.Controls.Selector.get_richTextArea = function (selector, container) {
            var container = container || document;
            var rta = container.querySelector('iframe[id*="' + selector + '"]');
            if (rta === null) {
                return new Shp.Controls.NullControl();
            }
            else {
                return new Shp.Controls.RichTextArea(rta);
            }
        }


        Shp.Controls.Selector.get_peopleEditor = function (selector, container) {
            var container = container || document;
            var pp = container.querySelector('td[id*="' + selector + '"][id*="containerCell"]');
            if (pp === null) {
                return new Shp.Controls.NullControl();
            }
            return new Shp.Controls.PeopleSelector(pp);
        }

        Shp.Controls.Selector.get_control = function (selector, container) {
            /// <summary>Get form client control based on specified selector string</summary>
            /// <param name="selector" type="String" mayBeNull="false" optional="false">Selector</param>
            /// <param name="container" domElement="true" mayBeNull="false" optional="true">Container</param>
            /// <returns>Form client control</returns>
            var e = Function.validateParameters(arguments, [{ name: 'selector', type: String, mayBeNull: false, optional: false },
            { name: 'container', domElement: true, mayBeNull: false, optional: true }], true);
            if (e) throw e;

            var container = container || document;
            var element = document.getElementById(selector);
            if (element !== null) {
                if (element.tagName !== 'INPUT' || element.tagName !== 'SELECT' || element.tagName !== 'TEXTAREA') {
                    element = container.querySelector('input[id*="' + selector + '"], select[id*="' + selector + '"], textarea[id*="' + selector + '"]');
                }
            }
            else {
                element = container.querySelector('input[id*="' + selector + '"], select[id*="' + selector + '"], textarea[id*="' + selector + '"]');
            }

            if (element === null) return new Shp.Controls.NullControl();

            switch (element.type) {
                case 'number':
                    return new Shp.Controls.Number(element);
                    break;
                case 'tel':
                    return new Shp.Controls.Tel(element);
                    break;
                case 'date':
                    return new Shp.Controls.DatePicker(element);
                    break;
                case 'text':
                    return new Shp.Controls.TextBox(element);
                    break;
                case 'select-one':
                    return new Shp.Controls.SingleSelect(element);
                    break;
                case 'select-multiple':
                    return new Shp.Controls.MultipleSelect(element);
                    break;
                case 'textarea':
                    return new Shp.Controls.TextArea(element);
                    break;
                default:
                    return new Shp.Controls.NullControl();

            }

        }


        Shp.Controls.Selector.get_multiChoiceField = function (selector, container) {
            var container = container || document;
            var choices = [];
            var labels = container.querySelectorAll('label[for*="' + selector + '"]');
            for (var k = 0; k < labels.length; k++) {
                var checkbox = container.querySelector('#' + labels[k].getAttribute('for'));
                if (checkbox.checked === true) {
                    choices.push(labels[k].innerText);
                }
            }
            return choices;
        }

        Shp.Controls.Selector.get_clientPeoplePickerValue = function (selector, container) {
            var container = container || document;
            var div = container.querySelector('#' + selector + '_TopSpan') || container.querySelector('div[id*="' + container + '"][id*="_TopSpan"]');
            if (div === null) {
                return [null];
            }

            var ctl = SPClientPeoplePicker.SPClientPeoplePickerDict[div.id];
            alert(ctl);
            var users = ctl.GetAllUserInfo();
   
            if (users.length === 0) {
                return [null];
            }

            var _users = [];
            for (var i = 0; i < users.length; i++) {
                _users.push(SP.FieldUserValue.fromUser(users[i]['Key']));
            }
            return _users;
        }


        Shp.Controls.Selector.get_clientPeoplePicker = function (selector, container) {
            /// <summary>Get client people selector control</summary>
            var container = container || document;
            var div = container.querySelector('#' + selector + '_TopSpan') || container.querySelector('div[id*="' + container + '"][id*="_TopSpan"]');

            // return null control if not found
            if (div === null) {
                return new Shp.Controls.NullControl();
            }

            var ctl = SPClientPeoplePicker.SPClientPeoplePickerDict[div.id];
            return new Shp.Controls.ClientPeoplePicker(ctl);

        }


        Shp.Controls.Selector.get_dateTimeControlValue = function (dtSelector, hoursSelector, minutesSelector) {

            var DD = Shp.Controls.Selector.get_control(dtSelector).get_value();
            var HH = Shp.Controls.Selector.get_control(hoursSelector).get_value();
            var MM = Shp.Controls.Selector.get_control(minutesSelector).get_value();

            var dt = Date.parseInvariant(DD + ' ' + HH + ':' + MM, 'yyyy-MM-dd HH:mm');
            return dt;

        }

        Shp.Controls.Selector.registerClass('Shp.Controls.Selector');

        // Create shortcut for select method
        window.$select = Shp.Controls.Selector.get_control;
        window.$selectPeopleEditor = Shp.Controls.Selector.get_peopleEditor;
        window.$selectClientPicker = Shp.Controls.Selector.get_clientPeoplePicker;
    }


    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, null, execute);
    }
    else {
        execute();
    }


})();