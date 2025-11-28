import {
  IExecuteFunctions,
  IHttpRequestMethods,
  INodeExecutionData,
  IRequestOptions,
  NodeOperationError,
} from 'n8n-workflow';

interface ProjectOperationParams {
  operation: string;
  i: number;
  baseUrl: string;
  apiKey: string;
}

export async function executeProjectOperation(
  this: IExecuteFunctions,
  params: ProjectOperationParams
): Promise<INodeExecutionData> {
  const { operation, i, baseUrl, apiKey } = params;

  let endpoint: string = '';
  let method: IHttpRequestMethods = 'GET';
  let body: any = {};
  let qs: any = {};

  if (operation === 'get') {
    // ----------------------------------
    //         project:get
    // ----------------------------------
    const projectId = this.getNodeParameter('projectId', i) as string;
    method = 'GET';
    endpoint = `/projects/${projectId}.json`;
    qs.include = 'trackers,issue_categories,enabled_modules';
  } else if (operation === 'getAll') {
    // ----------------------------------
    //         project:getAll
    // ----------------------------------
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;
    const filters = this.getNodeParameter('filters', i) as {
      status?: string;
    };

    method = 'GET';
    endpoint = '/projects.json';

    // Add filters to query string
    if (filters.status) qs.status = filters.status;

    if (!returnAll) {
      const limit = this.getNodeParameter('limit', i) as number;
      qs.limit = limit;
    }
  } else if (operation === 'create') {
    // ----------------------------------
    //         project:create
    // ----------------------------------
    const name = this.getNodeParameter('name', i) as string;
    const identifier = this.getNodeParameter('identifier', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i) as {
      description?: string;
      homepage?: string;
      is_public?: boolean;
      parent_id?: string;
      inherit_members?: boolean;
      customFields?: {
        field: {
          id: string;
          value: string;
        }[];
      };
      enabledModules?: {
        module: {
          name: string;
        }[];
      };
    };

    method = 'POST';
    endpoint = '/projects.json';

    const projectData: any = {
      name,
      identifier,
    };

    // Add all additional fields to the request
    if (additionalFields.description) projectData.description = additionalFields.description;
    if (additionalFields.homepage) projectData.homepage = additionalFields.homepage;
    if (additionalFields.is_public !== undefined) projectData.is_public = additionalFields.is_public;
    if (additionalFields.parent_id) projectData.parent_id = additionalFields.parent_id;
    if (additionalFields.inherit_members !== undefined) projectData.inherit_members = additionalFields.inherit_members;

    // Add custom fields if any
    if (additionalFields.customFields && additionalFields.customFields.field) {
      const customFields: any[] = [];

      for (const customField of additionalFields.customFields.field) {
        customFields.push({
          id: customField.id,
          value: customField.value,
        });
      }

      if (customFields.length > 0) {
        projectData.custom_fields = customFields;
      }
    }

    // Add enabled modules if any
    if (additionalFields.enabledModules && additionalFields.enabledModules.module) {
      const enabledModules: any[] = [];

      for (const module of additionalFields.enabledModules.module) {
        enabledModules.push({
          name: module.name,
        });
      }

      if (enabledModules.length > 0) {
        projectData.enabled_modules = enabledModules;
      }
    }

    body = {
      project: projectData,
    };
  } else if (operation === 'update') {
    // ----------------------------------
    //         project:update
    // ----------------------------------
    const projectId = this.getNodeParameter('projectId', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i) as {
      description?: string;
      homepage?: string;
      is_public?: boolean;
      parent_id?: string;
      inherit_members?: boolean;
      customFields?: {
        field: {
          id: string;
          value: string;
        }[];
      };
      enabledModules?: {
        module: {
          name: string;
        }[];
      };
    };

    method = 'PUT';
    endpoint = `/projects/${projectId}.json`;

    const projectData: any = {};

    // Add all additional fields to the request
    if (additionalFields.description !== undefined) projectData.description = additionalFields.description;
    if (additionalFields.homepage !== undefined) projectData.homepage = additionalFields.homepage;
    if (additionalFields.is_public !== undefined) projectData.is_public = additionalFields.is_public;
    if (additionalFields.parent_id !== undefined) projectData.parent_id = additionalFields.parent_id;
    if (additionalFields.inherit_members !== undefined) projectData.inherit_members = additionalFields.inherit_members;

    // Add custom fields if any
    if (additionalFields.customFields && additionalFields.customFields.field) {
      const customFields: any[] = [];

      for (const customField of additionalFields.customFields.field) {
        customFields.push({
          id: customField.id,
          value: customField.value,
        });
      }

      if (customFields.length > 0) {
        projectData.custom_fields = customFields;
      }
    }

    // Add enabled modules if any
    if (additionalFields.enabledModules && additionalFields.enabledModules.module) {
      const enabledModules: any[] = [];

      for (const module of additionalFields.enabledModules.module) {
        enabledModules.push({
          name: module.name,
        });
      }

      if (enabledModules.length > 0) {
        projectData.enabled_modules = enabledModules;
      }
    }

    body = {
      project: projectData,
    };
  } else if (operation === 'delete') {
    // ----------------------------------
    //         project:delete
    // ----------------------------------
    const projectId = this.getNodeParameter('projectId', i) as string;
    method = 'DELETE';
    endpoint = `/projects/${projectId}.json`;
  }

  const optionsData = this.getNodeParameter('options', i, {}) as { impersonateUser?: string };
  const impersonateUser = optionsData.impersonateUser;

  const headers: any = {
    'X-Redmine-API-Key': apiKey,
    'Content-Type': 'application/json',
  };

  if (impersonateUser) {
    headers['X-Redmine-Switch-User'] = impersonateUser;
  }

  // Make the request to Redmine API
  const options: IRequestOptions = {
    method,
    body,
    qs,
    uri: `${baseUrl}/` + endpoint.replace(/^\//, ''),
    headers,
    json: true,
  };

  if (Object.keys(body).length === 0) {
    delete options.body;
  }

  let responseData;

  try {
    responseData = await this.helpers.request(options);
  } catch (error) {
    throw new NodeOperationError(this.getNode(), `Redmine API error: ${error.message}`, { itemIndex: i });
  }

  return {
    json: responseData,
    pairedItem: {
      item: i,
    },
  };
}