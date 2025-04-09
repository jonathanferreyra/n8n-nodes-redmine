import { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['project'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a project',
        action: 'Create a project',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a project',
        action: 'Delete a project',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a project',
        action: 'Get a project',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many projects',
        action: 'Get many projects',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a project',
        action: 'Update a project',
      },
    ],
    default: 'get',
    noDataExpression: true,
    required: true,
  },
];

export const projectFields: INodeProperties[] = [
  // Fields for GET operation
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['get', 'delete', 'update'],
      },
    },
    default: '',
    description: 'The ID of the project to get',
  },
  // Fields for GET ALL operation
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Include Archived',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'All',
            value: '*',
          },
          {
            name: 'Closed Only',
            value: 'closed',
          },
          {
            name: 'Open Only',
            value: 'open',
          },
        ],
        default: '*',
        description: 'Filter projects by status',
      },
    ],
  },
  // Fields for CREATE operation
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The name of the project',
  },
  {
    displayName: 'Identifier',
    name: 'identifier',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The identifier of the project (used in URLs)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create', 'update'],
      },
    },
    options: [
      {
        displayName: 'Custom Fields',
        name: 'customFields',
        placeholder: 'Add Custom Field',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'field',
            displayName: 'Field',
            values: [
              {
                displayName: 'Field ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'ID of the custom field',
              },
              {
                displayName: 'Field Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Value of the custom field',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'The description of the project',
      },
      {
        displayName: 'Enabled Modules',
        name: 'enabledModules',
        placeholder: 'Add Module',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'module',
            displayName: 'Module',
            values: [
              {
                displayName: 'Name',
                name: 'name',
                type: 'options',
                options: [
                  { name: 'Calendar', value: 'calendar' },
                  { name: 'Documents', value: 'documents' },
                  { name: 'Files', value: 'files' },
                  { name: 'Forums', value: 'boards' },
                  { name: 'Gantt', value: 'gantt' },
                  { name: 'Issue Tracking', value: 'issue_tracking' },
                  { name: 'News', value: 'news' },
                  { name: 'Repository', value: 'repository' },
                  { name: 'Time Tracking', value: 'time_tracking' },
                  { name: 'Wiki', value: 'wiki' },
                ],
                default: 'issue_tracking',
                description: 'Name of the module',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Homepage',
        name: 'homepage',
        type: 'string',
        default: '',
        description: 'The homepage of the project',
      },
      {
        displayName: 'Inherit Members',
        name: 'inherit_members',
        type: 'boolean',
        default: false,
        description: 'Whether to inherit members from parent project',
      },
      {
        displayName: 'Is Public',
        name: 'is_public',
        type: 'boolean',
        default: true,
        description: 'Whether the project is public',
      },
      {
        displayName: 'Parent ID',
        name: 'parent_id',
        type: 'string',
        default: '',
        description: 'The ID of the parent project',
      }
    ],
  },
];
