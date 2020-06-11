function pageContentLoad(sender, args, role, team) {


  

    if (role !== 'Super Administrator') {
        Shp.Dialog.ErrorDialog.show('Access denied', 'Only super administrators are allowed to acccess the page', function () {
            NavigateToPage('/Pages/Common/AccessDenied.aspx')
        });
        return;
    }
    

    let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('ImpactedSystems')/items";
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


function UpdateRanking() {
    let rankings = [];
    jq('#dataTable tbody tr input[id*="Ranking"]').each(function () {
        let c = jq(this);
        rankings.push({
            'ID': c.data('id'),
            'Ranking': c.val()
        });
    });

    $SPData.UpdateItems('ImpactedSystems', rankings).then(function (items) {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot update rankings', err);
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
                    return '<button type="button" onclick="DeteleComponent(\'' + d['ID'] + '\', this)" class="btn btn-xs btn-danger">Del.</button>';
                }
            },
            {
                data: 'ImpactedSystem'
            },
            {
                data: null,
                defaultContent: '',
                render: function (d, row) {
                    return '<input type="number" id="Ranking' + d['ID'] + '" data-id="' + d['ID'] + '" value="' + d['Ranking'] + '" />'
                }

            }]
    });
}



function DeteleComponent(componentId, el) {
    $SPData.DeleteItem('ImpactedSystems', componentId).then(function () {
        jq(el).closest('tr').remove();
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot delete component', err);
    });

}



function AddISO() {

    let iso = {
        'ImpactedSystem': $select('ISOName').get_value(),
        'Ranking': document.querySelectorAll('#dataTable tbody tr').length * 10 + 10
    };

    $SPData.AddItem('ImpactedSystems', iso).then(function (item) {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot add component', err);
    });
}



