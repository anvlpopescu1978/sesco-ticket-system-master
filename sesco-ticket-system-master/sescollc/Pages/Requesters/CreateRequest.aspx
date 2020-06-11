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
            <asp:ScriptReference Path="CreateRequest.js" />
        </Scripts>
    </asp:ScriptManagerProxy>

    <div class="row">
        <div class="col-lg-12">
             <h1 class="page-header">Create Request</h1>
             <div class="panel panel-default">
                 <div class="panel-heading">
                     <!-- Form here -->

     <div class="form-group">
        <label>Title <span class="ms-accentText">*</span></label>
        <SharePoint:InputFormTextBox runat="server" required="required"  CssClass="form-control" ID="TicketTitle" ClientIDMode="Static" MaxLength="200" />
     </div>

      <div class="form-group">
        <label>Ticket Type <span class="ms-accentText">*</span></label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="TicketType" DataSourceID="DSTicketType" DataTextField="RequestType" DataValueField="RequestType" required="required" onchange="javascript:ticketTypeChange()">
            <asp:ListItem Text="..." Value="" />
        </SharePoint:DVDropDownList>
     </div>

    <div class="form-group">
            <label>Assigned To</label>
            <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="AssignedTo" DataSourceID="DSUsers" DataTextField="UserName1" DataValueField="UserLogin" required="required">
                <asp:ListItem Text="..." Value="" />
            </SharePoint:DVDropDownList>
     </div>

     <div class="form-group" style="display:none">
          <label>Support Team</label>
          <SharePoint:InputFormTextBox runat="server" ReadOnly="true" required="required"  CssClass="form-control" ID="SupportTeam" ClientIDMode="Static" MaxLength="200" />
     </div>

     <div class="form-group" style="display:none">
          <label>Support Team ID</label>
          <SharePoint:InputFormTextBox runat="server" ReadOnly="true" required="required"  CssClass="form-control" ID="TeamID" ClientIDMode="Static" MaxLength="200" />
     </div>


      <div class="form-group" data-enhaced="enhaced" id="bussinessFunctionRow" style="display:none">
        <label>Business Function <span class="ms-accentText">*</span></label>
         <SharePoint:DVListBox runat="server" SelectionMode="Multiple"   SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="BusinessFunction" DataTextField="BusinessFunction" DataValueField="BusinessFunction" DataSourceID="DSFunctions" required="required">
         </SharePoint:DVListBox> 
     </div>

    <div class="form-group" style="display:none">
       <label>Products <span class="ms-accentText">*</span></label>
         <SharePoint:DVListBox runat="server" SelectionMode="Multiple"   SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="Products" required="required">
        </SharePoint:DVListBox> 
    </div>

     <div class="form-group">
        <label>Prority <span class="ms-accentText">*</span></label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="TicketPriority" required="required">
            <asp:ListItem Text="..." Value="" />
        </SharePoint:DVDropDownList>
     </div>

     <div class="form-group" data-enhaced="enhaced" id="impactedSystemRow" style="display:none">
        <label>Impacted System <span class="ms-accentText">*</span></label>
          <SharePoint:DVListBox runat="server" SelectionMode="Multiple"   SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="ImpactedSystem" DataSourceID="DSSystems" DataTextField="ImpactedSystem" DataValueField="ImpactedSystem" required="required">
             <asp:ListItem Text="..." Value="" />
         </SharePoint:DVListBox> 
     </div>

     <div class="form-group" id="impactedISORow" style="display:none">
         <label>Impacted ISO <span class="ms-accentText">*</span></label>
         <SharePoint:DVListBox runat="server" SelectionMode="Multiple" ClientIDMode="Static" ID="ImpactedISO" DataSourceID="DSIso" DataTextField="Title" DataValueField="Title">
         </SharePoint:DVListBox>
     </div>

     <div class="form-group" data-enhaced="enhaced" id="impactedComponentsRow" style="display:none">
         <label>Impacted Areas <span class="ms-accentText">*</span></label>
         <SharePoint:DVListBox runat="server" SelectionMode="Multiple"   SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="ImpactedComponent" DataSourceID="DSComponents" DataTextField="Title" DataValueField="Title">
             <asp:ListItem Text="..." Value="" />
         </SharePoint:DVListBox> 
     </div>


      <div class="form-group" style="display:none">
         <label>Business Impact </label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="ImpactScore" required="required">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="High" Value="High" />
            <asp:ListItem Text="Medium" Value="Medium" />
            <asp:ListItem Text="Low" Value="Low" />
        </SharePoint:DVDropDownList>
     </div>

      <div class="form-group" style="display:none">
         <label>Desired Timeline</label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="UrgencyScore" required="required">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="< 1 Month" Value="< 1 Month" />
            <asp:ListItem Text="1<2 Months" Value="1<2 Months" />
            <asp:ListItem Text="2 < 4 Months" Value="2 < 4 Months" />
            <asp:ListItem Text="4+ Months" Value="4+ Months" />
        </SharePoint:DVDropDownList>
     </div>


      <div class="form-group" style="display:none">
         <label>Business Value</label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="RoiScore" required="required">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="Profitability" Value="Profitability" />
            <asp:ListItem Text="Efficiency" Value="Efficiency" />
            <asp:ListItem Text="User Experience" Value="User Experience" />
            <asp:ListItem Text="Undetermined" Value="Undetermined" />
        </SharePoint:DVDropDownList>
     </div>

    <div  class="form-group" style="display:none">
         <label>Due Date</label>
         <SharePoint:InputFormTextBox runat="server" TextMode="Date" required="required"  CssClass="form-control" ID="DueDate" ClientIDMode="Static" MaxLength="200" />
    </div>

     <div class="form-group">
        <label>Description <span class="ms-accentText">*</span></label>
        <SharePoint:InputFormTextBox RichText="False" RichTextMode="Compatible" required="required" runat="server" CssClass="form-control" ID="TicketDescription" ClientIDMode="Static" TextMode="MultiLine" />
     </div>

     <div class="form-group">
        <label>Comments</label>
        <SharePoint:InputFormTextBox RichText="False" RichTextMode="Compatible"  runat="server" CssClass="form-control" ID="TicketComments" ClientIDMode="Static" TextMode="MultiLine" />
     </div>

    <div class="form-group">
        <label>Requestor</label>
        <SharePoint:ClientPeoplePicker runat="server"  ID="Submitter" AllowMultipleEntities="false" ClientIDMode="Static" />
    </div>

     <div class="form-group">
         <label>File</label>
         <input type="file" id="file1" multiple class="form-control" />
     </div>

    <div class="form-group">
        <button type="button" class="btn btn-sm btn-primary" onclick="javascript:CreateRequest()">Create Ticket</button>
    </div>


                     <!-- End of form here -->
                </div>
             </div>
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



<SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSFunctions" UseInternalName="true" UseServerDataFormat="true" 
        SelectCommand='<![CDATA[<View><Query><OrderBy><FieldRef Name="BusinessFunction" /></OrderBy></Query></View>]]>'>
    <SelectParameters>
        <asp:Parameter Name="ListName" DefaultValue="BusinessFunctions" />
    </SelectParameters>
</SharePoint:SPDataSource>

    <SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSSystems" UseInternalName="true" UseServerDataFormat="true" 
        SelectCommand='<![CDATA[<View><Query><OrderBy><FieldRef Name="Ranking" Type="Number" Ascending="TRUE" /></OrderBy></Query></View>]]>'>
    <SelectParameters>
        <asp:Parameter Name="ListName" DefaultValue="ImpactedSystems" />
    </SelectParameters>
</SharePoint:SPDataSource>


 <SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSComponents" UseInternalName="true" UseServerDataFormat="true" 
        SelectCommand='<![CDATA[<View><Query><OrderBy><FieldRef Name="Ranking" Type="Number" Ascending="TRUE" /></OrderBy></Query></View>]]>'>
    <SelectParameters>
        <asp:Parameter Name="ListName" DefaultValue="ImpactedComponents" />
    </SelectParameters>
</SharePoint:SPDataSource>

 <SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSIso" UseInternalName="true" UseServerDataFormat="true" 
        SelectCommand='<![CDATA[<View><Query><OrderBy><FieldRef Name="Ranking" Type="Number" Ascending="TRUE" /></OrderBy></Query></View>]]>'>
    <SelectParameters>
        <asp:Parameter Name="ListName" DefaultValue="ISO" />
    </SelectParameters>
</SharePoint:SPDataSource>

<SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSUsers" UseInternalName="true" UseServerDataFormat="true" 
        SelectCommand='<![CDATA[<View><Query><OrderBy><FieldRef Name="UserEmail" /></OrderBy></Query></View>]]>'>
    <SelectParameters>
        <asp:Parameter Name="ListName" DefaultValue="Users" />
    </SelectParameters>
</SharePoint:SPDataSource>
    

</asp:Content>
