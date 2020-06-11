
## How to Modify and Create a New Version of Ticketing Site for Testing.

  


1. Install Visual Studio (if needed). [How to Install Visual Studio ](https://docs.microsoft.com/en-us/visualstudio/install/install-visual-studio?view=vs-2019)

  


2. Clone this repo.

  

3. Open the .sln file of this repo as a "Project/Solution" in Visual Studio.



***

  

4. In Visual Studio, select "View", "Team Explorer".



- At the top of "Team Explorer" is a dropdown, set it to "Branches".

  

- Still in "Team Explorer", under "Active Git Repositories", find the

  

clone created in step 2.

  

- Right click on "Master" then select "New Local Branch From"

  


- Follow the prompts given to create and checkout new local branch inside of "Team Explorer".

  

  
***

  


  

5. Click on "View", then open the "Properties Window".

  
  

- Click on "View", then open the "Solution Explorer".

  

***

  
  

6. Make your changes to the codebase.

  
  

- In "Solution Explorer", find '/sescollc/AppManifest.xml', update the version number.



***

  

7. Select root sescollc folder in the "Solution Explorer".

  


- In the "Properties Window", find "SharePoint", then "Site URL".

  


- Paste https://sescoent.sharepoint.com/sites/app_testing/ to the right of "Site URL"

  
  

***

  


8. In "Solution Explorer" right click on the root "sescollc" folder, then click "Publish".

  



- Click "Package the add-in" button.

  

- This will give you the ".app" file to be used for the new version of the testing site.

  

***


  

9. Send .app file to Jasen to deploy to new testing site. When it is deployed,

  

- Go to https://sescoent.sharepoint.com/sites/app_testing/sesco to test new changes.

  

- If changes were successful and function correctly, follow step 10 to create merge request.

  

***

  

10. Right click your branch in "Team Explorer" and select "Push Branch"

  


- Again Right click your branch in "Team Explorer" and select "Merge From"

  

- Follow prompts given to create merge request.