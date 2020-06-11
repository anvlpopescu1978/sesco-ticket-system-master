<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/sesco.master" Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link href="../../Content/corev15.css" rel="stylesheet" type="text/css"/>
    <link href="../../Content/Bootstrap/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/FontAwesome/fontawesome.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/DataTable/datatables.css" />
    <link href="../../Content/App.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ContentPlaceHolderID="ContentPlaceHolderMaim" runat="server">
    <asp:ScriptManagerProxy runat="server">
        <Scripts>
            <asp:ScriptReference Path="../../Scripts/Framework/Dialog/sharepoint.dialog.js" />
            <asp:ScriptReference Path="../../Scripts/Framework/DataTable/datatables.js" />
            <asp:ScriptReference Path="Teams.js" />
        </Scripts>
    </asp:ScriptManagerProxy>

<div class="row">
         <h1 class="page-header">Add New Team</h1>

    <div class="panel panel-default">
     <div class="panel-heading">
    <div class="form-group">
         <label>Team Name <span class="ms-accentText">*</span></label>
        <SharePoint:InputFormTextBox runat="server" ID="TeamName" ClientIDMode="Static" MaxLength="100" CssClass="form-control" required="required" />
    </div>


    <div class="form-group">
           <label>Ticket Type <span class="ms-accentText">*</span></label>
            <SharePoint:DVDropDownList runat="server" ClientIDMode="Static" CssClass="form-control" ID="TicketType" DataSourceID="DSTypes" DataTextField="RequestType" DataValueField="RequestType" AppendDataBoundItems="true" required="required">
                <asp:ListItem Text="..." Value="" />
           </SharePoint:DVDropDownList>
    </div>

     <div class="form-group">
        <button type="button" class="btn btn-primary btn-sm" onclick="AddTeam()">Add Team</button>
     </div>
    </div>
    </div>
</div>


    <div class="row">
        <div class="col-lg-12">
             <h1 class="page-header">Users</h1>
             <table class="table table-striped nowrap table-bordered table-hover dataTable no-footer dtr-inline" id="dataTable" width="100%" cellspacing="0">
                 <thead>
                     <tr>
                         <th></th>
                         <th>Team</th>
                         <th>Ticket Type</th>
                     </tr>
                 </thead>
                 <tbody>

                 </tbody>
             </table><br />
            <div class="row">
                <button type="button" class="btn btn-md btn-primary" onclick="javascript:UpdateUsers()">Update Users</button>
            </div>
        </div>
    </div>



    <SharePoint:SPDataSource runat="server" ID="DSTypes" UseInternalName="true" SelectCommand='<![CDATA[<View></View>]]>'>
        <SelectParameters>
            <asp:Parameter Name="ListName"  DefaultValue="RequestTypes" />
        </SelectParameters>
    </SharePoint:SPDataSource>
    

</asp:Content>
