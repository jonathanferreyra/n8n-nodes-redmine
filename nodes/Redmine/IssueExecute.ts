import {
  IExecuteFunctions,
  IHttpRequestMethods,
  INodeExecutionData,
  IRequestOptions,
  NodeOperationError,
} from 'n8n-workflow';

interface IssueOperationParams {
  operation: string;
  i: number;
  baseUrl: string;
  apiKey: string;
}

export async function executeIssueOperation(
  this: IExecuteFunctions,
  params: IssueOperationParams
): Promise<INodeExecutionData> {
  const { operation, i, baseUrl, apiKey } = params;
  
  let endpoint: string = '';
  let method: IHttpRequestMethods = 'GET';
  let body: any = {};
  let qs: any = {};

  if (operation === 'get') {
    // ----------------------------------
    //         issue:get
    // ----------------------------------
    const issueId = this.getNodeParameter('issueId', i) as string;
    method = 'GET';
    endpoint = `/issues/${issueId}.json`;
  } else if (operation === 'getAll') {
    // ----------------------------------
    //         issue:getAll
    // ----------------------------------
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;
    
    method = 'GET';
    endpoint = '/issues.json';
    
    // Handle pagination parameters
    if (!returnAll) {
      const limit = this.getNodeParameter('limit', i) as number;
      const offset = this.getNodeParameter('offset', i, 0) as number;
      qs.limit = limit;
      qs.offset = offset;
    }
    
    // Handle sort parameter
    const sort = this.getNodeParameter('sort', i, '') as string;
    if (sort) {
      qs.sort = sort;
    }
    
    // Handle include parameter for associated data
    const include = this.getNodeParameter('include', i, []) as string[];
    if (include.length > 0) {
      qs.include = include.join(',');
    }
    
    // Get and process all filters
    const filters = this.getNodeParameter('filters', i, {}) as {
      issue_id?: string;
      project_id?: string;
      subproject_id?: string;
      tracker_id?: string;
      status_id?: string;
      custom_status_id?: string;
      assigned_to_id?: string;
      parent_id?: string;
      author_id?: string;
      filterByCreationDate?: boolean;
      creationDate?: string;
      creationDateFilterType?: string;
      creationDateStart?: string;
      creationDateEnd?: string;
      filterByUpdatedDate?: boolean;
      updatedDate?: string;
      updatedDateFilterType?: string;
      updatedDateStart?: string;
      updatedDateEnd?: string;
      priority_id?: string;
      category_id?: string;
      fixed_version_id?: string;
      target_version_id?: string;
      subject?: string;
      customFields?: {
        field: {
          id: string;
          value: string;
        }[];
      };
    };
    
    // Add standard filters to query string
    if (filters.issue_id) qs.issue_id = filters.issue_id;
    if (filters.project_id) qs.project_id = filters.project_id;
    if (filters.subproject_id) qs.subproject_id = filters.subproject_id;
    if (filters.tracker_id) qs.tracker_id = filters.tracker_id;
    
    // Handle status_id with special options
    if (filters.status_id) {
      if (filters.status_id === 'custom' && filters.custom_status_id) {
        qs.status_id = filters.custom_status_id;
      } else {
        qs.status_id = filters.status_id;
      }
    }
    
    if (filters.assigned_to_id) qs.assigned_to_id = filters.assigned_to_id;
    if (filters.parent_id) qs.parent_id = filters.parent_id;
    if (filters.author_id) qs.author_id = filters.author_id;
    if (filters.priority_id) qs.priority_id = filters.priority_id;
    if (filters.category_id) qs.category_id = filters.category_id;
    if (filters.fixed_version_id) qs.fixed_version_id = filters.fixed_version_id;
    if (filters.target_version_id) qs.target_version_id = filters.target_version_id;
    if (filters.subject) qs.subject = filters.subject;

    // Process created_on date filter
    if (filters.filterByCreationDate) {
      const filterType = filters.creationDateFilterType as string;
      
      switch (filterType) {
        case 'exact':
          if (filters.creationDate) {
            qs.created_on = filters.creationDate;
          }
          break;
        case 'range':
          if (filters.creationDateStart && filters.creationDateEnd) {
            qs.created_on = `><${filters.creationDateStart}|${filters.creationDateEnd}`;
          }
          break;
        case 'after':
          if (filters.creationDate) {
            qs.created_on = `>=${filters.creationDate}`;
          }
          break;
        case 'before':
          if (filters.creationDate) {
            qs.created_on = `<=${filters.creationDate}`;
          }
          break;
      }
    }

    // Process updated_on date filter
    if (filters.filterByUpdatedDate) {
      const filterType = filters.updatedDateFilterType as string;
      
      switch (filterType) {
        case 'exact':
          if (filters.updatedDate) {
            qs.updated_on = filters.updatedDate;
          }
          break;
        case 'range':
          if (filters.updatedDateStart && filters.updatedDateEnd) {
            qs.updated_on = `><${filters.updatedDateStart}|${filters.updatedDateEnd}`;
          }
          break;
        case 'after':
          if (filters.updatedDate) {
            qs.updated_on = `>=${filters.updatedDate}`;
          }
          break;
        case 'before':
          if (filters.updatedDate) {
            qs.updated_on = `<=${filters.updatedDate}`;
          }
          break;
      }
    }
    
    // Process custom fields
    if (filters.customFields && filters.customFields.field) {
      for (const customField of filters.customFields.field) {
        qs[`cf_${customField.id}`] = customField.value;
      }
    }
  } else if (operation === 'create') {
    // ----------------------------------
    //         issue:create
    // ----------------------------------
    const projectId = this.getNodeParameter('projectId', i) as string;
    const subject = this.getNodeParameter('subject', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i) as {
      description?: string;
      status_id?: string;
      tracker_id?: string;
      priority_id?: string;
      assigned_to_id?: string;
      parent_issue_id?: string;
      start_date?: string;
      due_date?: string;
      estimated_hours?: number;
      customFields?: {
        field: {
          id: string;
          value: string;
        }[];
      };
    };
    
    method = 'POST';
    endpoint = '/issues.json';
    
    const issueData: any = {
      project_id: projectId,
      subject,
    };
    
    // Add all additional fields to the request
    if (additionalFields.description) issueData.description = additionalFields.description;
    if (additionalFields.status_id) issueData.status_id = additionalFields.status_id;
    if (additionalFields.tracker_id) issueData.tracker_id = additionalFields.tracker_id;
    if (additionalFields.priority_id) issueData.priority_id = additionalFields.priority_id;
    if (additionalFields.assigned_to_id) issueData.assigned_to_id = additionalFields.assigned_to_id;
    if (additionalFields.parent_issue_id) issueData.parent_issue_id = additionalFields.parent_issue_id;
    if (additionalFields.start_date) issueData.start_date = additionalFields.start_date;
    if (additionalFields.due_date) issueData.due_date = additionalFields.due_date;
    if (additionalFields.estimated_hours) issueData.estimated_hours = additionalFields.estimated_hours;
    
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
        issueData.custom_fields = customFields;
      }
    }
    
    body = {
      issue: issueData,
    };
  } else if (operation === 'update') {
    // ----------------------------------
    //         issue:update
    // ----------------------------------
    const issueId = this.getNodeParameter('issueId', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i) as {
      description?: string;
      status_id?: string;
      tracker_id?: string;
      priority_id?: string;
      assigned_to_id?: string;
      parent_issue_id?: string;
      start_date?: string;
      due_date?: string;
      estimated_hours?: number;
      customFields?: {
        field: {
          id: string;
          value: string;
        }[];
      };
    };
    
    method = 'PUT';
    endpoint = `/issues/${issueId}.json`;
    
    const issueData: any = {};
    
    // Add all additional fields to the request
    if (additionalFields.description) issueData.description = additionalFields.description;
    if (additionalFields.status_id) issueData.status_id = additionalFields.status_id;
    if (additionalFields.tracker_id) issueData.tracker_id = additionalFields.tracker_id;
    if (additionalFields.priority_id) issueData.priority_id = additionalFields.priority_id;
    if (additionalFields.assigned_to_id) issueData.assigned_to_id = additionalFields.assigned_to_id;
    if (additionalFields.parent_issue_id) issueData.parent_issue_id = additionalFields.parent_issue_id;
    if (additionalFields.start_date) issueData.start_date = additionalFields.start_date;
    if (additionalFields.due_date) issueData.due_date = additionalFields.due_date;
    if (additionalFields.estimated_hours) issueData.estimated_hours = additionalFields.estimated_hours;
    
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
        issueData.custom_fields = customFields;
      }
    }
    
    body = {
      issue: issueData,
    };
  } else if (operation === 'delete') {
    // ----------------------------------
    //         issue:delete
    // ----------------------------------
    const issueId = this.getNodeParameter('issueId', i) as string;
    method = 'DELETE';
    endpoint = `/issues/${issueId}.json`;
  }
  
  // Make the request to Redmine API
  const options: IRequestOptions = {
    method,
    body,
    qs,
    uri: `${baseUrl}/` + endpoint.replace(/^\//, ''),
    headers: {
      'X-Redmine-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
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