function pageContentLoad(sender, args) {

   
    let getFields = $SPData.GetListFields('SupportTickets', ['Products']); 

    
    
   
    Promise.all([getFields]).then(function (results) {

        let productField = results[0]['Products'];
        $select('Products').bindToField(productField);



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

        jq('#ResponsibleDepartment').multiselect({
            numberDisplayed: 100,
            includeSelectAllOption: true,
            selectAllName: 'Select All'
        });
        
        
       
        populateSubmitter();

    }, function (err) {

        Shp.Dialog.ErrorDialog.show('Cannot get form data', err);

    });
   


}


function populateSubmitter() {
    SP.SOD.executeFunc('clientpeoplepicker.js', 'SPClientPeoplePicker', function () {
        let peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.Submitter_TopSpan; //Select the People Picker AKA Get the instance of the People Picker from the Dictionary
        //peoplePicker.AddUnresolvedUser(_spPageContextInfo.userEmail, true); 
        peoplePicker.AddUserKeys(_spPageContextInfo.userLoginName);
       // peoplePicker.SetEnabledState(false);
        //hide x image
        // jq(".sp-peoplepicker-delImage").hide();
       // jq("#Submitter, #Submitter_TopSpan").attr('contentEditable', false);
        //disable peoplepicker control
       // SetUserFieldValue('Submitter', _spPageContextInfo.userDisplayName);
    });
}

function SetUserFieldValue(fieldName, userName) {
    var _PeoplePicker = jq("div[title='" + fieldName + "']");
    var _PeoplePickerTopId = _PeoplePicker.attr('id');
    var _PeoplePickerEditer = jq("input[title='" + fieldName + "']");
    _PeoplePickerEditer.val(userName);
    var _PeoplePickerOject = SPClientPeoplePicker.SPClientPeoplePickerDict[_PeoplePickerTopId];
    _PeoplePickerOject.AddUnresolvedUserFromEditor(true);
    
}


function CreateRequest() { // Added Responsible Dept to list to validate

    // ticketTypeChange();

    let errors = 0;
    let submitter = $selectClientPicker('Submitter').get_allUserInfo()[0]; 
    let controls_to_validate = ['TicketTitle', 'TicketType','ResponsibleDepartment', 'TicketPriority', 'TicketDescription', 'TicketType', 'TicketSubType', 'TicketComments', 'ClosureReasons'];
    
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

    if ($select('BusinessFunction').check_validity() === false) {
        jq('#BusinessFunction').parent().find('button').addClass('is-invalid');
        errors++;
    }
   
    else {
        jq('#BusinessFunction').parent().find('button').removeClass('is-invalid');
    }
    // Added this 
    if ($select('ResponsibleDepartment').check_validity() === false) {
        jq('#ResponsibleDepartment').parent().find('button').addClass('is-invalid'); 
        errors++;
    } else {
        jq('#RespoinsibleDepartment').parent().find('button').removeClass('is-invalid');
    }

    if ($select('ImpactedSystem').check_validity() === false) {
        jq('#ImpactedSystem').parent().find('button').addClass('is-invalid');
        errors++;
    }
    else {
        jq('#ImpactedSystem').parent().find('button').removeClass('is-invalid');
    }

    if ($select('ImpactedComponent').check_validity() === false) {
        jq('#ImpactedComponent').parent().find('button').addClass('is-invalid');
        errors++
    }
    else {
        jq('#ImpactedComponent').parent().find('button').removeClass('is-invalid');
    }

    if ($select('ImpactedISO').check_validity() === false) {
        jq('#ImpactedISO').parent().find('button').addClass('is-invalid');
        errors++
    }
    else {
        jq('#ImpactedISO').parent().find('button').removeClass('is-invalid');
    }

    if ($select('Products').check_validity() === false) {
        jq('#Products').parent().find('button').addClass('is-invalid');
    }
    else {
        jq('#Products').parent().find('button').removeClass('is-invalid');
    }
    
    if (errors > 0) {
        Shp.Dialog.ErrorDialog.show("Invalid form values", "All required fields are  not entered.<br /> Please enter all required fields before submitting.");
        return;
    }

    Shp.Dialog.WaittingDialog.show("Wait for operation to finish");

    let assignedTo = $select('AssignedTo').get_value() === '' ? null : SP.FieldUserValue.fromUser($select('AssignedTo').get_value());
    let request = {};
    request['SupportAgent'] = assignedTo;
    request['TicketTitke'] = $select('TicketTitle').get_value();
    request['TicketType'] = $select('TicketType').get_value();
    //Added this - breaks when data is added to the database
    request['ResponsibleDepartment'] = $select('ResponsibleDepartment').get_value();
    //Added  ---------------------------------------------------------//
    request['TicketPriority'] = $select('TicketPriority').get_value();
    request['BusinessFunction'] = (jq('#BusinessFunction').closest('div').is(':hidden') === false) ? $select('BusinessFunction').get_optionsAsText(true).join(';') : '';
    request['Products'] = (jq('#Products').closest('div').is(':hidden') === false) ? $select('Products').get_optionsAsText(true).join(';#;#') : '';
    request['TicketDescription'] = $select('TicketDescription').get_value();
    request['TicketSubType'] = (jq('#TicketSubType').closest('div').is(':hidden') === false) ? $select('TicketSubType').get_value() : '';
    request['ImpactedSystems'] = (jq('#ImpactedSystem').closest('div').is(':hidden') === false) ? $select('ImpactedSystem').get_optionsAsText(true).join(';') : '';
    request['ImpactedComponents'] = (jq('#ImpactedComponent').closest('div').is(':hidden') === false) ? $select('ImpactedComponent').get_optionsAsText(true).join(';') : '';
    request['ImpactedISO'] = (jq('#ImpactedISO').closest('div').is(':hidden') === false) ? $select('ImpactedISO').get_optionsAsText(true).join(';') : '';
    request['DueDate1'] = (jq('#DueDate').closest('div').is(':hidden') === false) ? $select('DueDate').get_date() : null;
    request['CodeReview'] = (jq('#CodeReview').closest('div').is(':hidden') === false) ? $select('CodeReview').get_value() : '';
    request['DBReview'] = (jq('#DBReview').closest('div').is(':hidden') === false) ? $select('DBReview').get_value() : '';
    request['ArchictectureReview'] = (jq('#ArchitectureReview').closest('div').is(':hidden') === false) ? $select('ArchitectureReview').get_value() : '';
    request['UserTesting'] = (jq('#UserTesting').closest('div').is(':hidden') === false) ? $select('UserTesting').get_value() : '';
    request['ImpactScore'] = (jq('#ImpactScore').closest('div').is(':hidden') === false) ? $select('ImpactScore').get_value() : '';
    request['UrgencyScore'] = (jq('#UrgencyScore').closest('div').is(':hidden') === false) ? $select('UrgencyScore').get_value() : '';
    request['MandateScore'] = (jq('#MandateSCore').closest('div').is(':hidden') === false) ? $select('MandateSCore').get_value() : '';
    request['ROIScore'] = (jq('#RoiScore').closest('div').is(':hidden') === false) ? $select('RoiScore').get_value() : '';
    request['TotalScore'] = CalculateTotalScore();


    request['_Comments'] = $select('TicketComments').get_value();
    request['Team'] = $select('TeamID').get_value();

    request['Submtter'] = SP.FieldUserValue.fromUser(submitter.Key);
    request['TicketStatus'] = 'New';

    let getAdminsCaml = '<View>' +
        '<Query>' +
        '<Where>' +
        '<And>' +
        '<In>' +
        '<FieldRef Name="Role" />' +
        '<Values>' +
        '<Value Type="Text">Administrator</Value>' +
        '<Value Type="Text">Super Administrator</Value>' +
        '</Values>' +
        '</In>' +
        '<Eq><FieldRef Name="Team" LookupId="TRUE" /><Value Type="Lookup">' + $select('TeamID').get_value() + '</Value></Eq>' +
        '</And>' +
        '</Where>' +
        '</Query>' +
        '</View>';
    let addRequestOp = $SPData.AddItem('SupportTickets', request);
    let getAdministratorsOp = $SPData.GetListItems('Users', getAdminsCaml);
    Promise.all([addRequestOp, getAdministratorsOp]).then(function (results) {
        let item = results[0];
        let admins = results[1];
        let administrators = [];
        for (let i = 0; i < admins.get_count(); i++) {
            administrators.push(admins.itemAt(i).get_item('UserEmail'));
        }
        AddAttachment(item, administrators);
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Error creating ticket", err);
    });

    /*
    $SPData.AddItem('SupportTickets', request).then(function(item) {
        AddAttachment(item);
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Error creating ticket", err);
    }); */
}



function AddAttachment(item, administrators) {
    if (document.getElementById('file1').files.length === 0) {
        SendEmail(item, administrators);
        return;
    }
    let item_id = item.get_id().toString();    
    Shp.Attachments.add('SupportTickets', item_id, document.getElementById('file1'), null, function () {
        SendEmail(item, administrators);
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Error attaching file", err);
    });
}


function AddComments(item) {
    let comments = {};
    let newComments = $select('TicketComments').get_value().trim();
    
   
    
    comments['TicketID'] = item.get_id();
    comments['_Comments'] = newComments === '' ? 'No comments added' : newComments;
    comments['TicketStatus'] = 'New';

    $SPData.AddItem('Comments', comments).then(function (comm) {
        SendEmail(item, administrators);
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Error adding comments", err);
    });


}


function SendEmail(item, administrators) {

    administrators.push(_spPageContextInfo.userLoginName);
    var to = [...new Set(administrators)];
    if ($select('AssignedTo').get_value() !== '') {
        to.push($select('AssignedTo').get_value().split('|membership|')[1]);
    }

        
    let submitter = $selectClientPicker('Submitter').get_allUserInfo()[0];
    if (submitter !== undefined) {
        to.push(submitter.Description);
    }



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
        let comments = {};
        comments['TicketID'] = item.get_id();
        comments['_Comments'] = $select('TicketComments').get_value().trim() === '' ? 
            'No comments added' : $select('TicketComments').get_value().trim();


        $SPData.AddItem('Comments', comments).then(function (commentsItem) {
            window.top.location.href = _spPageContextInfo.webAbsoluteUrl + '/Pages/Requesters/MyRequests.aspx';
        }, function (err) {
            Shp.Dialog.WaittingDialog.hide();
            Shp.Dialog.ErrorDialog.show("Error sending email", err);
        });

    });

}

// I MADE CHANGES IN HERE TO TRY TO REFLECT THE REQUIREMENTS FOR COMBINING DATA ANALYTICS AND ENHANCEMENTS - LINES WERE COMMENTED OUT NOT REMOVED

function ticketTypeChange() { //shows and hides all fields based on what ticket type is selected - will have to change when combining Data Analytics and Enhancement to one

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
        //WILL CHANGE THIS BASED ON NEW NAME FOR COMBINED TICKET
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
        $select('TicketPriority').set_options([{ text: '...', value: '' },
        { text: 'Compliance', value: 'Compliance' },
        { text: 'Must Have', value: 'Must Have' },
        { text: 'Nice to Have', value: 'Nice to Have' },
        { text: 'Optional', value: 'Optional' }]);
    }
    else {
        $select('TicketPriority').set_options([{ text: '...', value: '' },
        { text: 'Urgent', value: 'Urgent' },
        { text: 'High', value: 'High' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' }]);
    }

    Shp.Dialog.WaittingDialog.show('Getting support team data');
    $SPData.GetListItems('Teams', '<View><Query><Where><Eq><FieldRef Name="AssociatedTicketType" /><Value Type="Text">' + ticketType + '</Value></Eq></Where></Query></View>').then(function (items) {
        if (items.get_count() === 0) {
            Shp.Dialog.WaittingDialog.hide();
            Shp.Dialog.ErrorDialog.show('No team assigned to this request type', 'No team assigned to this request type');
            return;
        }

        let item = items.itemAt(0);
        $select('SupportTeam').set_value(item.get_item('Team'));
        $select('TeamID').set_value(String(item.get_item('ID')));
        Shp.Dialog.WaittingDialog.hide();

    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show('Cannot get support team details', err);
    });
}


function ticketTypeChange2() {
    /// <summary>Reconfigure forms on ticket type changed</summary>

    let ticketType = $select('TicketType').get_value();

    if (ticketType === 'Software' || ticketType === 'Device' || ticketType === 'Data File' || ticketType ==='Environment (IT Use Only)' || ticketType === 'Access/Security' || ticketType === 'User Support') {
        jq('#TicketSubType').attr('required', 'required').closest('div').show();
        jq('#BusinessFunction').removeAttr('required').closest('div').hide();
        jq('#ImpactedSystem').removeAttr('required').closest('div').hide();
        jq('#ImpactedComponent').removeAttr('required').closest('div').hide();
        jq('#ImpactedISO').removeAttr('required').closest('div').hide();
        jq('#DueDate').removeAttr('required').closest('div').hide(); 
        jq('#CodeReview').removeAttr('required').closest('div').hide();  
        jq('#DBReview').removeAttr('required').closest('div').hide(); 
        jq('#ArchitectureReview').removeAttr('required').closest('div').hide(); 
        jq('#UserTesting').removeAttr('required').closest('div').hide(); 
        jq('#ImpactScore').removeAttr('required').closest('div').hide();  
        jq('#UrgencyScore').removeAttr('required').closest('div').hide();  
        jq('#MandateSCore').removeAttr('required').closest('div').hide();  
        jq('#RoiScore').removeAttr('required').closest('div').hide();     
        jq('#Products').removeAttr('required').closest('div').hide();
   }
    if (ticketType === 'Incident' || ticketType === 'Maintenance (IT Use Only)') {
        jq('#TicketSubType').removeAttr('required').closest('div').hide();
        jq('#Products').removeAttr('required').closest('div').hide();
        jq('#ImpactedSystem').attr('required', 'required').closest('div').show();
        jq('#ImpactedComponent').attr('required', 'required').closest('div').show();
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
    }
    else if (ticketType === 'New Capability/Enhancement' || ticketType === 'Data/Analytics') {
        jq('#TicketSubType').removeAttr('required').closest('div').hide();
        jq('#BusinessFunction').attr('required', 'required').closest('div').show();
        jq('#Products').attr('required', 'required').closest('div').show();
        jq('#ImpactedSystem').attr('required', 'required').closest('div').show();
        jq('#ImpactedComponent').attr('required', 'required').closest('div').show();
        jq('#ImpactedISO').attr('required', 'required').closest('div').show();
        jq('#DueDate').attr('required', 'required').closest('div').show();  
        jq('#CodeReview').attr('required', 'required').closest('div').show(); 
        jq('#DBReview').attr('required', 'required').closest('div').show(); 
        jq('#ArchitectureReview').attr('required', 'required').closest('div').show(); 
        jq('#UserTesting').attr('required', 'required').closest('div').show();
        jq('#ImpactScore').attr('required', 'required').closest('div').show(); 
        jq('#UrgencyScore').attr('required', 'required').closest('div').show(); 
        jq('#MandateSCore').attr('required', 'required').closest('div').show(); 
        jq('#RoiScore').attr('required', 'required').closest('div').show(); 
    }


    // Change priority
    // CHANGE THIS BASED ON NEW NAME FOR COMBINED TICKET
    if (ticketType === 'New Capability/Enhancement' || ticketType === 'Data/Analytics') {
        $select('TicketPriority').set_options([{ text: '...', value: '' },
            { text: 'Compliance', value: 'Compliance' },
            { text: 'Must Have', value: 'Must Have' },
            { text: 'Nice to Have', value: 'Nice to Have' },
            { text: 'Optional', value: 'Optional' }]);
    }
    else if (ticketType === '') {
        $select('TicketPriority').set_options([{ text: '...', value: '' }]);
    }
    else {
        $select('TicketPriority').set_options([{ text: '...', value: '' },
            { text: 'Urgent', value: 'Urgent' },
            { text: 'High', value: 'High' },
            { text: 'Medium', value: 'Medium' },
            { text: 'Low', value: 'Low' }]);
    }

    // Get Team Data
    if (ticketType === '') {
        $select('SupportTeam').set_value('');
        $select('TeamID').set_value('');
        return;
    }

    Shp.Dialog.WaittingDialog.show('Getting support team data');
    $SPData.GetListItems('Teams', '<View><Query><Where><Eq><FieldRef Name="AssociatedTicketType" /><Value Type="Text">' + ticketType + '</Value></Eq></Where></Query></View>').then(function (items) {
        if (items.get_count() === 0) {
            Shp.Dialog.WaittingDialog.hide();
            Shp.Dialog.ErrorDialog.show('No team assigned to this request type', 'No team assigned to this request type');
            return;
        }

        let item = items.itemAt(0);
        $select('SupportTeam').set_value(item.get_item('Team'));
        $select('TeamID').set_value(String(item.get_item('ID')));
        Shp.Dialog.WaittingDialog.hide();

    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show('Cannot get support team details', err);
    });

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

    total += jq('#Products :selected').length;
    total += jq('#BusinessFunction :selected').length;

    return total;
}


