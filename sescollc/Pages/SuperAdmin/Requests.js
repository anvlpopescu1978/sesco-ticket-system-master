function pageContentLoad(sender, args, role, team) {

    $select('TicketType').set_value(Shp.Page.GetParameterFromUrl('Type'));

    if (_spPageContextInfo.isSiteAdmin === false && role !== 'Super Administrator') {
        Shp.Dialog.ErrorDialog.show('Access denied', 'Only site collection administrators are allowed to acccess the page', function () {
            NavigateToPage('/Pages/Common/AccessDenied.aspx');
        });
        return;
    }

    $SPData.GetListItems('Users', '<View><Query><Where><Eq><FieldRef Name="UserEmail" /><Value Type="Text">' + _spPageContextInfo.userLoginName + '</Value></Eq></Where></Query></View>').then(function (items) {

        if (items.get_count() === 0) {
            ShowData([]);
            return;
        }

        let user = items.itemAt(0);
        let teams = user.get_item('Team');
        let teamsId = [];
        for (let i = 0; i < teams.length; i++) {
            teamsId.push("Team/ID eq " + teams[i].get_lookupId());
        }
        GetTickets(teamsId.join(' or '));
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot retrieve user information', err);
    });

}

function GetTickets(clause) {


    let caml = '<View>' +
        '<RowLimit Paged="FALSE">5000</RowLimit>' +
        '<Query><OrderBy><FieldRef Name="ID" Ascending="FALSE" /></OrderBy></Query>' +
        '</View>';

    $SPData.GetListItems('SupportTickets', caml).then(function (items) {
        let enumerator = items.getEnumerator();
        let rows = [];

        while (enumerator.moveNext()) {
            let item = enumerator.get_current();
            let row = {};
            row['ID'] = item.get_id();
            row['TicketTitke'] = item.get_item('TicketTitke');
            row['TicketType'] = item.get_item('TicketType');
            row['TicketPriority'] = item.get_item('TicketPriority');
            row['TicketStatus'] = item.get_item('TicketStatus');
            row['SupportAgent'] = item.get_item('SupportAgent') === null ? '' : item.get_item('SupportAgent').get_lookupValue();
            row['Author'] = item.get_item('Author') === null ? '' : item.get_item('Author').get_lookupValue();
            row['Submtter'] = item.get_item('Submtter') === null ? '' : item.get_item('Submtter').get_lookupValue();
            row['Created'] = item.get_item('Created').format('yyyy-MM-dd');
            row['CodeReview'] = item.get_item('CodeReview');
            row['DBReview'] = item.get_item('DBReview');
            row['ArchictectureReview'] = item.get_item('ArchictectureReview');
            row['UserTesting'] = item.get_item('UserTesting');
            row['ImpactedComponents'] = item.get_item('ImpactedComponents');
            row['ImpactedSystems'] = item.get_item('ImpactedSystems');
            row['ImpactedISO'] = item.get_item('ImpactedISO');
            rows.push(row);
        }

        ShowData(rows);

    }).catch(function (err) {
        alert(err);
    });
}


function ShowData(data) {

    function showDetails(d) {
        // `d` is the original data object for the row

        html = '<div class="row">' +
            '<div class="col-md-3"><label>Code Review:</label><input type="text" class="form-control" value="' + (String(d['CodeReview']) === 'null' ? '' : d['CodeReview']) + '" readonly /></div>' +
            '<div class="col-md-3"><label>BD Review:</label><input type="text" class="form-control" value="' + (String(d['DBReview']) === 'null' ? '' : d['DBReview']) + '" readonly /></div>' +
            '<div class="col-md-3"><label>Archictecture Review:</label><input type="text" class="form-control" value="' + (String(d['ArchictectureReview']) === 'null' ? '' : d['ArchictectureReview']) + '" readonly /></div>' +
            '<div class="col-md-3"><label>User Testing:</label><input type="text" class="form-control" value="' + (String(d['UserTesting']) === 'null' ? '' : d['UserTesting']) + '" readonly /></div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-3"><label>Impacted Areas:</label><input type="text" class="form-control" value="' + (String(d['ImpactedComponents']) === 'null' ? '' : d['ImpactedComponents']) + '" readonly /></div>' +
            '<div class="col-md-3"><label>Impacted Systems:</label><input type="text" class="form-control" value="' + (String(d['ImpactedSystems']) === 'null' ? '' : d['ImpactedSystems']) + '" readonly /></div>' +
            '<div class="col-md-3"><label>Impacted ISO:</label><input type="text" class="form-control" value="' + (String(d['ImpactedISO']) === 'null' ? '' : d['ImpactedISO']) + '" readonly /></div>' +
            '<div class="col-md-3"><label>Business Impact:</label><input type="text" class="form-control" value="' + (String(d['TicketPriority']) === 'null' ? '' : d['TicketPriority']) + '" readonly /></div>' +
            '</div>';

        return html;
    }

    jq('#dataTable').DataTable({
        dom: 'r<"H"lf><"datatable-scroll"t><"F"ip>',
        // dom: 'lBfrtip',
        stateSave: false,
        stateDuration: 60 * 60 * 24 * 30,
        buttons: [
            'excelHtml5'
        ],
        colReorder: true,
        orderCellsTop: true,
        responsive: false,
        fixedHeader: true,
        scrollX: false,
        data: data,
        info: false,
        ordering: true,
        paging: false,
        columns: [
            {
                data: null,
                render: function (d) {
                    return '<buttton type="button" class="btn btn-primary btn-xs" onclick="javascript:EditRequest(' + d['ID'] + ')">Edit</button>'
                }
            },
            { data: 'ID' },
            { data: 'TicketTitke' },
            { data: 'TicketType' },
            { data: 'TicketPriority' },
            { data: 'TicketStatus' },
            { data: 'SupportAgent' },
            { data: 'Author' },
            { data: 'Submtter' },
            { data: 'Created' }]

    });



}



function EditRequest(requestId) {
    window.top.location.href = _spPageContextInfo.webAbsoluteUrl +
        '/Pages/Common/EditRequest.aspx?requestId=' + requestId +
        '&Source=' + escapeProperly(window.top.location.href);
}

function DeleteRequest(requestId, el) {
    $SPData.DeleteItem('SupportTickets', requestId).then(function () {
        jq(el).closest('tr').remove();
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot delete request', err);
    });
}

function ChangeFilter() {

    let ticket_type = $select('TicketType').get_value();
    let url = ticket_type === '' ? RemoveQueryParameterFromUrl(window.location.href, 'Type') : StURLSetVar2(window.location.href, 'Type', ticket_type);
    window.top.location.href = url;

}