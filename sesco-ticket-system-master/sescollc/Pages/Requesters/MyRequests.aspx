﻿<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/sesco.master" Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link href="../../Content/Bootstrap/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/FontAwesome/fontawesome.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/DataTable/datatables.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/DataTable/datatables.buttons.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/DataTable/colReorder.dataTables.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/App.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ContentPlaceHolderID="ContentPlaceHolderMaim" runat="server">
    <asp:ScriptManagerProxy runat="server">
        <Scripts>
            <asp:ScriptReference Path="../../Scripts/Framework/Dialog/sharepoint.dialog.js" />
            <asp:ScriptReference Path="../../Scripts/Framework/DataTable/jszip.js" />
            <asp:ScriptReference Path="../../Scripts/Framework/DataTable/datatables.js" />
            <asp:ScriptReference Path="../../Scripts/Framework/DataTable/colReorder.dataTables.js" />
            <asp:ScriptReference Path="../../Scripts/Framework/DataTable/datatables.button.js" />
            <asp:ScriptReference Path="../../Scripts/Framework/DataTable/buttons.colVis.js" />
            <asp:ScriptReference Path="../../Scripts/Framework/DataTable/buttons.html5.js" />
            <asp:ScriptReference Path="MyRequests.js" />
        </Scripts>
    </asp:ScriptManagerProxy>

    <div class="row">
        <div class="col-lg-12">
             <h1 class="page-header"><i class="fa fa-support fa-fw" style="color:#fc3"></i> My Requests</h1>
             <table class="table table-striped nowrap table-bordered table-hover dataTable no-footer dtr-inline" id="dataTable" width="100%" cellspacing="0">
                 <thead>
                     <tr>
                         <th></th>
                         <th></th>
                         <th>Ticket ID</th>
                         <th>Title</th>
                         <th>Type</th>
                         <th>Prority</th>
                         <th>Status</th>
                         <th>Assigned To</th>
                         <th>Requestor</th>
                         <th>Created By</th>
                         <th>Submitted Date</th>
                     </tr>
                 </thead>
                 <tbody>

                 </tbody>
             </table>
        </div>
    </div>

<SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSTicketType" UseInternalName="true" UseServerDataFormat="true" 
        SelectCommand='<![CDATA[<View><Query><OrderBy><FieldRef Name="Ranking" /></OrderBy></Query></View>]]>'>
    <SelectParameters>
        <asp:Parameter Name="ListName" DefaultValue="RequestTypes" />
    </SelectParameters>
</SharePoint:SPDataSource>

<SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSPriorities" UseInternalName="true" UseServerDataFormat="true" 
        SelectCommand='<![CDATA[<View><Query><OrderBy><FieldRef Name="Ranking" /></OrderBy></Query></View>]]>'>
    <SelectParameters>
        <asp:Parameter Name="ListName" DefaultValue="Priorities" />
    </SelectParameters>
</SharePoint:SPDataSource>



    

</asp:Content>
