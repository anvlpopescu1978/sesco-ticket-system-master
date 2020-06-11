function pageContentLoad(sender, args, role, team) {

    $select('TicketType').set_value(Shp.Page.GetParameterFromUrl('Type'));

    let userTeams = []; 
    if (team !== null) {
        for (let k = 0; k < team.length; k++) {
            userTeams.push(userTeams, team[k].get_lookupId());
        }
    }

    

    if (role !== 'Administrator' && role !== 'Super Administrator') {
        Shp.Dialog.ErrorDialog.show('Access denied', 'Only administrators are allowed to acccess the page', function () {
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

    let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('SupportTickets')/items?$top=3000&$orderby=ID desc&$&$expand=Team/ID,Submtter/Id,Submtter/Title,Author/Id,SupportAgent/Id&$select=*,Team/ID,Created,ID,TicketType,TicketPriority,TicketTitke,SupportAgent/Title,Author/Title,TicketStatus,Submtter/Id,Submtter/Title&$filter=" + clause;
    let executor = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
    executor.executeAsync({
        url: url,
        method: 'GET',
        headers: { "Accept": "application/json; odata=verbose" },
        error: function (data, errorCode, errorMessage) {
            alert(data.body);
        },
        success: function (results) {
            let response = JSON.parse(results.body);
            let rows = response.d.results;
            ShowData(rows);
        }
    });
}



function ShowData(data, team) {

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

        initComplete: function (settings, json) {
            jq('.dataTables_scrollBody thead tr').css({ visibility: 'collapse' });

            jq('#dataTable thead tr').clone(true).appendTo('#dataTable thead');

            jq('#dataTable thead tr:eq(1) th').each(function (i) {
                let title = jq(this).text();
                if (i > 1) {
                    jq(this).removeClass('sorting sorting_asc sorting_desc').html('<input type="text"  />');
                    jq('input', this).on('change', function () {
                        if (jq('#dataTable').DataTable().column(i).search() !== this.value) {
                            jq('#dataTable').DataTable()
                                .column(i)
                                .search(this.value)
                                .draw();
                        }
                    });
                }
                else {
                    jq('input', this).removeClass('sorting sorting_asc sorting_desc' ).html('');
                }
            });

            jq('#dataTable tbody td.details-control2').click(function () {
                let tr = jq(this).closest('tr');
                let id = tr.find('td').eq(2).text();
                EditRequest(id);
            });

            jq('#dataTable tbody td.details-control').click(function () {
                let tr = jq(this).closest('tr');
                let row = jq('#dataTable').DataTable().row(tr);
                let tdi = tr.find("i.fa");
                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                    tdi.first().removeClass('fa-minus-square');
                    tdi.first().addClass('fa-plus-square');
                }
                else {
                    // Open this row
                    row.child(showDetails(row.data())).show();
                    tr.addClass('shown');
                    tdi.first().removeClass('fa-plus-square');
                    tdi.first().addClass('fa-minus-square');
                }
            });
        },
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
                orderable: false,
                className: 'details-control',
                defaultContent: '',
                render: function (d, row, index) {
                    return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
                }
            },
            {
                data: null,
                orderable: false,
                className: 'details-control2',
                defaultContent: '',
                render: function (d, row, index) {
                    return '<i class="fa fa-edit" aria-hidden="true"></i>';
                }
            },
            { data: 'ID' },
            { data: 'TicketTitke' },
            { data: 'TicketType' },
            { data: 'TicketPriority' },
            { data: 'TicketStatus' },
            {
                data: function (row) {
                    if (row["SupportAgent"].hasOwnProperty("Title") === true) {
                        return row["SupportAgent"]["Title"];
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                data: function (row) {
                    if (row["Author"].hasOwnProperty("Title") === true) {
                        return row["Author"]["Title"];
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                data: function (row) {
                    if (row["Submtter"].hasOwnProperty("Title") === true) {
                        return row["Submtter"]["Title"];
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                data: function (row) {
                    return row['Created'].split('T')[0];
                }
            }]
            
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