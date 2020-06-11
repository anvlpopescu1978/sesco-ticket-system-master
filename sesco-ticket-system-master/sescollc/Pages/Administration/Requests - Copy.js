function pageContentLoad(sender, args) {
    let phase = Shp.Page.GetParameterFromUrl('Status');
    let clause = (phase === '') ? "AuthorId eq " + _spPageContextInfo.userId : "(AuthorId eq  " + _spPageContextInfo.userId + ") and (Status eq '" +  phase + "')";
    let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('SupportTickets')/items?$top=1000$expand=SupportAgent/Id&$select=ID,TicketType,TicketPriority,TicketTitke,SupportAgent/Title,TicketStatus&$filter=" + clause;
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

    jq('#dataTable').DataTable({
        data: data,
        info: false,
        ordering: false,
        scrollXInner: true,
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
            }]
            
    });

}



function EditRequest(requestId) {
    window.top.location.href = _spPageContextInfo.webAbsoluteUrl +
        '/Pages/Requesters/EditRequest.aspx?requestId=' + requestId;

}