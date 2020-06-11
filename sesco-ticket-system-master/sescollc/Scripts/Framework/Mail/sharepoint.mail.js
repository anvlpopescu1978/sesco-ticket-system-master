
Type.registerNamespace('Shp.Utility');


Shp.Utility.EmailProperties = function (to, from, subject, body) {
    /// <summary>Create an instance of Shp.Utility.EmailProperties
    /// <param name="to" type="String" mayBeNull="false" optional="false">To</param>
    /// <param name="from" type="String" mayBeNull="false" optional="false">From</param>
    /// <param name="subject" type="String" mayBeNull="false" optional="false">Email Subject</param>
    /// <param name="body" type="String" mayBeNull="false" optional="false">Email Body</param>
    var e = Function.validateParameters(arguments, [{ name: 'to', type: Array, elementType: String, elementMayBeNull: false, optional: false, mayBeNull: false },
                                                    { name: 'from', type: String, optional: false, mayBeNull: false },
                                                    { name: 'subject', type: String, optional: false, mayBeNull: false },
                                                    { name: 'body', type: String, optional: false, mayBeNull: false }], true);
    if (e) throw e;

    this.to = to;
    this.from = from;
    this.subject = subject;
    this.body = body;
    this.cc = [];
    this.bcc = [];
}



Shp.Utility.EmailProperties.prototype = {


    add_cc: function (cc) {
        /// <signature>
        ///     <summary>Add CC to email properties</summary>
        ///     <param name="cc" type="String" mayBeNull="false" optional="false">CC</param>
        ///     <returns type="Shp.Utility.EmailProperties"></returns>
        /// </signature>
        /// <signature>
        ///     <summary>Add CC to email properties</summary>
        ///      <param name="cc" type="Array" elementType="String" elementMayBeNull="false" mayBeNull="false" optional="false">CC</param>
        ///      <returns type="Shp.Utility.EmailProperties"></</returns>
        /// </signature>
        var e1 = Function.validateParameters(arguments, [{ name: 'cc', type: String, optional: false, mayBeNull: false }], true);
        var e2 = Function.validateParameters(arguments, [{ name: 'cc', type: Array, elementType: String, elementMayBeNull: false, optional: false, mayBeNull: false }], true);
        if (e1 != null && e2 != null) throw e1 || e2;

        var instance = this;
        if (e1 == null)
            instance.cc.push(cc);
        if (e2 == null)
            instance.cc = Array.clone(cc);

        return instance;
    },

    add_bcc: function (bcc) {
        /// <signature>
        ///     <summary>Add CC to email properties</summary>
        ///     <param name="bcc" type="String" mayBeNull="false" optional="false">CC</param>
        ///     <returnts type="Shp.Utility.EmailProperties" />
        /// </signature>
        /// <signature>
        ///     <summary>Add CC to email properties</summary>
        ///     <param name="bcc" type="Array" elementType="String" elementMayBeNull="false" mayBeNull="false" optional="false">CC</param>
        ///     <returnts type="Shp.Utility.EmailProperties" />
        /// </signature>
        var e1 = Function.validateParameters(arguments, [{ name: 'bcc', type: String, optional: false, mayBeNull: false }], true);
        var e2 = Function.validateParameters(arguments, [{ name: 'bcc', type: Array, elementType: String, elementMayBeNull: false, optional: false, mayBeNull: false }], true);
        if (e1 != null && e2 != null) throw e1 || e2;

        var instance = this;
        if (e1 == null)
            instance.bcc.push(bcc);
        if (e2 == null)
            instance.bcc = Array.clone(bcc);

        return instance;

    },

    GenerateRequestBody: function () {
        /// <summary>Generate Ajax request body</summary>
        var instance = this;
        var request = {
            'properties': {
                '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
                'From': instance.from,
                'To': { 'results': instance.to },
                'CC': { 'results': instance.cc },
                'BCC': { 'results': instance.bcc },
                'Body': instance.body,
                'Subject': instance.subject
            }
        }
        return JSON.stringify(request);
    }

}

Shp.Utility.EmailProperties.registerClass('Shp.Utility.EmailProperties');



Shp.Utility.Email = function () {
    /// <summary>Shp.Utility.Email static class</summary>
    throw 'You cannot initialize an instance of Shp.Utility.Email static class';
}


Shp.Utility.Email.SendEmail = function (emailProperties, success, fail) {
    /// <summary>Send an email using SharePoint API</summary>
    /// <param name="emailProperties" type="Shp.Utility.EmailProperties" optional="false" mayBeNull="false">Email Properties</param>
    /// <param name="success" type="Function" optional="false" mayBeNull="false">Success</param>
    /// <param name="fail" type="Function" optional="true" mayBeNull="false">Fail</param>
    var e = Function.validateParameters(arguments, [{ name: 'emailProperties', type: Shp.Utility.EmailProperties, optional: false, mayBeNull: false },
                                                    { name: 'success', type: Function, optional: false, mayBeNull: false },
                                                    { name: 'fail', type: Function, optional: true, mayBeNull: false }], true);
    if (e) throw e;


    Shp.Utility.Email._SendEmail(emailProperties, success, fail || function (errCode, errText) {
        alert('Send email Ajax call failed with error code ' + errCode + ':' + errText);
    });
}

Shp.Utility.Email._SendEmail = function (emailProperties, success, fail) {
    var ajax = new Sys.Net.WebRequest();
    ajax.set_url(_spPageContextInfo.webServerRelativeUrl + '/_api/SP.Utilities.Utility.SendEmail');
    ajax.set_httpVerb('POST');
    ajax.set_body(emailProperties.GenerateRequestBody());
    ajax.get_headers()['Accept'] = 'application/json;odata=verbose';
    ajax.get_headers()['Content-Type'] = 'application/json;odata=verbose';
    ajax.get_headers()['X-RequestDigest'] = $get('__REQUESTDIGEST').value;

    ajax.add_completed(function (executor, eventArgs) {
        if (executor.get_statusCode() >= 200 && executor.get_statusCode() < 300 && executor.get_responseAvailable() === true) {
            success(executor.get_responseData());
        }
        else {
            alert('Ajax failed with error code ' + executor.get_statusCode() + ':' + executor.get_responseData());
        }
    });

    ajax.invoke();
}

Shp.Utility.Email.registerClass('Shp.Utility.Email');
