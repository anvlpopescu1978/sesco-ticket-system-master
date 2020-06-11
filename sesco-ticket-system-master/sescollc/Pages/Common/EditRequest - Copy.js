function pageContentLoad(sender, args, role) {
    /// <summary>Page content load</summary>

    if (role !== 'Administrator' && role !== 'Super Administrator') {
        jq('#CodeReview, #DBReview, #ArchitectureReview, #UserTesting, #AssignedTo').prop('disabled', 'disabled');
    }

    if (role === 'User') {
        jq('#TicketStatus').prop('disabled', 'disabled');
    }

    jq('#myTab').children().eq(0).addClass('active');
    GetData();
}




function GetData() {


    Shp.Dialog.WaittingDialog.show('Getting ticket details');



    let getTicket = $SPData.GetListItems('SupportTickets', '<View><Query><Where><Eq><FieldRef Name="ID" /><Value Type="Integer">' + Shp.Page.GetParameterFromUrl('requestId').toString() + '</Value></Eq></Where></Query></View>');
    let getAttachments = $SPData.GetAttachments('SupportTickets', Shp.Page.GetParameterFromUrl('requestId').toString());
    let getComments = $SPData.GetListItems('Comments', '<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE" /></OrderBy><Where><Eq><FieldRef Name="TicketID" LookupId="TRUE" /><Value Type="Integer">' + Shp.Page.GetParameterFromUrl('requestId').toString() + '</Value></Eq></Where></Query></View>');
    let getClosureReason = $SPData.GetListItems('ClosureReason', '<View></View>');
    let getFields = $SPData.GetListFields('SupportTickets', ['BusinessFunction', 'Products']);


    Promise.all([getTicket, getAttachments, getComments, getClosureReason, getFields]).then(function (results) {
        let ticket = results[0].itemAt(0);
        let assignedTo = ticket.get_item('SupportAgent') === null ? '' : 'i:0#.f|membership|' + ticket.get_item('SupportAgent').get_email();
        let reasons = results[3];
        let startWorkingDate = ticket.get_item('StartWorkingDate') === null ? '' : ticket.get_item('StartWorkingDate').format('yyyy-MM-dd');
        let comletedDate = ticket.get_item('CompletedDate') === null ? '' : ticket.get_item('CompletedDate').format('yyyy-MM-dd');
        let closedDate = ticket.get_item('ClosedDate') === null ? '' : ticket.get_item('ClosedDate').format('yyyy-MM-dd');
        let inProcessDate = ticket.get_item('InProcessDate') === null ? '' : ticket.get_item('InProcessDate').format('yyyy-MM-dd');
        let acknowledgedDate = ticket.get_item('AcknowledgedDate') === null ? '' : ticket.get_item('AcknowledgedDate').format('yyyy-MM-dd');
        let priortizationDate = ticket.get_item('PriortizationDate') === null ? '' : ticket.get_item('PriortizationDate').format('yyyy-MM-dd');
        let plannedDate = ticket.get_item('PlannedDate') === null ? '' : ticket.get_item('PlannedDate').format('yyyy-MM-dd');
        let designDate = ticket.get_item('DesignDate') === null ? '' : ticket.get_item('DesignDate').format('yyyy-MM-dd');
        let developmentDate = ticket.get_item('DevelopmentDate') === null ? '' : ticket.get_item('DevelopmentDate').format('yyyy-MM-dd');
        let testDate = ticket.get_item('TestDate') === null ? '' : ticket.get_item('TestDate').format('yyyy-MM-dd');



        $select('BusinessFunction').bindToField(results[4]['BusinessFunction'], ticket.get_item('BusinessFunction'));
        $select('Products').bindToField(results[4]['Products'], ticket.get_item('Products'));

        $select('TicketTitle').set_value(ticket.get_item('TicketTitke'));
        $select('TicketType').set_value(ticket.get_item('TicketType'));
        $select('TicketSubType').set_value(ticket.get_item('TicketSubType'));

        $select('TicketDescription').set_value(ticket.get_item('TicketDescription'));
        $select('EnhacementRequired').set_value(ticket.get_item('EnhacementRequired'));
        $select('BusinessFunction').set_value(ticket.get_item('BusinessFunction'));
        $select('CreatedBy').set_value(ticket.get_item('Author').get_email());
        $select('Submitter').set_value(ticket.get_item('Submtter').get_email());

        $select('CodeReview').set_value(ticket.get_item('CodeReview'));
        $select('DBReview').set_value(ticket.get_item('DBReview'));
        $select('ArchitectureReview').set_value(ticket.get_item('ArchictectureReview'));
        $select('UserTesting').set_value(ticket.get_item('UserTesting'));
        $select('ImpactScore').set_value(String(ticket.get_item('ImpactScore')));
        $select('UrgencyScore').set_value(String(ticket.get_item('UrgencyScore')));
        $select('MandateSCore').set_value(String(ticket.get_item('MandateScore')));
        $select('RoiScore').set_value(String(ticket.get_item('ROIScore')));
        $select('SubmittedDate').set_value(ticket.get_item('Created').format('yyyy-MM-dd'));
        $select('CompletedDate').set_value(comletedDate);
        $select('ClosedDate').set_value(closedDate);
        $select('InProcessDate').set_value(inProcessDate);
        $select('AcknowledgedDate').set_value(acknowledgedDate);
        $select('PriortizationDate').set_value(priortizationDate);
        $select('PlannedDate').set_value(plannedDate);
        $select('DesignDate').set_value(designDate);    
        $select('DevelopmentDate').set_value(developmentDate);    
        $select('TestDate').set_value(testDate);    


        $select('TotalScore').set_value(String(ticket.get_item('TotalScore')));
        $select('AssignedTo').set_value(assignedTo);
        $select('RootCause').set_value(ticket.get_item('RootCause'));
        $select('ClosureReasons').set_value(ticket.get_item('ClosureReason'));
        $select('DevPriority').set_value(String(ticket.get_item('DevPriority')));
        $select('BusinessFunction').set_value(String(ticket.get_item('BusinessFunction')));
        populateSubmitter(ticket.get_item('Submtter').get_email())


        if (ticket.get_item('ImpactedSystems') !== null) {
             $select('ImpactedSystem').set_value(ticket.get_item('ImpactedSystems').split(';'));
        }
        if (ticket.get_item('ImpactedComponents') !== null) {
            $select('ImpactedComponent').set_value(ticket.get_item('ImpactedComponents').split(';'));
        }
        if (ticket.get_item('ImpactedISO') !== null) {
            $select('ImpactedISO').set_value(ticket.get_item('ImpactedISO').split(';'));
        }

        jq('#BusinessFunction').multiselect({
            numberDisplayed: 100,
            includeSelectAllOption: true,
            selectAllName: 'Select all'
        });

        jq('#Products').multiselect({
            numberDisplayed: 100,
            includeSelectAllOption: true,
            selectAllName: 'Select all'
        });

        jq('#ImpactedComponent').multiselect({
            numberDisplayed: 100
        });
        jq('#ImpactedSystem').multiselect({
            numberDisplayed: 100
        });
        jq('#ImpactedISO').multiselect({
            numberDisplayed: 100,
            includeSelectAllOption: true,
            selectAllName: 'Select all'
        });

       // DisablePhases();

        // Closure reasons
        let opt = [{ text: '...', value: '' }];
        for (let k = 0; k < reasons.get_count(); k++) {
            let reason = reasons.itemAt(k);
            if (reason.get_item('RequestType').toString().includes(ticket.get_item('TicketType')) === true) {
                opt.push({ text: reason.get_item('Reason'), value: reason.get_item('Reason') });
            }
        }
        $select('ClosureReasons').set_options(opt);
        $select('ClosureReasons').set_value(String(ticket.get_item('ClosureReason')));

        TicketTypeChanged();
        $select('TicketPriority').set_value(ticket.get_item('TicketPriority'));

        // Set phases options
        switch ($select('TicketType').get_value()) {
            case 'Maintenance (IT Use Only)':
            case 'Incident':
                $select('TicketStatus').set_options([{ text: 'New', value: 'New' },
                    { text: 'In-Process', value: 'In-Process' },
                    { text: 'Completed', value: 'Completed' },
                    { text: 'Closed', value: 'Closed' }]);
                break;
            case 'New Capability/Enhancement':
            case 'Data/Analytics':
                $select('TicketStatus').set_options([{ text: 'New', value: 'New' },
                    { text: 'Acknowledged', value: 'Acknowledged' },
                    { text: 'Priortization', value: 'Priortization' },
                    { text: 'Planned', value: 'Planned' },
                    { text: 'Design', value: 'Design' },
                    { text: 'Development', value: 'Development' },
                    { text: 'Test', value: 'Test' },
                    { text: 'Completed', value: 'Completed' },
                    { text: 'Closed', value: 'Closed' }]);
                break;
            case 'Software':
            case 'Data File':
            case 'Access/Security':
            case 'User Support':
            case 'Service Request':
                $select('TicketStatus').set_options([{ text: 'New', value: 'New' },
                    { text: 'Acknowledged', value: 'Acknowledged' },
                    { text: 'In-Process', value: 'In-Process' },
                    { text: 'Completed', value: 'Completed' },
                    { text: 'Closed', value: 'Closed' }]);
                break;
            default:
                $select('TicketStatus').set_options([{ text: 'New', value: 'New' },
                { text: 'Acknowledged', value: 'Acknowledged' },
                { text: 'In-Process', value: 'In-Process' },
                { text: 'Completed', value: 'Completed' },
                { text: 'Closed', value: 'Closed' }]);
        }

        $select('TicketStatus').set_value(ticket.get_item('TicketStatus'));
        StatusChanged();
        DisablePhases();


        let html = '';
        let attachments = results[1];
        jq('#tblAttachments tbody').html('');
        for (let i = 0; i < attachments.length; i++) {
            let attachment = attachments[i];
            html += '<tr>' +
                '<td><button class="btn btn-xs btn-primary" type="button" onclick="javascript:DeleteAttachment(this, \'' + attachment['fileName'] + '\')">Del.</button></td>' +
                '<td><a target="_blank" href="' + attachment['serverRelativeUrl'] + '">' + attachment['fileName']  + '</a></td>' +
                '</tr>';
        }
        jq('#tblAttachments tbody').html(html);

        html = '';
        let comments = results[2];
        for (let k = 0; k < comments.get_count(); k++) {
            let comment = comments.itemAt(k);
            html += '<div class="comment-show">' +
                '<div class="comment-show-header"><i class="fa fa-fw fa-user"></i> ' + comment.get_item('Author').get_email() + ' <i class="fa fa-calendar fa-user"></i> ' + comment.get_item('Created').format('yyyy-MM-dd HH:mm') + '</div>' +
                '<div class="comment-show-content">' +  comment.get_item('_Comments') + '</div>' +
                '</div>';
        }
        jq('#commentsPlace').html(html);

        Shp.Dialog.WaittingDialog.hide();

    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show('Cannot get ticket details', err);
    });
}


function DisablePhases() {
    let current_status = $select('TicketStatus').get_value();
    if (current_status !== 'New') {
        jq('#TicketStatus option').each(function (index) {
            if (jq(this).val() === "New") {
                jq(this).attr("disabled", "disabled");
            }
        });
    }
}


function StatusChanged() {
    if ($select('TicketStatus').get_value() === 'New') {
        jq('#AssignedTo').removeAttr('required').closest('div').hide();
    }
    else {
        jq('#AssignedTo').attr('required', 'required').closest('div').show();
    }

    if ($select('TicketStatus').get_value() === 'Closed') {
        jq('#ClosureReasons').attr('required', 'required').closest('div').show();
    }
    else {
        jq('#ClosureReasons').removeAttr('required').closest('div').hide();
    }

    if ($select('TicketStatus').get_value() === 'Closed' && $select('ClosureReasons').get_value() === 'Resolved') {
        jq('#RootCause').closest('div').show();
    }
    else {
        jq('#RootCause').closest('div').hide();
    }

}



function EditRequest() {


    // Form validation
    let controls_to_validate = ['TicketTitle', 'TicketType', 'TicketPriority', 'TicketDescription', 'TicketType', 'BusinessFunction', 'TicketSubType', 'TicketComments', 'ClosureReasons'];
    // Add root cause to validation
    if ($select('TicketStatus').get_value() === 'Closed' && $select('ClosureReasons').get_value() === 'Resolved') {
        controls_to_validate.push('RootCause');
    }



    let submitter = $selectClientPicker('Submitter').get_allUserInfo()[0];

    let errors = 0;
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

    if (submitter === undefined) {
        jq('#Submitter_TopSpan').addClass('is-invalid');
        errors++;
    }
    else {
        jq('#Submitter_TopSpan').removeClass('is-invalid');
    }

    if ($select('ImpactedSystem').check_validity() === false) {
        jq('#ImpactedSystem').parent().find('button').addClass('is-invalid');
    }
    else {
        jq('#ImpactedSystem').parent().find('button').removeClass('is-invalid');
    }

    if ($select('ImpactedComponent').check_validity() === false) {
        jq('#ImpactedComponent').parent().find('button').addClass('is-invalid');
    }
    else {
        jq('#ImpactedComponent').parent().find('button').removeClass('is-invalid');
    }

    if (errors > 0) {
        Shp.Dialog.ErrorDialog.show("Invalid form values", "All required fields are  not entered.<br /> Please enter all required fields before submitting.");
        return;
    }
    // End of form validation

    Shp.Dialog.WaittingDialog.show('Saving data');

    let request = {};
    request['ID'] = Shp.Page.GetParameterFromUrl('requestId');
    request['TicketTitke'] = $select('TicketTitle').get_value();
    request['TicketType'] = $select('TicketType').get_value();
    request['TicketPriority'] = $select('TicketPriority').get_value();
    request['TicketDescription'] = $select('TicketDescription').get_value();
    request['_Comments'] = $select('TicketComments').get_value();
    request['TicketStatus'] = $select('TicketStatus').get_value();
    request['BusinessFunction'] = (jq('#BusinessFunction').closest('div').is(':hidden') === false) ? $select('BusinessFunction').get_optionsAsText(true).join(';#;#') : '';


    request['SupportAgent'] = $select('AssignedTo').get_value() === '' ? null : SP.FieldUserValue.fromUser($select('AssignedTo').get_value());
    request['TicketSubType'] = (jq('#TicketSubType').closest('div').is(':hidden') === false) ? $select('TicketSubType').get_value() : '';
    request['ImpactedSystems'] = (jq('#ImpactedSystem').closest('div').is(':hidden') === false) ? $select('ImpactedSystem').get_optionsAsText(true).join(';') : '';
    request['ImpactedComponents'] = (jq('#ImpactedComponent').closest('div').is(':hidden') === false) ? $select('ImpactedComponent').get_optionsAsText(true).join(';') : '';
    request['ImpactedISO'] = (jq('#ImpactedISO').closest('div').is(':hidden') === false) ? $select('ImpactedISO').get_optionsAsText(true).join(';') : '';
    request['CodeReview'] = (jq('#CodeReview').closest('div').is(':hidden') === false) ? $select('CodeReview').get_value() : '';
    request['DBReview'] = (jq('#DBReview').closest('div').is(':hidden') === false) ? $select('DBReview').get_value() : '';
    request['ArchictectureReview'] = (jq('#ArchitectureReview').closest('div').is(':hidden') === false) ? $select('ArchitectureReview').get_value() : '';
    request['UserTesting'] = (jq('#UserTesting').closest('div').is(':hidden') === false) ? $select('UserTesting').get_value() : '';
    request['ImpactScore'] = (jq('#ImpactScore').closest('div').is(':hidden') === false) ? $select('ImpactScore').get_value() : '';
    request['UrgencyScore'] = (jq('#UrgencyScore').closest('div').is(':hidden') === false) ? $select('UrgencyScore').get_value() : '';
    request['MandateScore'] = (jq('#MandateSCore').closest('div').is(':hidden') === false) ? $select('MandateSCore').get_value() : '';
    request['ROIScore'] = (jq('#RoiScore').closest('div').is(':hidden') === false) ? $select('RoiScore').get_value() : '';
    request['TotalScore'] = (jq('#TotalScore').closest('div').is(':hidden') === false) ? $select('TotalScore').get_value() : '0';
    request['Submtter'] = SP.FieldUserValue.fromUser(submitter.Key);
    request['ClosureReason'] = (jq('#ClosureReason').closest('div').is(':hidden') === false) ? $select('ClosureReason').get_value() : '';
    request['RootCause'] = (jq('#RootCause').closest('div').is(':hidden') === false) ? $select('RootCause').get_value() : '';
    request['DevPriority'] = $select('DevPriority').get_value();


    switch (request['TicketStatus']) {

        case 'In-Process':
            if ($select('InProcessDate').get_value() === '') {
                request['InProcessDate'] = new Date();
            }
            break;
        case 'Acknowledged':
            if ($select('AcknowledgedDate').get_value() === '') {
                request['AcknowledgedDate'] = new Date();
            }
            break;
        case 'Priortization':
            if ($select('PriortizationDate').get_value() === '') {
                request['PriortizationDate'] = new Date();
            }
            break;
        case 'Planned':
            if ($select('PlannedDate').get_value() === '') {
                request['PlannedDate'] = new Date();
            }
            break;      
        case 'Design':
            if ($select('DesignDate').get_value() === '') {
                request['DesignDate'] = new Date();
            }
            break;  
        case 'Development':
            if ($select('DevelopmentDate').get_value() === '') {
                request['DevelopmentDate'] = new Date();
            }
            break;  
        case 'Test':
            if ($select('TestDate').get_value() === '') {
                request['TestDate'] = new Date();
            }
            break;  
        case 'Completed':
            if ($select('CompletedDate').get_value() === '') {
                request['CompletedDate'] = new Date();
            }
            break;  
        case 'Closed':
            if ($select('ClosedDate').get_value() === '') {
                request['ClosedDate'] = new Date();
            }
            break;  
    }

    
        
    let comments = {};
    comments['TicketID'] = Shp.Page.GetParameterFromUrl('requestId');
    comments['_Comments'] = $select('TicketComments').get_value();
    comments['TicketStatus'] = $select('TicketStatus').get_value();


    Promise.all([$SPData.UpdateItem('SupportTickets', request), $SPData.AddItem('Comments', comments)]).then(function (values) {
        let edited_request = values[0];
        SendEmail(edited_request);

    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Cannot update ticket", err);
    });

}


function SendEmail(edited_request) {


    var to = [_spPageContextInfo.userLoginName, $select('CreatedBy').get_value()];
    if (edited_request.get_item('SupportAgent') !== null) {
        to.push(edited_request.get_item('SupportAgent').get_email());
    } 

    var getEnhacedFields = function () {
        if ($select('EnhacementRequired').get_value() === 'No') {
            return '';
        }
        else {
            return '<tr>' +
                '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Business Function:</td>' +
                '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('BusinessFunction').get_optionsAsText() + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Impacted Systems:</td>' +
                '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('ImpactedSystem').get_optionsAsText() + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Impacted Components:</td>' +
                '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('ImpactedComponent').get_optionsAsText() + '</td>' +
                '</tr>';
        }
    }

    var from = _spPageContextInfo.userLoginName;
    var subject = 'Support ticket changed: ' + 'Category ' + $select('TicketType').get_value();
    var body = '<table style="width: 100%; color:#ffffff; font-family:\'Arial\'">' +
        '<tr>' +
        '<td style="background-color:#ffffff"><img src="http://www.sescollc.com/images/sesco_logo.jpg" /></td>' +
        '<td style="background-color:#ffffff; color:#00000 ;text-align:center; vertical-align: middle;">' + subject +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="text-align:left; vertical-align: middle; background-color:#333333;" colspan="2">' +
        '<a style="color:#ffffff;" href="' + _spPageContextInfo.webAbsoluteUrl + '/Pages/Common/EditRequest.aspx?requestId=' + Shp.Page.GetParameterFromUrl('requestId') + '">Click for details</a>' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '<table style="width: 100%; color:#000000; font-family:\'Arial\'">' +
        // Ticket Number
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Ticket Number:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + Shp.Page.GetParameterFromUrl('requestId') + '</td>' +
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
        // Status
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Status:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('TicketStatus').get_value() + '</td>' +
        '</tr>' +
        // Assigned To
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Assigned To:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('AssignedTo').get_text() + '</td>' +
        '</tr>' +
        // Enhacement Required
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Enhacement Required:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('EnhacementRequired').get_value() + '</td>' +
        '</tr>' +
        getEnhacedFields() +
        // Description
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Description:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('TicketDescription').get_value() + '</td>' +
        '</tr>' +
        // Comments
        '<tr>' +
        '<td style="background-color:#EEEEEE; height:22px; color:#000000; vertical-align: middle; width: 200px; border-bottom:1px #EEEEEE solid;">Comments:</td>' +
        '<td style="height: 22px; color:#000000; vertical-align: middle; border-bottom:1px #EEEEEE solid;">' + $select('TicketComments').get_value() + '</td>' +
        '</tr>' +
        '</table><br /><br />' +
        '<table style="width:100%">' +
        '<thead>' +
        '<tr><th style="color:#fff; background-color:#333; tex-align: left;">Attachments</th></tr>' +
        '</thead>' +
        '<tbody>' +
        GetAttachedFile() +
        '</tbody>' +
        '</table>';

        let emailProperties = new Shp.Utility.EmailProperties([...new Set(to)], from, subject, body);
    Shp.Utility.Email.SendEmail(emailProperties, function (data) {

        window.top.location.href = _spPageContextInfo.webAbsoluteUrl +
            '/Pages/Requesters/MyRequests.aspx';
     });


}


function GetAttachedFile() {
    let domain = 'sharepoint.com/';
    let html = '';
    jq('#tblAttachments  tbody tr a').each(function (index) {
        html += '<tr><td><a href="' + window.location.host + jq(this).attr('href') + '">' + jq(this).html() + '</a></td></tr>';
    });
    return html;
}


function DeleteAttachment(el, fileName) {
    Shp.Dialog.WaittingDialog.show('Deleting attachment');

    $SPData.DeleteAttachments('SupportTickets', Shp.Page.GetParameterFromUrl('requestId'), [fileName]).then(function () {
        jq(el).parent().parent().hide();
        Shp.Dialog.WaittingDialog.hide();
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialow.ErrorDialog.show('Cannot delete attachment', err);
    });
}


function AttachNewFile() {
    let element = document.getElementById('newFileToAdd');
    if (element.files.length === 0) {
        return;
    }

    Shp.Dialog.WaittingDialog.show('Adding new file');
    Shp.Attachments.add('SupportTickets', Shp.Page.GetParameterFromUrl('requestId'), element, null, function () {
        RefreshAttachments();
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Error attaching file", err);
    });

}


function RefreshAttachments() {
    $SPData.GetAttachments('SupportTickets', Shp.Page.GetParameterFromUrl('requestId').toString())
        .then(function (attachments) {
            let html = '';
            jq('#tblAttachments tbody').html('');
            for (let i = 0; i < attachments.length; i++) {
                let attachment = attachments[i];
                html += '<tr>' +
                    '<td><button class="btn btn-xs btn-primary" type="button" onclick="javascript:DeleteAttachment(this, \'' + attachment['fileName'] + '\')">Del.</button></td>' +
                    '<td><a target="_blank" href="' + attachment['serverRelativeUrl'] + '">' + attachment['fileName'] + '</a></td>' +
                    '</tr>';
            }
            jq('#tblAttachments tbody').html(html);
            document.getElementById("newFileToAdd").value = ""
            Shp.Dialog.WaittingDialog.hide();
        }, function (err) {
            Shp.Dialog.WaittingDialog.hide();
            Shp.Dialog.ErrorDialog.show("Error attaching file", err);
        });
}


function EnableEnhacement() {
    let is_enhanced = $select('EnhacementRequired').get_value();
    if (is_enhanced === "Yes") {
        jq('div[data-enhaced="enhaced"]').show();
    }
    else {
        jq('div[data-enhaced="enhaced"]').hide();
    }
}


function CalculateTotalScore() {

    let total = 0;
    let impact_score = $select('ImpactScore').get_value();
    let urgency_score = $select('UrgencyScore').get_value();
    let mandate_score = $select('MandateSCore').get_value();
    let roi_score = $select('RoiScore').get_value();

    switch (impact_score) {
        case 'High':
            total = total + 10;
            break;
        case 'Low':
            total = total + 1;
            break;
        case 'Medium':
            total = total + 5;
            break;
    }

    switch (urgency_score) {
        case '< 1 Month':
            total = total + 10;
            break;
        case '1 < 2 Months':
            total = total + 8;
            break;
        case '2 < 4 Months':
            total = total + 6;
            break;
        case '4+ Months':
            total = total + 2;
            break;
    }

    if ($select('TicketPriority').get_value() === 'Compliance') {
        total = total + 5;
    }

    switch (roi_score) {
        case 'Profitability':
            total = total + 10;
            break;
        case 'Efficiency':
            total = total + 6;
            break;
        case 'User Experience':
            total = total + 4;
            break;
        case 'Undetermined':
            total = total + 1;
            break;
    }

    $select('TotalScore').set_value(total.toString());
    return total;
}

function CalculateTotalScore2() {

    let total = 0;
    let impact_score = $select('ImpactScore').get_value();
    let urgency_score = $select('UrgencyScore').get_value();
    let mandate_score = $select('MandateSCore').get_value();
    let roi_score = $select('RoiScore').get_value();

    switch (impact_score) {
        case 'High':
            total = total + 10;
            break;
        case 'Low':
            total = total + 1;
            break;
        case 'Medium':
            total = total + 5;
            break;        
    }

    switch (urgency_score) {
        case '< 1 Month':
            total = total + 10;
            break;
        case '1 < 2 Months':
            total = total + 8;
            break;
        case '2 < 4 Months':
            total = total + 6;
            break; 
        case '4+ Months':
            total = total + 2;
            break;  
    }

    switch ($select('TicketPriority').get_value()) {
        case 'Compliance':
            total = total + 5;
            break;
    }

    switch (roi_score) {
        case 'Profitability':
            total = total + 10;
            break;
        case 'Efficiency':
            total = total + 6;
            break;
        case 'User Experience':
            total = total + 4;
            break;
        case 'Undetermined':
            total = total + 1;
            break;
    }

    $select('TotalScore').set_value(total.toString());
}

function TicketTypeChanged() {

    let ticketType = $select('TicketType').get_value();
    switch (ticketType) {
        case 'Incident':
            jq('#BusinessFunction').attr('required', 'required').closest('div').show();
            jq('#Products').removeAttr('required').closest('div').hide();
            jq('#ImpactedComponent').attr('required', 'required').closest('div').show();
            jq('#ImpactedSystem').attr('required', 'required').closest('div').show();
            jq('#ImpactedISO').attr('required', 'required').closest('div').show();
            jq('#DueDate').removeAttr('required').closest('div').hide();
            jq('#CodeReview').removeAttr('required').closest('div').hide();
            jq('#DBReview').removeAttr('required').closest('div').hide();
            jq('#UserTesting').removeAttr('required').closest('div').hide();
            jq('#ImpactScore').removeAttr('required').closest('div').hide();
            jq('#UrgencyScore').removeAttr('required').closest('div').hide();
            jq('#RoiScore').removeAttr('required').closest('div').hide();
            jq('#TotalScore').removeAttr('required').closest('div').hide();
            break;
        case 'Data/Analytics':
        case 'New Capability/Enhancement':
            jq('#BusinessFunction').attr('required', 'required').closest('div').show();
            jq('#Products').attr('required', 'required').closest('div').show();
            jq('#ImpactedComponent').attr('required', 'required').closest('div').show();
            jq('#ImpactedSystem').attr('required', 'required').closest('div').show();
            jq('#ImpactedISO').attr('required', 'required').closest('div').show();
            jq('#DueDate').attr('required', 'required').closest('div').show();
            jq('#CodeReview').attr('required', 'required').closest('div').show();
            jq('#DBReview').attr('required', 'required').closest('div').show();
            jq('#UserTesting').attr('required', 'required').closest('div').show();
            jq('#ImpactScore').attr('required', 'required').closest('div').show();
            jq('#UrgencyScore').attr('required', 'required').closest('div').show();
            jq('#RoiScore').attr('required', 'required').closest('div').show();
            jq('#TotalScore').attr('required', 'required').closest('div').show();
            break;
        case 'Software':
        case 'Data File':
        case 'Access/Security':
        case 'User Support':
        case 'Maintenance (IT Use Only)':
            jq('#BusinessFunction').attr('required', 'required').closest('div').show();
            jq('#Products').removeAttr('required').closest('div').hide();
            jq('#ImpactedComponent').attr('required', 'required').closest('div').show();
            jq('#ImpactedSystem').attr('required', 'required').closest('div').show();
            jq('#ImpactedISO').attr('required', 'required').closest('div').show();
            jq('#DueDate').removeAttr('required').closest('div').hide();
            jq('#CodeReview').removeAttr('required').closest('div').hide();
            jq('#DBReview').removeAttr('required').closest('div').hide();
            jq('#ArchitectureReview').removeAttr('required').closest('div').hide();
            jq('#UserTesting').removeAttr('required').closest('div').hide();
            jq('#ImpactScore').removeAttr('required').closest('div').hide();
            jq('#UrgencyScore').removeAttr('required').closest('div').hide();
            jq('#MandateSCore').removeAttr('required').closest('div').hide();
            jq('#RoiScore').removeAttr('required').closest('div').hide();
            jq('#TotalScore').removeAttr('required').closest('div').hide();
            break;
        case 'Environment (IT Use Only)':
        case 'Device':
            jq('#BusinessFunction').attr('required', 'required').closest('div').show();
            jq('#Products').removeAttr('required').closest('div').hide();
            jq('#ImpactedComponent').attr('required', 'required').closest('div').show();
            jq('#ImpactedSystem').removeAttr('required').closest('div').hide();
            jq('#ImpactedISO').attr('required', 'required').closest('div').show();
            jq('#DueDate').removeAttr('required').closest('div').hide();
            jq('#CodeReview').removeAttr('required').closest('div').hide();
            jq('#DBReview').removeAttr('required').closest('div').hide();
            jq('#ArchitectureReview').removeAttr('required').closest('div').hide();
            jq('#UserTesting').removeAttr('required').closest('div').hide();
            jq('#ImpactScore').removeAttr('required').closest('div').hide();
            jq('#UrgencyScore').removeAttr('required').closest('div').hide();
            jq('#MandateSCore').removeAttr('required').closest('div').hide();
            jq('#RoiScore').removeAttr('required').closest('div').hide();
            jq('#TotalScore').removeAttr('required').closest('div').hide();
            break;
    }


    // Change priority
    if (ticketType === 'New Capability/Enhancement') {
        $select('TicketPriority').set_options([{ text: 'Compliance', value: 'Compliance' },
        { text: 'Must Have', value: 'Must Have' },
        { text: 'Nice to Have', value: 'Nice to Have' },
        { text: 'Optional', value: 'Optional' }]);
    }
    else {
        $select('TicketPriority').set_options([{ text: 'Urgent', value: 'Urgent' },
        { text: 'High', value: 'High' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' }]);
    }
}


function GoBackToSource() {
    let source = Shp.Page.GetParameterFromUrl('Source');

    if (source !== '') {
        window.top.location.href = source;
        return;
    }

    $SPData.GetListItems('Users', '<View><Query><Where><Eq><FieldRef Name="UserEmail" /><Value Type="Text">' + _spPageContextInfo.userEmail + '</Value></Eq></Where></Query></View>')
        .then(function (items) {
            if (items.get_count() === 0) {
                window.top.location.href = _spPageContextInfo.webAbsoluteUrl + 'Pages/Requesters/MyRequests.aspx';
                return;
            }

            let role = items.itemAt(0).get_item('Role');
            let url = (role === 'Administrator') ?
                '/Pages/Administration/Requests.aspx' :
                '/Pages/Team/Requests.aspx';
            window.top.location.href = _spPageContextInfo.webAbsoluteUrl + url;

        }, function (err) {
            Shp.Dialog.ErrorDialog.show('Cannot get current user role', err);
        });
}



function populateSubmitter(loginName) {
    SP.SOD.executeFunc('clientpeoplepicker.js', 'SPClientPeoplePicker', function () {
        let peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.Submitter_TopSpan; //Select the People Picker AKA Get the instance of the People Picker from the Dictionary
        peoplePicker.AddUserKeys(loginName);
    });
}
