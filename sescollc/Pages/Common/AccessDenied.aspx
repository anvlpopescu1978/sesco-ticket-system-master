<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/sesco.master" Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link href="../../Content/corev15.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/Bootstrap/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/Bootstrap/bootstrap-multiselect.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/FontAwesome/fontawesome.css" rel="stylesheet" type="text/css" />
    <link href="../../Content/App.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ContentPlaceHolderID="ContentPlaceHolderMaim" runat="server">
    <asp:ScriptManagerProxy runat="server">
        <Scripts>
            <asp:ScriptReference Path="../../Scripts/Framework/Mail/sharepoint.mail.js" />
            <asp:ScriptReference Path="../../Scripts/Framework/Dialog/sharepoint.dialog.js" />
            <asp:ScriptReference Path="../../Scripts/Framework/Bootstrap/bootstrap-multiselect.js" />
        </Scripts>
    </asp:ScriptManagerProxy>

    <div class="row">
        <br /><br /><br />
        <div class="col-md-2 text-center">
                <p><i class="fa fa-exclamation-triangle fa-5x" style="color:#D9534F"></i></p>
        </div>
         <div class="col-md-10">         
              <h3>OPPSSS!!!! Sorry...</h3>
               <p>Sorry, your access is refused due to security reasons.<br/></p>
         </div>
    </div>





</asp:Content>
