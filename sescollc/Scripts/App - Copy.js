function pageLoad(sender, args) {


    let team = null;

    var profilePictureUrl = _spPageContextInfo.webAbsoluteUrl +
        '/_layouts/15/userphoto.aspx?size=S&username=' +
        escapeProperly(_spPageContextInfo.userEmail);
    jq('#welcome').html('Welcome ' + _spPageContextInfo.userDisplayName);
    jq('#profilepicture').html('<img style="height: 40px; width: 40px" src="' + profilePictureUrl + '/" />');


    visualAdjusments();
    jq(window).bind('resize', function () {
        visualAdjusments();
    });



    if (_spPageContextInfo.isSiteAdmin === true) {
        jq('#usersArea, #teamArea, #adminArea').show();
        if (typeof (pageContentLoad) === 'function') {
            pageContentLoad(sender, args, 'Administrator', null);
        }
    }
    else {
        $SPData.GetItems('Users', '<View><Query><Where><Eq><FieldRef Name="UserAccount" /><Value Type="Text"><UserID /></Value></Eq></Where></Query></View>')
            .then(function (items) {

             

                // User not found means is normal users
                if (items.get_count() === 0) {
                    pageContentLoad(sender, args, 'User', null);
                    return;
                }

                let role = items.itemAt(0).get_item('Role');
                team = items.itemAt(0).get_item('Team');

                if (role === 'Administrator') {
                    jq('#usersArea, #teamArea, #adminArea').show();
                }
                else {
                    jq('#teamArea').show();
                }

                // Run page content load with the role
                if (typeof (pageContentLoad) === 'function') {
                    pageContentLoad(sender, args, role, team);
                }

            }, function (err) {
            });
    }

}

function redirectToDeniedPage() {
    if (_spPageContextInfo.serverRequestPath.toLowerCase().includes('/pages/accessdenied.aspx') === false) {
        NavigateToPage('/Pages/AccessDenied.aspx');
    }
}

function applySecurityTrimmig() {

    var userRole = '';

    // If user is site admin, show all menus
    if (_spPageContextInfo.isSiteAdmin === true) {
        jQuery('#manageProductsMenu, #customerMenu, #assignedToMeMenu, #ordersAdminMenu, #currenciesAndCountriesMenu, #currenciesAndCountriesMenu, #manageUsers, #savetoexternallib, #contractTemplates').show();
        userRole = 'Site Admin';
        return;
    }

    // User is not site admin
    var query = '<View><Query><Where><Eq><FieldRef Name="EntityUser" LookupId="TRUE" /><Value Type="Integer"><UserID /></Value></Eq></Where></Query></View>';
    Shp.Lists.GetItems('Users', null, query, function (items) {

        // User cannot be found in the list, no access at all
        if (items.get_count() === 0) {
            redirectToDeniedPage();
            return;
        }

        // Show menu items
        var role = items.itemAt(0).get_item('Role');

        switch (role) {
            case 'User':
                jQuery('#customerMenu').show();
                break;
            case 'Power User':
                jQuery('#usersArea, #manageProductsMenu, #customerMenu, #assignedToMeMenu, #currenciesAndCountriesMenu, #currenciesAndCountriesMenu').show();
                break;
            case 'Administrator':
            case 'Administrator (no email)':
                jQuery('#usersArea, #manageProductsMenu, #customerMenu, #assignedToMeMenu, #ordersAdminMenu, #currenciesAndCountriesMenu, #currenciesAndCountriesMenu, #manageUsers, #savetoexternallib, #contractTemplates').show();
                break;
        }

        // Redirect to denied page if no access

        if (_spPageContextInfo.serverRequestPath.toLowerCase().includes('/pages/suppliers/') === true) {
            if (!(role === 'Administrator' || role === 'Administrator (no email)' || role === 'Power User')) {
                redirectToDeniedPage();
            }
        }
        else if (_spPageContextInfo.serverRequestPath.toLowerCase().includes('/pages/team/') === true) {
            if (!(role === 'Administrator' || role === 'Administrator (no email)' || role === 'Power User')) {
                redirectToDeniedPage();
            }
        }
        else if (_spPageContextInfo.serverRequestPath.toLowerCase().includes('/pages/products/') === true) {
            if (!(role === 'Administrator' || role === 'Administrator (no email)' || role === 'Power User')) {
                redirectToDeniedPage();
            }
        }
        else if (_spPageContextInfo.serverRequestPath.toLowerCase().includes('/pages/currencies/') === true) {
            if (!(role === 'Administrator' || role === 'Administrator (no email)' || role === 'Power User')) {
                redirectToDeniedPage();
            }
        }
        else if (_spPageContextInfo.serverRequestPath.toLowerCase().includes('/pages/countries/') === true) {
            if (!(role === 'Administrator' || role === 'Administrator (no email)' || role === 'Power User')) {
                redirectToDeniedPage();
            }
        }
        else if (_spPageContextInfo.serverRequestPath.toLowerCase().includes('/pages/users/') === true) {
            if (!(role === 'Administrator' || role === 'Administrator (no email)')) {
                redirectToDeniedPage();
            }
        }
        else if (_spPageContextInfo.serverRequestPath.toLowerCase().includes('/pages/catalogues/') === true) {
            if (!(role === 'Administrator' || role === 'Administrator (no email)' || role === 'Power User')) {
                redirectToDeniedPage();
            }
        }
        else if (_spPageContextInfo.serverRequestPath.toLowerCase().includes('/pages/administration/') === true) {
            if (!(role === 'Administrator' || role === 'Administrator (no email)')) {
                redirectToDeniedPage();
            }
        }

    }, function (err) {
        alert("Cannot apply security trimming: " + err);
    });
}




function visualAdjusments() {
    var topOffset = 50;
    var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;

    if (width < 768 || _isMobile() === true) {
        jQuery('div.navbar-collapse').addClass('collapse');
        topOffset = 100; // 2-row-menu
    } else {
        jQuery('div.navbar-collapse').removeClass('collapse');
    }

    var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
    height = height - topOffset;
    if (height < 1) height = 1;
    if (height > topOffset) {
        jQuery("#page-wrapper").css("min-height", (height) + "px");
    }
}


function _isMobile() {
    // if we want a more complete list use this: http://detectmobilebrowsers.com/
    // str.test() is more efficent than str.match()
    // remember str.test is case sensitive
    var isMobile = (/iphone|ipod|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase());
    return isMobile;
}


function NavigateToPage(url) {
    /// <summary>Navigate to page</summary>
    window.top.location.href = _spPageContextInfo.webAbsoluteUrl + url;
}


function ShowMenuItem(item) {

    var subMenuItems = ['#requestersMenu', '#adminMenu', '#teamMenu', '#userMenu', '#superAdminMenu'];


    for (var i = 0; i < subMenuItems.length; i++) {
        if (subMenuItems[i] !== item) {
            jq(subMenuItems[i]).hide();
        }
        else {
            jQuery(subMenuItems[i]).toggle();

        }
    }

}



let adidasEmailTextToAdd = '';






