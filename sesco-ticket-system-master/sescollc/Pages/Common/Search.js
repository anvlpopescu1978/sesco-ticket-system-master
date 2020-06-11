function pageContentLoad(sender, args, role) {
    /// <summary>Page content load</summary>

    if (Shp.Page.GetParameterFromUrl('criteria') === '') {
        ShowData([]);
        return;
    }

    let ids = Shp.Page.GetParameterFromUrl('criteria').split(';');
    let caml = '<View>' +
        '<Query>' +
        '<Where>' +
        '<In>' +
        '<FieldRef Name="ID" />' +
        '<Values>';
    for (let i = 0; i < ids.length; i++) {
        caml += '<Value Type="Integer">' + ids[i] + '</Value>';
    }
    caml += '</Values>' +
        '</In>' +
        '</Where>' +
        '</Query>' +
        '</View>';

    $SPData.GetListItems('SupportTickets', caml).then(function (results) {
        let items = [];
        for (let k = 0; k < results.get_count(); k++) {
            let item = results.itemAt(k);
            item['ID'] = item.get_id();
            item['TicketTitke'] = item.get_item('TicketTitke');
            item['TicketType'] = item.get_item('TicketType');
            item['TicketPriority'] = item.get_item('TicketPriority');
            item['TicketStatus'] = item.get_item('TicketStatus');
            item['SupportAgent'] = item.get_item('SupportAgent') === null ? '' : item.get_item('SupportAgent').get_lookupValue();
            item['Submtter'] = item.get_item('Submtter') === null ? '' : item.get_item('Submtter').get_lookupValue();
            item['Author'] = item.get_item('Author').get_lookupValue();
            item['Created'] = item.get_item('Created').format('yyyy-MM-dd');
            items.push(item);
        }
        ShowData(items);
    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot get data from server', err);
    });
}



function ShowData(data) {

    jq('#dataTable').DataTable({
        'initComplete': function (settings, json) {

            jq('#dataTable tbody td.details-control2').click(function () {
              
                let tr = jq(this).closest('tr');
                let id = tr.find('td').eq(2).text();
                EditRequest(id);
            });

        },
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
            { data: 'SupportAgent' },
            { data: 'Submtter' },
            { data: 'Author' },
            { data: 'Created' }]
    });

}