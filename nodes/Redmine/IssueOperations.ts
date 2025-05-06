import { INodeProperties } from 'n8n-workflow';
import { issueGetAllOperations } from './Issue.getAll.Operations';

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
  ...issueGetAllOperations,

  // Fields for CREATE/UPDATE operation
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
    displayName: 'Subject',
    name: 'subject',
    type: 'string',
    required: false,
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'The new subject of the issue. If blank, the subject will not be changed.',
  },
  {
    displayName: 'Notes',
    name: 'notes',
    type: 'string',
    required: false,
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'Comments about the update',
  },
  {
    displayName: 'Private notes',
    name: 'private_notes',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['update'],
      },
    },
    default: false,
    description: 'Whether to create private notes',
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
        displayName: 'Category ID',
        name: 'category_id',
        type: 'string',
        default: '',
        description: 'The category ID of the issue',
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
        typeOptions: {
          rows: 4,
        },
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
        displayName: 'Fixed Version ID',
        name: 'fixed_version_id',
        type: 'string',
        default: '',
        description: 'The fixed version ID of the issue. Also known as Target Version ID.',
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
