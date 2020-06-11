function pageContentLoad() {




    let currentDate = new Date();
    let firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()));

    let caml = '<View>' +
        '<Query>' +
        '<Where>' +
        '<And>' +
        '<Geq><FieldRef Name="Created" /><Value Type="DateTime">' + firstDate.format('yyyy-MM-dd') + '</Value></Geq>' +
        '<Leq><FieldRef Name="Created" /><Value Type="DateTime">' + lastDate.format('yyyy-MM-dd') + '</Value></Leq>' +
        '</And>' +
        '</Where>' +
        '</Query>' +
        '</View > ';

    let getTickets = $SPData.GetListItems('SupportTickets', caml);
    let getTypes = $SPData.GetListItems('RequestTypes', '<View></View>');
    let getNotification = GetNotifications();
    Promise.all([getTypes, getTickets, getNotification]).then(function (results) {
        let types = results[0];
        let tickets = results[1];
        let notifications = results[2];
        let source = {};
        for (k = 0; k < types.get_count(); k++) {
            source[types.itemAt(k).get_item('RequestType')] = 0
        }

        for (let i = 0; i < tickets.get_count(); i++) {
            let ticket = tickets.itemAt(i);
            if (source.hasOwnProperty(ticket.get_item('TicketType')) === true) {
                source[ticket.get_item('TicketType')]++;
            }
        }

        ShowData(source);
        ShowNotifications(notifications);

    }, function (err) {
        Shp.Dialog.ErrorDialog.show('Cannot get data', err);
    });


}


function ShowNotifications(notifications) {

    if (notifications.length === 0) {
        jq('#notificationArea').html('No notifications');
        return;
    }

    let html = '';
    for (let i = 0; i < notifications.length; i++) {
        let notification = notifications[i];
        html += '<a href="#" class="list-group-item" data-placement="left" data-toggle="popover" data-html="true" data-content="' + htmlEncode(notification['Message'])  + '">' +
            notification['Title'] + ' ' +
            '<span class="pull-right text-muted small"><em>' + notification['Created'].split('T')[0] + '</em></span>' +
            ' </a>';
    }
    jq('#notificationArea').html(html);
    jq('#notificationArea a').popover({
        html: true
    });
}

function GetNotifications() {
    let promise = new Promise(function (resolve, reject) {
        let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('Notifications')/items?$select=*&$orderby=Created desc";
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


function ShowData(source) {
    let dataSource = [];
    for (let prop in source) {
        dataSource.push({ 'TicketType': prop, 'Count': source[prop] });
    }


    jq('#dataTable').DataTable({
        dom: 'lBfrtip',
        buttons: [
            'excelHtml5',
        ],
        scrollX: false,
        data: dataSource,
        info: false,
        paging: false,
        ordering: false,
        searching: false,
        columns: [
            {
                data: 'TicketType'
            },
            {
                data: 'Count'
            }]

    });
}



function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}



function htmlEncode(html) {
    var buf = [];

    for (var i = html.length - 1; i >= 0; i--) {
        buf.unshift(['&#', html[i].charCodeAt(), ';'].join(''));
    }

    return buf.join('');
}