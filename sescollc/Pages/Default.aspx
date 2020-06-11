<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/sesco.master" Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link href="../Content/Bootstrap/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="../Content/DataTable/datatables.css" rel="stylesheet" type="text/css" />
    <link href="../Content/DataTable/datatables.buttons.css" rel="stylesheet" type="text/css" />
    <link href="../Content/FontAwesome/fontawesome.css" rel="stylesheet" type="text/css" />
    <link href="../Content/App.css" rel="stylesheet" type="text/css" />
    <style>
	    canvas {
		    -moz-user-select: none;
		    -webkit-user-select: none;
		    -ms-user-select: none;
	    }
    </style>
</asp:Content>
<asp:Content ContentPlaceHolderID="ContentPlaceHolderMaim" runat="server">
    <asp:ScriptManagerProxy runat="server">
        <Scripts>
            <asp:ScriptReference Path="../Scripts/Framework/Dialog/sharepoint.dialog.js" />
            <asp:ScriptReference Path="../Scripts/Framework/Data/sharepoint.data.js" />
            <asp:ScriptReference Path="../Scripts/Framework/DataTable/jszip.js" />
            <asp:ScriptReference Path="../Scripts/Framework/DataTable/datatables.js" />
            <asp:ScriptReference Path="../Scripts/Framework/DataTable/datatables.button.js" />
            <asp:ScriptReference Path="../Scripts/Framework/DataTable/buttons.colVis.js" />
            <asp:ScriptReference Path="../Scripts/Framework/DataTable/buttons.html5.js" />
            <asp:ScriptReference Path="Default.js" />
        </Scripts>
    </asp:ScriptManagerProxy>
    <br /><br />
    <div class="row">
        <div class="col-lg-8">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <i class="fa fa-bar-chart-o fa-fw"></i>&#160;
                    Current Month Report
                </div>
                <div class="panel-body">
                 <table class="table table-striped nowrap table-bordered table-hover dataTable no-footer dtr-inline" id="dataTable" width="100%" cellspacing="0">
                     <thead>
                         <tr>
                             <th>Ticket Type</th>
                             <th>#Tickets</th>
                         </tr>
                     </thead>
                     <tbody>

                     </tbody>
                 </table>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
          <div class="panel panel-default">
                <div class="panel-heading">
                    <i class="fa fa-bell fa-fw"></i>&#160;
                    Notifications
                </div>
              <div class="panel-body">
                  <div class="list-group" id="notificationArea">
                  </div>
              </div>
          </div>
        </div>
    </div>
            
</asp:Content>
