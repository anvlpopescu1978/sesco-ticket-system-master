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
            <asp:ScriptReference Path="EditRequest.js" />
        </Scripts>
    </asp:ScriptManagerProxy>

    <div class="row">
        <div class="col-lg-12">
             <h1 class="page-header">Edit Ticket</h1>
             <div class="panel panel-default">
                 <div class="panel-heading">

    <!-- Navigation -->
    <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item">
            <a class="nav-link" id="ticket-tab" data-toggle="tab" href="#ticket" role="tab" aria-controls="ticket" aria-selected="true">Ticket</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="attachments-tab" data-toggle="tab" href="#attachments" role="tab" aria-controls="attachments" aria-selected="false">Attachments</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="history-tab" data-toggle="tab" href="#history" role="tab" aria-controls="history" aria-selected="false">Comments</a>
          </li>
           <li class="nav-item">
              <a class="nav-link" href="javascript:GoBackToSource()">Go Back</a>
           </li>
    </ul>
    <!-- End of navigation -->
    <!-- Tab content -->
    <div class="tab-content">
      <div class="tab-pane active" id="ticket" role="tabpanel" aria-labelledby="ticket-tab">
          <!-- Edit ticket -->
          <br />
         <div class="form-group">
            <label>Title <span class="ms-accentText">*</span></label>
            <SharePoint:InputFormTextBox runat="server" required="required"  CssClass="form-control" ID="TicketTitle" ClientIDMode="Static" MaxLength="200" />
         </div>

         <div class="form-group">
            <label>Ticket Type <span class="ms-accentText">*</span></label>
            <SharePoint:InputFormTextBox runat="server" required="required"  CssClass="form-control" ID="TicketType" ReadOnly="true" ClientIDMode="Static" MaxLength="200" />
         </div>

         <div class="form-group">
            <label>Prority <span class="ms-accentText">*</span></label>
            <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="TicketPriority" DataSourceID="DSPriorities" DataTextField="TicketPriority" DataValueField="TicketPriority" required="required" onchange="javascript:CalculateTotalScore()">
                <asp:ListItem Text="..." Value="" />
            </SharePoint:DVDropDownList>
         </div>

          <div class="form-group">
              <label>Dev Prority</label>
            <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="DevPriority">
                <asp:ListItem Text="..." Value="" />
                <asp:ListItem Text="1" Value="1" />
                <asp:ListItem Text="2" Value="2" />
                <asp:ListItem Text="3" Value="3" />
                <asp:ListItem Text="4" Value="4" />
                <asp:ListItem Text="5" Value="5" />
                <asp:ListItem Text="6" Value="6" />
                <asp:ListItem Text="7" Value="7" />
                <asp:ListItem Text="8" Value="8" />
                <asp:ListItem Text="9" Value="9" />
                <asp:ListItem Text="10" Value="10" />
            </SharePoint:DVDropDownList>
          </div>

          <div class="form-group">
              <label>Status <span class="ms-accentText">*</span></label>
               <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="TicketStatus" required="required" onchange="javascript:StatusChanged()">
                    <asp:ListItem Text="New" Value="New" />
                    <asp:ListItem Text="Assigned" Value="Assigned" />
                    <asp:ListItem Text="Work In Progres" Value="Work In Progres" />
                    <asp:ListItem Text="Completed" Value="Completed" />
                    <asp:ListItem Text="Confirmed By The Customer" Value="Confirmed By The Customer" />
                    <asp:ListItem Text="Rejected" Value="Rejected" />
               </SharePoint:DVDropDownList> 
          </div>

          <div class="form-group">
              <label>Closure Reason</label>
               <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="ClosureReasons" required="required" onchange="javascript:StatusChanged()">
                    <asp:ListItem Text="..." Value="" />
               </SharePoint:DVDropDownList> 
          </div>

           <div class="form-group">
              <label>Root Cause</label>
               <SharePoint:DVDropDownList runat="server" SelectedValue="" required="required" CssClass="form-control" DataSourceID="DSRootCause" DataValueField="RootCause" DataTextField="RootCause" ClientIDMode="Static" ID="RootCause">
                    <asp:ListItem Text="..." Value="" />
               </SharePoint:DVDropDownList> 
          </div>        
            
         <div class="form-group" id="assignedToContainer">
            <label>Assigned To</label>
            <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="AssignedTo" DataSourceID="DSUsers" DataTextField="UserName1" DataValueField="UserLogin" required="required">
                <asp:ListItem Text="..." Value="" />
            </SharePoint:DVDropDownList>
         </div>

      <div class="form-group">
        <label>Business Function <span class="ms-accentText">*</span></label>
         <SharePoint:DVListBox runat="server" SelectionMode="Multiple"   SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="BusinessFunction" DataSourceID="DSFunctions" DataValueField="BusinessFunction" DataTextField="BusinessFunction" required="required" onchange="javascript:CalculateTotalScore()">
         </SharePoint:DVListBox> 
     </div>

     <div class="form-group">
         <label>Responsible Department</label>
         <SharePoint:DVListBox runat="server" SelectionMode="Single" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="ResponsibleDepartment" DataSourceID="DSResponsibleDept" DataValueField="ResponsibleDepartment" DataTextField="ResponsibleDepartment">

         </SharePoint:DVListBox>
     </div>

    <div class="form-group">
       <label>Products <span class="ms-accentText">*</span></label>
         <SharePoint:DVListBox runat="server" SelectionMode="Multiple"   SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="Products" required="required" onchange="javascript:CalculateTotalScore2()">
        </SharePoint:DVListBox> 
    </div>


     <div class="form-group" data-enhaced="enhaced" id="impactedSystemRow"">
        <label>Impacted System</label>
          <SharePoint:DVListBox runat="server" SelectionMode="Multiple"   SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="ImpactedSystem" DataSourceID="DSSystems" DataTextField="ImpactedSystem" DataValueField="ImpactedSystem" required="required" onchange="javascript:CalculateTotalScore()">
             <asp:ListItem Text="..." Value="" />
         </SharePoint:DVListBox> 
     </div>

     <div class="form-group" id="impactedISORow" style="display:none">
         <label>Impacted ISO</label>
         <SharePoint:DVListBox runat="server" SelectionMode="Multiple" ClientIDMode="Static" ID="ImpactedISO" DataSourceID="DSIso" DataTextField="Title" DataValueField="Title" required="required">
         </SharePoint:DVListBox>
     </div>

     <div class="form-group" data-enhaced="enhaced" id="impactedComponentsRow">
         <label>Impacted Areas</label>
         <SharePoint:DVListBox runat="server" SelectionMode="Multiple"   SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="ImpactedComponent" DataSourceID="DSComponents" DataTextField="Title" DataValueField="Title" required="required">
             <asp:ListItem Text="..." Value="" />
         </SharePoint:DVListBox> 
     </div>

      <div class="form-group" style="display:none">
         <label>Code Review</label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="CodeReview" required="required">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="Yes" Value="Yes" />
            <asp:ListItem Text="No" Value="No" />
        </SharePoint:DVDropDownList>
     </div>

     <div class="form-group" style="display:none">
         <label>DB Review</label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="DBReview" required="required">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="Yes" Value="Yes" />
            <asp:ListItem Text="No" Value="No" />
        </SharePoint:DVDropDownList>
     </div>

     <div class="form-group" style="display:none">
         <label>Architecture Review</label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="ArchitectureReview" required="required">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="Yes" Value="Yes" />
            <asp:ListItem Text="No" Value="No" />
        </SharePoint:DVDropDownList>
     </div>

      <div class="form-group" style="display:none">
         <label>User Testing</label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="UserTesting" required="required">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="Yes" Value="Yes" />
            <asp:ListItem Text="No" Value="No" />
        </SharePoint:DVDropDownList>
     </div>

      <div class="form-group" style="display:none">
         <label>Business Impact</label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="ImpactScore" required="required" onchange="javascript:CalculateTotalScore()">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="High" Value="High" />
            <asp:ListItem Text="Medium" Value="Medium" />
            <asp:ListItem Text="Low" Value="Low" />
        </SharePoint:DVDropDownList>
     </div>

      <div class="form-group" style="display:none">
         <label>Desired Timeline</label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="UrgencyScore" required="required" onchange="javascript:CalculateTotalScore()">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="< 1 Month" Value="< 1 Month" />
            <asp:ListItem Text="1 < 2 Months" Value="1 < 2 Months" />
            <asp:ListItem Text="2 < 4 Months" Value="2 < 4 Months" />
            <asp:ListItem Text="4+ Months" Value="4+ Months" />
        </SharePoint:DVDropDownList>
     </div>



      <div class="form-group" style="display:none">
         <label>Business Value</label>
        <SharePoint:DVDropDownList runat="server" SelectedValue="" CssClass="form-control" ClientIDMode="Static" ID="RoiScore" required="required" onchange="javascript:CalculateTotalScore()">
            <asp:ListItem Text="..." Value="" />
            <asp:ListItem Text="Profitability" Value="Profitability" />
            <asp:ListItem Text="Efficiency" Value="Efficiency" />
            <asp:ListItem Text="User Experience" Value="User Experience" />
            <asp:ListItem Text="Undetermined" Value="Undetermined" />
        </SharePoint:DVDropDownList>
     </div>

      <div class="form-group" style="display:none">
          <label>Total Score</label>
          <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="TotalScore" ClientIDMode="Static" TextMode="SingleLine" />
      </div>


     <div class="form-group">
          <label>Requestor</label>
          <SharePoint:ClientPeoplePicker AutoFillEnabled="true"  runat="server"  ID="Submitter" AllowMultipleEntities="false" ClientIDMode="Static" />
     </div>

       <div class="form-group">
            <label>Created By</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="CreatedBy" ClientIDMode="Static" TextMode="SingleLine" />
         </div>

        <div class="form-group">
            <label>Submited Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="SubmittedDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div>

        <div class="form-group" >
            <label>Expected Complete Date</label>
            <SharePoint:InputFormTextBox runat="server" CssClass="form-control" ID="CompleteByDate" ClientIDMode="Static" TextMode="SingleLine" />
        </div>

          
        <div class="form-group" style="display:none">
            <label>In Process Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="InProcessDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div>

         <div class="form-group" style="display:none">
            <label>Acknowledged Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="AcknowledgedDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div>         

         <div class="form-group" style="display:none">
            <label>Prioritization Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="PrioritizationDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div>  

         <div class="form-group" style="display:none">
            <label>Planned Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="PlannedDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div> 


         <div class="form-group" style="display:none">
            <label>Design Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="DesignDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div>


         <div class="form-group" style="display:none">
            <label>Development Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="DevelopmentDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div>

         <div class="form-group" style="display:none">
            <label>Test Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="TestDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div>

       <div class="form-group" style="display:none">
            <label>Completed Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="CompletedDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div>

        <div class="form-group" style="display:none">
            <label>Closed Date</label>
            <SharePoint:InputFormTextBox  required="required" ReadOnly="true" runat="server" CssClass="form-control" ID="ClosedDate" ClientIDMode="Static" TextMode="SingleLine" />
         </div>
          
     
         <div class="form-group">
            <label>Description <span class="ms-accentText">*</span></label>
            <SharePoint:InputFormTextBox RichText="False" RichTextMode="Compatible" required="required" runat="server" CssClass="form-control" ID="TicketDescription" ClientIDMode="Static" TextMode="MultiLine" />
         </div>

         <div class="form-group">
            <label>Comments</label>
            <SharePoint:InputFormTextBox RichText="False" RichTextMode="Compatible"  runat="server" CssClass="form-control" ID="TicketComments" ClientIDMode="Static" TextMode="MultiLine" />
         </div>


         <div class="form-group" style="display:none">
            <label>Team ID <span class="ms-accentText">*</span></label>
            <SharePoint:InputFormTextBox runat="server" CssClass="form-control" ID="TeamID" ReadOnly="true" ClientIDMode="Static" MaxLength="200" />
         </div>

         <div class="form-group">
            <button type="button" class="btn btn-sm btn-primary" onclick="javascript:EditRequest()">Save</button>
        </div>
          <!-- End of edit ticket -->
      </div>
      <div class="tab-pane" id="attachments" role="tabpanel" aria-labelledby="attachments-tab">
          <br />
          <table id="tblAttachments" class="attachments-table" style="width:100%">
              <thead>
                  <tr>
                      <th style="width:100px">Del.</th>
                      <th>File Name</th>
                  </tr>
              </thead>
              <tbody>

              </tbody>
          </table>
          <br />

          <div class="form-group">
              <input type="file" id="newFileToAdd" class="form-control"  />
         </div>
          <div class="form-group">
                <button class="btn btn-primary btn-md" onclick="javascript:AttachNewFile()">Add file</button>
          </div>
           

      </div>
      <div class="tab-pane" id="history" role="tabpanel" aria-labelledby="history-tab">
          <br />
          <div class="panel panel-default">
              <div class="panel-body">
                  <ul id="commentsPlace" class="timeline">


                  </ul>
              </div>
          </div>
      </div>
    </div>
    <!-- End of tab content -->

                </div>
             </div>
        </div>
    </div>
    
<SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSResponsibleDept" UseInternalName="true" UseServerDataFormat="true"
        SelectCommand='<![CDATA[<View><Query><OrderBy><FieldRef Name="ResponsibleDepartment" /></OrderBy></Query></View>]]>'>
        <SelectParameters>
            <asp:Parameter Name="ListName" DefaultValue="ResponsibleDept" />
        </SelectParameters>
</SharePoint:SPDataSource> 

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

<SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSUsers" UseInternalName="true" UseServerDataFormat="true" 
        SelectCommand='<![CDATA[<View><Query><OrderBy><FieldRef Name="UserEmail" /></OrderBy></Query></View>]]>'>
    <SelectParameters>
        <asp:Parameter Name="ListName" DefaultValue="Users" />
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


 <SharePoint:SPDataSource runat="server" DataSourceMode="List" IncludeHidden="true" ID="DSRootCause" UseInternalName="true" UseServerDataFormat="true" 
        SelectCommand='<![CDATA[<View></View>]]>'>
    <SelectParameters>
        <asp:Parameter Name="ListName" DefaultValue="RootCause" />
    </SelectParameters>
</SharePoint:SPDataSource>


</asp:Content>
