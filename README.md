# n8n-nodes-redmine

This is a custom n8n node that integrates with Redmine, the flexible project management web application. This node allows you to interact with Redmine's API to manage Issues, Projects, and Users.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

To use this node, you need to set up credentials with your Redmine instance:

1. Go to "Credentials" in the n8n UI
2. Click on "Create New"
3. Search for "Redmine API"
4. Enter your Redmine URL (e.g., https://redmine.example.com)
5. Enter your API key (You can get this from your Redmine account settings)

## Operations

### Issues

Manage issues in your Redmine projects.

#### Operations:

- **Get**: Retrieve a single issue by ID
  - Required parameters:
    - Issue ID
  - Additional fields:
    - Includes
  
- **Get Many**: Retrieve multiple issues with filtering options
  - Parameters:
    - Return All (boolean): Whether to return all results or limit
    - Limit (number): Maximum number of results to return when not returning all
    - Offset (number): Number of issues to skip in response
    - Sort (string): Column to sort by. Append :desc to invert the order (e.g., created_on:desc).
    - Include (list): Associated data to include in the response. Options: Attachments, Children, Journals, Relations, Watchers.
  - Filters:
    - Assigned To ID: Filter by the assigned user
    - Author ID: Filter by author
    - Category ID: Filter by category
    - Created On: Filter by creation date. Operations exact, before, after and range
    - Custom Fields: Filter by custom fields
    - Fixed Version ID: Filter by fixed version
    - Issue ID:Filter by issue
    - Parent ID: Filter by parent
    - Priority ID: Filter by priority
    - Project ID: Filter by project
    - Status ID: Filter by status
    - Subject: Filter by subject
    - Subproject ID: Filter by subproject
    - Target Version ID: Filter by target version
    - Tracker ID: Filter by tracker
    - Updated On: Filter by updated date. Operations exact, before, after and range

- **Create**: Create a new issue
  - Required parameters:
    - Project ID: The project where the issue will be created
    - Subject: The subject/title of the issue
  - Additional fields:
    - Assigned To ID
    - Category ID
    - Description
    - Due Date
    - Estimated Hours
    - Fixed Version ID
    - Parent Issue ID
    - Priority ID
    - Start Date
    - Status ID
    - Tracker ID
    - Custom Fields: Add any custom fields defined in your Redmine instance

- **Update**: Update an existing issue
  - Required parameters:
    - Issue ID
  - Additional fields: Same as Create operation

- **Delete**: Delete an issue
  - Required parameters:
    - Issue ID

### Projects

Manage projects in your Redmine instance.

#### Operations:

- **Get**: Retrieve a single project by ID
  - Required parameters:
    - Project ID
  
- **Get Many**: Retrieve multiple projects with filtering options
  - Parameters:
    - Return All (boolean): Whether to return all results or limit
    - Limit (number): Maximum number of results to return when not returning all
  - Filters:
    - Include Archived: Filter projects by status (All, Open Only, Closed Only)

- **Create**: Create a new project
  - Required parameters:
    - Name: The name of the project
    - Identifier: The identifier used in URLs
  - Additional fields:
    - Description
    - Homepage
    - Is Public (boolean)
    - Parent ID: For subprojects
    - Inherit Members (boolean)
    - Enabled Modules: Select which modules to enable (Issue Tracking, Time Tracking, News, Documents, Files, Wiki, Repository, Forums, Calendar, Gantt)
    - Custom Fields: Add any custom fields defined in your Redmine instance

- **Update**: Update an existing project
  - Required parameters:
    - Project ID
  - Additional fields: Same as Create operation

- **Delete**: Delete a project
  - Required parameters:
    - Project ID

### Users

Manage users in your Redmine instance.

#### Operations:

- **Get**: Retrieve a single user by ID
  - Required parameters:
    - User ID
  
- **Get Current**: Retrieve the current authenticated user
  - No parameters required

- **Get Many**: Retrieve multiple users with filtering options
  - Parameters:
    - Return All (boolean): Whether to return all results or limit
    - Limit (number): Maximum number of results to return when not returning all
  - Filters:
    - Group ID: Filter users by group
    - Name: Filter users by name
    - Status: Filter by status (Active, Registered, Locked)

- **Create**: Create a new user
  - Required parameters:
    - Login: Username
    - First Name
    - Last Name
    - Email
    - Password
  - Additional fields:
    - Admin (boolean): Whether the user is an administrator
    - Authentication Source ID
    - Email Notifications: Options for email notification preferences
    - Must Change Password (boolean)
    - Status: User status (Active, Registered, Locked)
    - Custom Fields: Add any custom fields defined in your Redmine instance

- **Update**: Update an existing user
  - Required parameters:
    - User ID
  - Additional fields: Same as Create operation

- **Delete**: Delete a user
  - Required parameters:
    - User ID

## Contributing

Feel free to submit issues, feature requests, and contributions via GitHub.

## Related Resources

- [Redmine API Documentation](https://www.redmine.org/projects/redmine/wiki/Rest_api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## Keywords

[n8n-community-node-package](https://www.npmjs.com/search?q=keywords:n8n-community-node-package) [redmine](https://www.npmjs.com/search?q=keywords:redmine) [n8n](https://www.npmjs.com/search?q=keywords:n8n)