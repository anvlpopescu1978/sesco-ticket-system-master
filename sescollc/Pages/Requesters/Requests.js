function pageContentLoad(sender, args, role, team) {


    let userTeams; 
    if (typeof team == 'Array') {
        for (let k = 0; k < team.t.get_count(); k++) {
            userTeams.push(userTeams, team.itemAt(k).get_item('ID'));
        }
    }

    

    if (role !== 'Administrator') {
        Shp.Dialog.ErrorDialog.show('Access denied', 'Only administrators are allowed to acccess the page');
        return;
    }

    if (team === null && _spPageContextInfo.isSiteAdmin === false) {
        Shp.Dialog.ErrorDialog.show('No team assigned', 'You need to be a part of a team to see requests');
        return;
    }

    
    let ttype = Shp.Page.GetParameterFromUrl('Type');
    let clause = (ttype === '') ? '' : "&$filter=(TicketType eq '" +  ttype + "')";
    let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('SupportTickets')/items?$orderby=ID desc&$top=2000&$expand=Team/ID,Submtter/Id,Submtter/Title,Author/Id,SupportAgent/Id&$select=Team/ID,Created,ID,TicketType,TicketPriority,TicketTitke,SupportAgent/Title,Author/Title,TicketStatus,Submtter/Id,Submtter/Title" + clause;



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
            ShowData(rows, userTeams);
        }
    });
     
}



function ShowData(data, team) {

    

    jq('#dataTable').DataTable({    
        'rowCallback': function (row, data, index) {
            
            if (_spPageContextInfo.isSiteAdmin === false && Array.contains(team, data["Team"]["ID"]) !== false) {
                jq(row).hide();
            }
        },
        'initComplete': function (settings, json) {
            jq('.dataTables_scrollBody thead tr').css({ visibility: 'collapse' });
        },
        dom: 'lBfrtip',
        stateSave: true,
        stateDuration: 60 * 60 * 24 * 30,
        buttons: [
            'excelHtml5', 
            {
                extend: 'colvis',
                postfixButtons: ['colvisRestore']
            }
        ],
        colReorder: true,
        scrollX: true,
        data: data,
        info: false,
        ordering: true,
        paging: false,
        columns: [{
            data: function (row) {
                return '<button type="button" class="btn btn-xs btn-primary" onclick="javascript:EditRequest(\'' + row['ID'] + '\')">Edit</button>';
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
            },
            {
                data: function (row) {
                    if (!(row['CompleteByDate'] === null)) {
                        return row['CompleteByDate'].split('T')[0];
                    } else {
                        return '';
                    }
                    
                }
            }]
            
    });

    jq('#dataTable').on('column-visibility.dt', function (e, settings, column, state) {
   
    });

   

}



function EditRequest(requestId) {
    window.top.location.href = _spPageContextInfo.webAbsoluteUrl +
        '/Pages/Common/EditRequest.aspx?requestId=' + requestId +
        '&Source=' + escapeProperly(window.top.location.href);

}