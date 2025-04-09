import { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a user',
        action: 'Create a user',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a user',
        action: 'Delete a user',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a user',
        action: 'Get a user',
      },
      {
        name: 'Get Current',
        value: 'getCurrent',
        description: 'Get current user',
        action: 'Get current user',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many users',
        action: 'Get many users',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a user',
        action: 'Update a user',
      },
    ],
    default: 'get',
    noDataExpression: true,
    required: true,
  },
];

export const userFields: INodeProperties[] = [
  // Fields for GET operation
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get', 'delete', 'update'],
      },
    },
    default: '',
    description: 'The ID of the user',
  },
  // Fields for GET ALL operation
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['user'],
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
        resource: ['user'],
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
        resource: ['user'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Group ID',
        name: 'group_id',
        type: 'string',
        default: '',
        description: 'Filter users by group',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter users by name',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'Active',
            value: '1',
          },
          {
            name: 'Registered',
            value: '2',
          },
          {
            name: 'Locked',
            value: '3',
          },
        ],
        default: '1',
        description: 'Filter users by status',
      },
    ],
  },
  // Fields for CREATE operation
  {
    displayName: 'Login',
    name: 'login',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The username of the user',
  },
  {
    displayName: 'First Name',
    name: 'firstname',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The first name of the user',
  },
  {
    displayName: 'Last Name',
    name: 'lastname',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The last name of the user',
  },
  {
    displayName: 'Email',
    name: 'mail',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The email of the user',
  },
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    typeOptions: {
      password: true,
    },
    default: '',
    description: 'The password of the user',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create', 'update'],
      },
    },
    options: [
      {
        displayName: 'Admin',
        name: 'admin',
        type: 'boolean',
        default: false,
        description: 'Whether the user is an administrator',
      },
      {
        displayName: 'Authentication Source ID',
        name: 'auth_source_id',
        type: 'string',
        default: '',
        description: 'The ID of the authentication source',
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
        displayName: 'Email Notifications',
        name: 'mail_notification',
        type: 'options',
        options: [
          {
            name: 'All',
            value: 'all',
          },
          {
            name: 'None',
            value: 'none',
          },
          {
            name: 'Only Assigned',
            value: 'only_assigned',
          },
          {
            name: 'Only For My Events',
            value: 'only_my_events',
          },
          {
            name: 'Only Owner',
            value: 'only_owner',
          }
        ],
        default: 'all',
        description: 'Email notification options',
      },
      {
        displayName: 'Must Change Password',
        name: 'must_change_passwd',
        type: 'boolean',
        default: false,
        description: 'Whether the user must change their password on next login',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'Active',
            value: '1',
          },
          {
            name: 'Registered',
            value: '2',
          },
          {
            name: 'Locked',
            value: '3',
          },
        ],
        default: '1',
        description: 'Status of the user',
      },
    ],
  },
];
