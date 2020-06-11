function pageContentLoad(sender, args, role, team) {


  

    if (role !== 'Super Administrator') {
        Shp.Dialog.ErrorDialog.show('Access denied', 'Only super administrators are allowed to acccess the page', function () {
            NavigateToPage('/Pages/Common/AccessDenied.aspx')
        });
        return;
    }
    

    let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('BusinessFunctions')/items?$select=*";
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
        scrollX: false,
        data: data,
        info: false,
        ordering: true,
        paging: false,
        columns: [
            {
                data: null,
                render: function (d, row, index) {
                    return '<button type="button" onclick="DeleteBF(\'' + d['ID'] + '\', this)" class="btn btn-xs btn-danger">Del.</button>';
                }
            },
            {
                data: 'BusinessFunction'
            }]
    });
}



function DeleteBF(componentId, el) {
    $SPData.DeleteItem('BusinessFunctions', componentId).then(function () {
        jq(el).closest('tr').remove();
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot delete component', err);
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



