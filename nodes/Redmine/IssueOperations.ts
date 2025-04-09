import { INodeProperties } from 'n8n-workflow';

export const issueOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['issue'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create an issue',
        action: 'Create an issue',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an issue',
        action: 'Delete an issue',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an issue',
        action: 'Get an issue',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many issues',
        action: 'Get many issues',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an issue',
        action: 'Update an issue',
      },
    ],
    default: 'get',
    noDataExpression: true,
    required: true,
  },
];

export const issueFields: INodeProperties[] = [
  // Fields for GET operation
  {
    displayName: 'Issue ID',
    name: 'issueId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['get', 'delete', 'update'],
      },
    },
    default: '',
    description: 'The ID of the issue to get',
  },
  // Fields for GET ALL operation
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['issue'],
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
        resource: ['issue'],
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
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 0,
    },
    default: 0,
    description: 'Number of issues to skip in response',
  },
  {
    displayName: 'Sort',
    name: 'sort',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['getAll'],
      },
    },
    default: '',
    placeholder: 'created_on:desc',
    description: 'Column to sort by. Append :desc to invert the order (e.g., created_on:desc).',
  },
  {
    displayName: 'Include',
    name: 'include',
    type: 'multiOptions',
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        name: 'Attachments',
        value: 'attachments',
        description: 'Include attachments (Since Redmine 3.4.0)',
      },
      {
        name: 'Children',
        value: 'children',
        description: 'Include child issues',
      },
      {
        name: 'Journals',
        value: 'journals',
        description: 'Include issue history',
      },
      {
        name: 'Relations',
        value: 'relations',
        description: 'Include related issues',
      },
      {
        name: 'Watchers',
        value: 'watchers',
        description: 'Include watchers',
      }
    ],
    default: [],
    description: 'Associated data to include in the response',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Assigned To ID',
        name: 'assigned_to_id',
        type: 'string',
        default: '',
        description: 'Get issues assigned to the given user ID. Use "me" to get issues assigned to yourself.',
      },
      {
        displayName: 'Author ID',
        name: 'author_id',
        type: 'string',
        default: '',
        description: 'Get issues created by the given user ID',
      },
      {
        displayName: 'Category ID',
        name: 'category_id',
        type: 'string',
        default: '',
        description: 'Get issues with the given category ID',
      },
      {
        displayName: 'Created On',
        name: 'filterByCreationDate',
        type: 'boolean',
        default: true,
        description: 'Whether to filter issues by creation date',
      },
      {
        displayName: 'Created On Filter Type',
        name: 'creationDateFilterType',
        type: 'options',
        displayOptions: {
          show: {
            filterByCreationDate: [true],
          },
        },
        options: [
          {
            name: 'Exact Date',
            value: 'exact',
          },
          {
            name: 'Date Range',
            value: 'range',
          },
          {
            name: 'After Date',
            value: 'after',
          },
          {
            name: 'Before Date',
            value: 'before',
          },
        ],
        default: 'after',
        description: 'Filter type for creation date',
      },
      {
        displayName: 'Created On Value',
        name: 'creationDate',
        type: 'dateTime',
        displayOptions: {
          show: {
            filterByCreationDate: [true],
            creationDateFilterType: ['exact', 'after', 'before'],
          },
        },
        default: '',
        description: 'The date to filter by',
      },
      {
        displayName: 'Created On (Range) Start',
        name: 'creationDateStart',
        type: 'dateTime',
        displayOptions: {
          show: {
              filterByCreationDate: [true],
              creationDateFilterType: ['range'],
          },
        },
        default: '',
        description: 'Start date of the range',
      },
      {
        displayName: 'Created On (Range) End',
        name: 'creationDateEnd',
        type: 'dateTime',
        displayOptions: {
          show: {
            filterByCreationDate: [true],
            creationDateFilterType: ['range'],
          },
        },
        default: '',
        description: 'End date of the range',
      },     
      {
        displayName: 'Custom Fields',
        name: 'customFields',
        placeholder: 'Add Custom Field Filter',
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
                description: 'ID of the custom field (without cf_ prefix)',
                placeholder: '10',
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
        description: 'Filter by custom fields. The custom field must have "Used as a filter" option enabled.',
      },
      {
        displayName: 'Custom Status ID',
        name: 'custom_status_id',
        type: 'string',
        displayOptions: {
          show: {
            status_id: ['custom'],
          },
        },
        default: '',
        description: 'Enter a specific status ID',
      },
      {
        displayName: 'Fixed Version ID',
        name: 'fixed_version_id',
        type: 'string',
        default: '',
        description: 'Get issues with the given fixed version ID',
      },
      {
        displayName: 'Issue ID',
        name: 'issue_id',
        type: 'string',
        default: '',
        description: 'Get issue with the given ID or multiple issues by ID using comma to separate',
      },
      {
        displayName: 'Parent ID',
        name: 'parent_id',
        type: 'string',
        default: '',
        description: 'Get issues whose parent issue has the given ID',
      },
      {
        displayName: 'Priority ID',
        name: 'priority_id',
        type: 'string',
        default: '',
        description: 'Get issues with the given priority ID',
      },
      {
        displayName: 'Project ID',
        name: 'project_id',
        type: 'string',
        default: '',
        description: 'The ID of the project to get issues from',
      },
      {
        displayName: 'Status ID',
        name: 'status_id',
        type: 'options',
        options: [
          {
            name: 'Open',
            value: 'open',
            description: 'Open issues only',
          },
          {
            name: 'Closed',
            value: 'closed',
            description: 'Closed issues only',
          },
          {
            name: 'All',
            value: '*',
            description: 'Both open and closed issues',
          },
          {
            name: 'Custom',
            value: 'custom',
            description: 'Enter a specific status ID',
          },
        ],
        default: 'open',
        description: 'Filter issues by status',
      },
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        description: 'Get issues with the given subject (exact match)',
      },
      {
        displayName: 'Subproject ID',
        name: 'subproject_id',
        type: 'string',
        default: '',
        description: 'Get issues from the subproject with the given ID. Use project_id=XXX&subproject_id=!* to get only issues of a given project with none of its subprojects.',
      },
      {
        displayName: 'Target Version ID',
        name: 'target_version_id',
        type: 'string',
        default: '',
        description: 'Get issues with the given target version ID',
      },
      {
        displayName: 'Tracker ID',
        name: 'tracker_id',
        type: 'string',
        default: '',
        description: 'The tracker ID to filter issues by',
      },
      {
        displayName: 'Updated On',
        name: 'filterByUpdatedDate',
        type: 'boolean',
        default: true,
        description: 'Whether to filter issues by updated date',
      },
      {
        displayName: 'Updated On Filter Type',
        name: 'updatedDateFilterType',
        type: 'options',
        displayOptions: {
          show: {
            filterByUpdatedDate: [true],
          },
        },
        options: [
          {
            name: 'Exact Date',
            value: 'exact',
          },
          {
            name: 'Date Range',
            value: 'range',
          },
          {
            name: 'After Date',
            value: 'after',
          },
          {
            name: 'Before Date',
            value: 'before',
          },
        ],
        default: 'after',
        description: 'Filter type for updated date',
      },
      {
        displayName: 'Updated On Value',
        name: 'updatedDate',
        type: 'dateTime',
        displayOptions: {
          show: {
            filterByUpdatedDate: [true],
            updatedDateFilterType: ['exact', 'after', 'before'],
          },
        },
        default: '',
        description: 'The date to filter by',
      },
      {
        displayName: 'Updated On (Range) Start',
        name: 'updatedDateStart',
        type: 'dateTime',
        displayOptions: {
          show: {
              filterByUpdatedDate: [true],
              updatedDateFilterType: ['range'],
          },
        },
        default: '',
        description: 'Start date of the range',
      },
      {
        displayName: 'Updated On (Range) End',
        name: 'updatedDateEnd',
        type: 'dateTime',
        displayOptions: {
          show: {
            filterByUpdatedDate: [true],
            updatedDateFilterType: ['range'],
          },
        },
        default: '',
        description: 'End date of the range',
      },
    ],
  },
  // Fields for CREATE operation
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The ID of the project the issue belongs to',
  },
  {
    displayName: 'Subject',
    name: 'subject',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The subject of the issue',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['create', 'update'],
      },
    },
    options: [
      {
        displayName: 'Assigned To ID',
        name: 'assigned_to_id',
        type: 'string',
        default: '',
        description: 'The ID of the user to assign the issue to',
      },
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
        description: 'The description of the issue',
      },
      {
        displayName: 'Due Date',
        name: 'due_date',
        type: 'dateTime',
        default: '',
        description: 'The due date of the issue',
      },
      {
        displayName: 'Estimated Hours',
        name: 'estimated_hours',
        type: 'number',
        default: 0,
        description: 'The estimated hours for the issue',
      },
      {
        displayName: 'Parent Issue ID',
        name: 'parent_issue_id',
        type: 'string',
        default: '',
        description: 'The ID of the parent issue',
      },
      {
        displayName: 'Priority ID',
        name: 'priority_id',
        type: 'string',
        default: '',
        description: 'The priority ID of the issue',
      },
      {
        displayName: 'Start Date',
        name: 'start_date',
        type: 'dateTime',
        default: '',
        description: 'The start date of the issue',
      },
      {
        displayName: 'Status ID',
        name: 'status_id',
        type: 'string',
        default: '',
        description: 'The status ID of the issue',
      },
      {
        displayName: 'Tracker ID',
        name: 'tracker_id',
        type: 'string',
        default: '',
        description: 'The tracker ID of the issue',
      },
    ],
  },
];
