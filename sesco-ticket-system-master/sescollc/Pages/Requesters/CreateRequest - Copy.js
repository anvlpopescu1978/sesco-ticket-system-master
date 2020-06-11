function pageContentLoad(sender, args) {
   

    jq('#ImpactedComponent').multiselect({
        numberDisplayed: 100
    });
    jq('#ImpactedSystem').multiselect({
        numberDisplayed: 100
    });
}


function CreateRequest() {

    let errors = 0;
    let controls_to_validate = ['TicketTitle', 'TicketType', 'TicketPriority', 'TicketDescription'];
    for (let i = 0; i < controls_to_validate.length; i++) {
        let control_to_validate = controls_to_validate[i];
        if ($select(control_to_validate).check_validity() === false) {
            jq('#' + control_to_validate).addClass('is-invalid');
            errors++;
        }
        else {
            jq('#' + control_to_validate).removeClass('is-invalid');
        }
    }

    if (errors > 0) {
        Shp.Dialog.ErrorDialog.show("Invalid form values", "Please complete all the fields");
        return;
    }

    Shp.Dialog.WaittingDialog.show("Wait for operation to finish");

    let request = {};
    request['TicketTitke'] = $select('TicketTitle').get_value();
    request['TicketType'] = $select('TicketType').get_value();
    request['TicketPriority'] = $select('TicketPriority').get_value();
    request['TicketDescription'] = $select('TicketDescription').get_value();
    request['_Comments'] = $select('TicketComments').get_value();
    request['EnhacementRequired'] = 'No';
    request['TicketStatus'] = 'New';

    $SPData.AddItem('SupportTickets', request).then(function(item) {
        AddAttachment(item);
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Error creating ticket", err);
    });
}



function AddAttachment(item) {
    if (document.getElementById('file1').files.length === 0) {
        SendEmail(item);
        return;
    }
    let item_id = item.get_id().toString();    
    Shp.Attachments.add('SupportTickets', item_id, document.getElementById('file1'), null, function () {
        SendEmail(item);
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Error attaching file", err);
    });
}


function AddComments(item) {
    let comments = {};
    comments['TicketID'] = item.get_id();
    comments['_Comments'] = $select('TicketComments').get_value();

    $SPData.AddItem('Comments', comments).then(function (comm) {
        SendEmail(item);
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Error adding comments", err);
    });


}


function SendEmail(item) {


    var to = [_spPageContextInfo.userLoginName];
    var from = _spPageContextInfo.userLoginName;
    var subject = 'New support ticket created: ' + 'Category ' + $select('TicketType').get_value();


    var body = '<table style="width: 100%; color:#ffffff; font-family:\'Arial\'">' +
        '<tr>' +
        '<td style="background-color:#ffffff"><img src="http://www.sescollc.com/images/sesco_logo.jpg" /></td>' +
        '<td style="background-color:#ffffff; color:#00000 ;text-align:center; vertical-align: middle;">' + subject +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="text-align:left; vertical-align: middle; background-color:#333333;" colspan="2">' +
        '<a style="color:#ffffff;" href="' + _spPageContextInfo.webAbsoluteUrl + '/Pages/Common/EditPO.aspx?poId=' + item.get_id() + '">Click for details</a>' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '<table style="width: 100%; color:#000000; font-family:\'Arial\'">' +
        // Ticket Number
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Ticket Number:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + item.get_id() + '</td>' +
        '</tr>' +
        // Ticket Title
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Ticket Title:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('TicketTitle').get_value() + '</td>' +
        '</tr>' +
        // Ticket Type
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Ticket Type:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('TicketType').get_value() + '</td>' +
        '</tr>' +
        // Prority
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Prority:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('TicketPriority').get_value() + '</td>' +
        '</tr>' +
        // Description
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Description:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('TicketDescription').get_value() + '</td>' +
        '</tr>' +
        // Comments
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Comments:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('TicketComments').get_value()+ '</td>' +
        '</tr>' +
        '</table>';



    var emailProperties = new Shp.Utility.EmailProperties(to, from, subject, body);
    Shp.Utility.Email.SendEmail(emailProperties, function (data) {
        if ($select('TicketComments').get_value() === '') {
            window.top.location.href = _spPageContextInfo.webAbsoluteUrl + '/Pages/PO/MyOrders.aspx';
        }
        else {
            let comments = {};
            comments['TicketID'] = item.get_id();
            comments['_Comments'] = $select('TicketComments').get_value();
            $SPData.AddItem('Comments', comments).then(function (commentsItem) {
                window.top.location.href = _spPageContextInfo.webAbsoluteUrl + '/Pages/Requesters/MyRequests.aspx';
            }, function (err) {
                Shp.Dialog.WaittingDialog.hide();
                Shp.Dialog.ErrorDialog.show("Error sending email", err);
            });
        }
    });

}


