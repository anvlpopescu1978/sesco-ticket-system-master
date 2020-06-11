function pageContentLoad(sender, args) {

    Shp.Dialog.WaittingDialog.show("Getting users. Please wait.")

    let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('Teams')/items";
    let executor = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
    executor.executeAsync({
        url: url,
        method: 'GET',
        headers: { "Accept": "application/json; odata=verbose" },
        error: function (data, errorCode, errorMessage) {
            Shp.Dialog.WaittingDialog.hide();
            Shp.Dialog.ErrorDialog.show("Cannot get users", data.body);
        },
        success: function (results) {
            let response = JSON.parse(results.body);
            let rows = response.d.results;
            ShowData(rows);
        }
    });
}


function ShowData(data) {

    jq('#dataTable').DataTable({
        data: data,
        info: false,
        ordering: false,
        scrollXInner: true,
        paging: false,
        drawCallback: function (settings) {
            Shp.Dialog.WaittingDialog.hide();
        },
        columns: [
            {
                data: null,
                orderable: false,
                defaultContent: '',
                orderable: false,
                render: function (data, row) {
                    return '<i class="fa fa-remove" aria-hidden="true" onclick="javascript:DeleteTeam(\'' + data['ID'] + '\')"></i>';
                }
            },
            { data: 'Team' },
            { data: 'AssociatedTicketType' }]

    });

}

function AddTeam() {

    let controls_to_validate = ['TeamName', 'TicketType'];
    let errors = 0;
    for (let i = 0; i < controls_to_validate.length; i++) {
        if ($select(controls_to_validate[i]).check_validity() === false) {
            errors++;
            jq('#' + controls_to_validate[i]).addClass('is-invalid');
        }
        else {
            jq('#' + controls_to_validate[i]).removeClass('is-invalid');
        }
    }
    if (errors > 0) {
        return;
    }

    Shp.Dialog.WaittingDialog.show('Adding new team');
    var team = {};
    team['Team'] = $select('TeamName').get_value();
    team['AssociatedTicketType'] = $select('TicketType').get_value();

    $SPData.AddItem('Teams', team).then(function (item) {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show('Cannot add team', err);
    });
        
}


function DeleteTeam(teamId) {

    Shp.Dialog.WaittingDialog.show('Deleting team');
    let countUsers = $SPData.GetListItems('Users', '<View><Query><Eq><FieldRef Name="Text" LookupId="TRUE" /><Value Type="Lookup">' + teamId + '</Value></Eq></Query></View>');
    let countTickets = $SPData.GetListItems('SupportTickets', '<View><Query><Eq><FieldRef Name="Text" LookupId="TRUE" /><Value Type="Lookup">' + teamId + '</Value></Eq></Query></View>');
    Promise.all([countUsers, countTickets]).then(function(results) {
        let users = results[0];
        let tickets = results[1];
        if (users.get_count() === 0 && tickets.get_count() === 0) {
            $SPData.DeleteItem('Teams', parseFloat(teamId)).then(function () {
                window.top.location.href = window.location.href;
            }, function (err) {
                Shp.Dialog.WaittingDialog.hide();
                Shp.Dialog.ErrorDialog.show('Cannot delete items', err);
            });
        }
        else {
            Shp.Dialog.WaittingDialog.hide();
            Shp.Dialog.ErrorDialog.show('Unsafe operation', 'You have users or tickets associated with this team');
        }
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show('Unable to check delete operation safety', err);
    });


}



