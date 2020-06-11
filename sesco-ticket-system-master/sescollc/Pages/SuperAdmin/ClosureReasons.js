function pageContentLoad(sender, args, role, team) {


  

    if (role !== 'Super Administrator' && _spPageContextInfo.isSiteAdmin !== true) {
        Shp.Dialog.ErrorDialog.show('Access denied', 'Only super administrators are allowed to acccess the page', function () {
            NavigateToPage('/Pages/Common/AccessDenied.aspx')
        });
        return;
    }
    

    let getReasons = GetClosureReasons();
    let getTypes = GetTicketTypes();
    Promise.all([getReasons, getTypes]).then(function (results) {

        // Get request types and show in field
        $select('RequestType').bindToField(results[1]);
        jq('#RequestType').multiselect({
            numberDisplayed: 100,
            includeSelectAllOption: true,
            selectAllName: 'Select all'
        });

        ShowData(results[0], results[1].get_objectData().get_properties().Choices);


    }, function (err) {
        alert(err);
    });
     
}


function GetTicketTypes() {
    let promise = new Promise(function (resolve, reject) {
        let ctx = SP.ClientContext.get_current();
        let oList = ctx.get_web().get_lists().getByTitle('ClosureReason');
        let oField = oList.get_fields().getByTitle("RequestType");
        ctx.load(oField);
        ctx.executeQueryAsync(function () {
            resolve(oField);
        }, function (sernder, args) {
            reject(args.get_message());
        });
    });
    return promise;
}


function AddClosureReason() {

    let reason = {
        'Reason': $select('ClosureReason').get_value(),
        'RequestType': $select('RequestType').get_optionsAsText(true).join(';#;#'),
        'Ranking':  document.querySelectorAll('#dataTable tbody tr').length * 10 + 10
    }

    $SPData.AddItem('ClosureReason', reason).then(function () {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot add closure reason', err);
    });

}


function GetClosureReasons() {
    let promise = new Promise(function (resolve, reject) {
        let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('ClosureReason')/items?$select=*";
        let executor = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
        executor.executeAsync({
            url: url,
            method: 'GET',
            headers: { "Accept": "application/json; odata=verbose" },
            error: function (data, errorCode, errorMessage) {
                reject(data.body);
            },
            success: function (results) {
                let response = JSON.parse(results.body);
                let rows = response.d.results;
                resolve(rows);
            }
        });

    });
    return promise;
}



function ShowData(data, choices) {  

    jq('#dataTable').DataTable({
        drawCallback: function (settings) {
            jq('#dataTable select[id*="RequestListType"]').multiselect();
        },
        scrollX: false,
        data: data,
        info: false,
        ordering: true,
        paging: false,
        columns: [
            {
                data: null,
                render: function (d, row, index) {
                    return '<button type="button" onclick="DeleteClosureReason(\'' + d['ID'] + '\', this)" class="btn btn-xs btn-danger">Del.</button>';
                }
            },
            {
                data: 'Reason'
            },
            {
                data: null,
                defaultContent: '',
                render: function (d, row, index) {
                    let types = d["RequestType"]["results"];
                    let html = '<select class="form-control" id="RequestListType' + d['ID'] + '" multiple>';
                    for (let i = 0; i < choices.length; i++) {
                        if (Array.contains(types, choices[i]) === true) {
                            html += '<option selected="selected" value="' + choices[i] + '">' + choices[i] + '</option>';
                        }
                        else {
                            html += '<option value="' + choices[i] + '">' + choices[i] + '</option>';
                        }
                    }
                    html += '</select>'
                    return html;
                }
            },
            {
                data: null,
                defaultContent: '',
                render: function (d, row, index) {
                    return '<input class="form-control" type="number" value="' + d['Ranking'] +  '" data-id="' + d['ID'] + '" id="ranking' + d['ID'] + '"  />'
                }
            }]
    });
}



function DeleteClosureReason(id, el) {
    $SPData.DeleteItem('ClosureReason', id).then(function () {
        jq(el).closest('tr').remove();
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot delete entry', err);
    });

}


function UpdateRanking() {
    let rankings = [];
    jq('#dataTable tbody tr input[id*="Ranking"]').each(function () {
        let c = jq(this);
          rankings.push({
            'ID': c.data('id'),
            'Ranking': c.val()
        });
    });

    $SPData.UpdateItems('ImpactedComponents', rankings).then(function (items) {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot update rankings', err);
    });
}


function AddBF() {

    let bf = {
        'BusinessFunction': $select('BusinessFunctionName').get_value(),
    };

    $SPData.AddItem('BusinessFunctions', bf).then(function (item) {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot add function', err);
    });
}



function UpdateReasons() {

    let reasons = [];
    jq('#dataTable tbody tr input[id*="ranking"]').each(function (index) {

        let el = jq(this);
        let reason = {
            'ID': el.data('id'),
            'Ranking': el.val(),
            'RequestType': $select('RequestListType' + el.data('id')).get_optionsAsText(true).join(';#;#')
        }

        reasons.push(reason);
    });

    $SPData.UpdateItems('ClosureReason', reasons).then(function (items) {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot update closure reasons', err);
    });

}



