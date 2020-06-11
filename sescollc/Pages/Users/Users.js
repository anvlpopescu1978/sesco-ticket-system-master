function pageContentLoad(sender, args) {

    jq('#Team').multiselect({
        numberDisplayed: 100
    });

    Shp.Dialog.WaittingDialog.show("Getting users. Please wait.")
    let getUsers = GetUsers();
    let getTeams = $SPData.GetListItems('Teams', '<View></View>');

    Promise.all([getUsers, getTeams]).then(function (results) {
        ShowData(results[0], results[1]);
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Cannot get users", err);
    });
}


function GetUsers() {

    let promise = new Promise(function (resolve, reject) {
        let url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('Users')/items?$expand=Team&$select=ID,UserName1,UserEmail,Role,UserLogin,Team/ID,Team/Team";
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


function ShowData(data, teams) {

    jq('#dataTable').DataTable({
        data: data,
        info: false,
        ordering: false,
        scrollXInner: true,
        paging: false,
        drawCallback: function (settings) {
            jq('#dataTable select[id*="team"]').multiselect();
            Shp.Dialog.WaittingDialog.hide();
        },
        columns: [
            {
                data: function (row) {
                    return '<button type="button" class="btn btn-xs btn-danger" onclick="javascript:DeleteUser(\'' + row['ID'] + '\')">Del.</button>';
                }
            },
            { data: 'UserName1' },
            { data: 'UserEmail' },
            {
                data: function (row) {
                    let roles = ['Power User', 'Administrator', 'Super Administrator'];
                    let role = row['Role'];
                    let html = '<select  id="role' + row['ID'] + '" class="form-control" data-itemid="' + row['ID'] + '">';
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i] === role) {
                            html += '<option value="' + roles[i] + '" selected="selected">'  + roles[i] + '</option>';
                        }
                        else {
                            html += '<option value="' + roles[i] + '">' + roles[i] + '</option>';
                        }
                    }
                    html += '</select>';
                    return html;
                }
            },
            {           
                data: function (row) {

                    let r = [];
                    for (let k = 0; k < row['Team']['results'].length; k++) {
                        r.push(row['Team']['results'][k]['ID']);
                    }
               
                    let t = teams;
                    let html = '<select multiple id="team'  + row['ID'] + '" class="form-control" data-itemid="' + row['ID'] + ' ">';
                    for (let i = 0; i < t.get_count(); i++) {
                        let current_team = t.itemAt(i);
                        if (Array.contains(r,current_team.get_item('ID')) === true) {
                            html += '<option selected="selected" value="' + current_team.get_item('ID') + '">' + current_team.get_item('Team') + '</Value>';
                        }
                        else {
                            html += '<option value="' + current_team.get_item('ID') + '">' + current_team.get_item('Team') + '</Value>';
                        }
                    }
                    html += '</select>';
                    return html;
                }

            }]


    });

}

function AddNewUser() {

    var newUser = $selectClientPicker('NewUserToAdd').get_allUserInfo()[0];
    // Validation
    var errors = 0;
    if (newUser === undefined) {
        errors++;
    }
    if ($select('UserRole').check_validity() === false) {
        errors++;
    }

    if ($select('Team').check_validity() === false) {
        errors++;
    }

    if (errors > 0) {
        Shp.Dialog.ErrorDialog.show("Invalid fields values", "Please complete all the fields.")
        return;
    }
    // End Validation

    Shp.Dialog.WaittingDialog.show('Adding new user');
    var user = {};
    user['UserName1'] = newUser.DisplayText;
    user['UserEmail'] = newUser.Description;
    user['UserLogin'] = newUser.Key;
    user['Team'] = $select('Team').get_lookupIds();
    user['UserAccount'] = SP.FieldUserValue.fromUser(newUser.Key);
    user['Role'] = $select('Role').get_value();

    $SPData.AddItem('Users', user).then(function (item) {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show('Cannot add user', err);
    });
        
}


function DeleteUser(userId) {
    Shp.Dialog.WaittingDialog.show('Deleting selected user');

    $SPData.DeleteItem('Users', userId).then(function () {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show('Cannot delete user', err);
    });
}


function UpdateUsers() {

    let users = [];
    jq('#dataTable tbody select[id*="role"]').each(function (index) {
        let el = jq(this);
        let user = {
            'ID': el.data('itemid'),
            'Role': el.val(),
            'Team': $select('team' + el.data('itemid')).get_lookupIds()
        }
        users.push(user);
    });

    if (users.length === 0) {
        return;
    }

    Shp.Dialog.WaittingDialog.show("Updating users");
    $SPData.UpdateItems('Users', users).then(function () {
        window.top.location.href = window.location.href;
    }, function (err) {
        Shp.Dialog.WaittingDialog.hide();
        Shp.Dialog.ErrorDialog.show("Cannot update users", err);
    });

}
