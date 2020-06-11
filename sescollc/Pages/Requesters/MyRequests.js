function pageContentLoad(sender, args) {


    $SPData.GetListItems('Users', '<View><Query><Where><Eq><FieldRef Name="UserEmail" /><Value Type="Text">' + _spPageContextInfo.userLoginName + '</Value></Eq></Where></Query></View>').then(function (items) {

        if (items.get_count() === 0) {
            // ShowData('');
            GetTickets('');
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

    let _clause = (clause === '') ? '' : ' or (' + clause +')';
    let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('SupportTickets')/items?$orderby=Created desc&$expand=Author/Id,Author/Title,Submtter/Id,Submtter/Title,SupportAgent/Id&$select=*,UserTesting,CodeReview,DBReview,ArchictectureReview,UserTesting,Created,Author/ID,Author/Title,ID,TicketType,TicketPriority,TicketTitke,SupportAgent/Title,TicketStatus,Submtter/Id,Submtter/Title&$filter=Author/Id eq " + _spPageContextInfo.userId + " or Submtter/Id eq " + _spPageContextInfo.userId +
        ' or SupportAgent/Id eq ' + _spPageContextInfo.userId;
        //+ _clause;
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



function ShowData(data) {

    function showDetails(d) {
        // `d` is the original data object for the row
        return '<table style="width:100%">' +
            '<tr>' +
            '<td style="width:25%" class="details-label">Code Review:</td>' +
            '<td class="details-value">' + (String(d['CodeReview']) === 'null' ? '' : d['CodeReview']) + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td class="details-label">DB Review:</td>' +
                '<td class="details-value">' + (String(d['DBReview']) === 'null' ? '' : d['DBReview'])  + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td class="details-label">Archictecture Review:</td>' +
                    '<td class="details-value">' + (String(d['ArchictectureReview']) === 'null' ? '' : d['ArchictectureReview'])  + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td class="details-label">User Testing:</td>' +
            '<td class="details-value">' + (String(d['UserTesting']) === 'null' ? '' : d['UserTesting'])  + '</td>' +
            '</tr>' +
            '</table>';
    }

    jq('#dataTable').DataTable({
        'initComplete': function (settings, json) {

            jq('.dataTables_scrollBody thead tr').css({ visibility: 'collapse' });


            jq('#dataTable thead tr').clone(true).appendTo('#dataTable thead');
            jq('#dataTable thead tr:eq(1) th').each(function (i) {
         
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
                    jq('input', this).removeClass('sorting sorting_asc sorting_desc').html('');
                }
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


            jq('#dataTable tbody td.details-control2').click(function () {
                let tr = jq(this).closest('tr');
                let id = tr.find('td').eq(2).text();
                EditRequest(id);
            });

        },
        dom: 'r<"H"lf><"datatable-scroll"t><"F"ip>',
        //dom: 'lBfrtip',
        buttons: [
            'excelHtml5'
        ],
        scrollX: false,
        stateSave: false,
        stateDuration: 60 * 60 * 24 * 30,
        data: data,
        info: false,
        colReorder: false,
        ordering: true,
        scrollXInner: true,
        paging: false,
        columns: [
            {
                data: null,
                orderable: false,
                className: 'details-control',
                defaultContent: '',
                orderable: false,
                render: function () {
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
                    return row['Created'].split('T')[0];
                }
            },
            {
                data: function (row) {
                    if (!(row['CompleteByDate'] === null)) {
                        return row['CompleteByDate'].split('T')[0];
                    } else {
                        return "";
                    }
                }
            }]
            
    });

}



function EditRequest(requestId) {
    window.top.location.href = _spPageContextInfo.webAbsoluteUrl +
        '/Pages/Common/EditRequest.aspx?requestId=' + requestId +
        '&Source=' + escapeProperly(window.top.location.href);

}