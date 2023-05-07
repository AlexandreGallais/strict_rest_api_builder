export type HttpMethodAllowed = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';

export type PathPatern = `/${string}`;

export type UuidPatern = `${string}-${string}-${string}-${string}`;

type MimeTypePatern = `${string}/${string}`;

/** This is the root object of the [OpenAPI document](https://spec.openapis.org/oas/v3.1.0#oasDocument). [§](https://spec.openapis.org/oas/v3.1.0#openapi-object) */
export interface IOpenAPIObject
{
    /** The version number of the OpenAPI Specification that the OpenAPI document uses. */
    openapi: '3.1.0';
    /** Provides metadata about the API. */
    info: IInfoObject;
    /** A list of Server Objects, which provide connectivity information to a target server. */
    servers: IServerObject[];
    /** The available paths and operations for the API. */
    paths: IPathsObject;
    /** An element to hold various schemas for the document. */
    components: IComponentsObject;
    /** A list of Tag Object, which adds metadata used by an Operation Object. */
    tags: ITagObject[];
    /** Additional external documentation. */
    externalDocs?: IExternalDocumentationObject;

    /** Show that the module is used. */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'x-use-srab': true;
}

/** Provides metadata about the API. [§](https://spec.openapis.org/oas/v3.1.0#infoObject) */
export interface IInfoObject
{
    /** The title of the API. */
    title: string;
    /** The version of the OpenAPI document. */
    version: `${number}.${number}.${number}`;
    /** A short summary of the API. */
    summary?: string;
    /** A URL to the Terms of Service for the API. */
    termsOfService?: string;
}

/** Provide connectivity information to a target server. [§](https://spec.openapis.org/oas/v3.1.0#server-object) */
export interface IServerObject
{
    /* eslint-disable @typescript-eslint/naming-convention */
    /** The server environment. */
    'x-environment': string;
    /** The server title. */
    'x-title'?: string;
    /* eslint-enable @typescript-eslint/naming-convention */

    /** An optional string describing the host designated by the URL */
    description?: string;
    /** A URL to the target host. */
    url: string;
}

/** An element to hold various schemas for the document. [§](https://spec.openapis.org/oas/v3.1.0#components-object) */
export interface IComponentsObject
{
    /** An object to hold reusable [Schema Objects](https://spec.openapis.org/oas/v3.1.0#schemaObject). */
    schemas?: { [key: UuidPatern]: ISchemaObject<'boolean' | 'integer' | 'number' | 'string' | 'array' | 'object'> };
    /** An object to hold reusable [Parameter Objects](https://spec.openapis.org/oas/v3.1.0#parameterObject). */
    parameters?: { [key: UuidPatern]: IParameterObject<'path' | 'query' | 'header'> };
    /** An object to hold reusable [Header Objects](https://spec.openapis.org/oas/v3.1.0#headerObject). */
    headers?: { [key: UuidPatern]: IHeaderObject };
}

/** The available paths for the API. [§](https://spec.openapis.org/oas/v3.1.0#paths-object) */
export interface IPathsObject
{
    /** A relative path to an individual endpoint. */
    [key: `/${string}/${string}`]: IPathItemObject;
}

/** Describes the operations available on a single path. [§](https://spec.openapis.org/oas/v3.1.0#path-item-object) */
export interface IPathItemObject
{
    /** A definition of a POST operation on this path. */
    post?: IOperationObject;
    /** A definition of a GET operation on this path. */
    get?: IOperationObject;
    /** A definition of a PATCH operation on this path. */
    patch?: IOperationObject;
    /** A definition of a PUT operation on this path. */
    put?: IOperationObject;
    /** A definition of a DELETE operation on this path. */
    delete?: IOperationObject;
    /** A list of parameters that are applicable for all the operations described under this path. */
    parameters?: IReferenceObject[];
}

/** Describes a single API operation on a path. [§](https://spec.openapis.org/oas/v3.1.0#operation-object) */
export interface IOperationObject
{
    /** A list of tags for API documentation control. */
    tags: ITagObject['name'][];
    /** A short summary of what the operation does. */
    summary?: string;
    /** Additional external documentation for this operation. */
    externalDocs?: IExternalDocumentationObject;
    /** Unique string used to identify the operation. **This uuid should never change.** */
    operationId: UuidPatern;
    /** A list of parameters that are applicable for this operation. */
    parameters?: IReferenceObject[];
    /** The request body applicable for this operation. */
    requestBody?: IRequestBodyObject;
    /** The list of possible responses as they are returned from executing this operation. */
    responses: IResponsesObject;
}

/** Additional external documentation. [§](https://spec.openapis.org/oas/v3.1.0#external-documentation-object) */
export interface IExternalDocumentationObject
{
    /** The URL for the target documentation. */
    url: string;
}

/** Describes a single operation parameter. [§](https://spec.openapis.org/oas/v3.1.0#parameter-object) */
export interface IParameterObject<In extends 'path' | 'query' | 'header'>
{
    /** The name of the parameter. */
    name: string;
    /** The location of the parameter. */
    in: In;
    /** Determines whether this parameter is mandatory. */
    required?: In extends 'path' ? true : boolean;
    /** The schema defining the type used for the parameter. */
    schema: IReferenceObject;
}

/** Describes a single request body. [§](https://spec.openapis.org/oas/v3.1.0#request-body-object) */
export interface IRequestBodyObject
{
    /** The content of the request body by MIME type. */
    content: { [key: MimeTypePatern]: IMediaTypeObject };
    /** Determines if the request body is required in the request. Defaults to `false`. */
    required?: boolean;
}

/** Each Media Type Object provides schema and examples for the media type identified by its key. [§](https://spec.openapis.org/oas/v3.1.0#media-type-object) */
export interface IMediaTypeObject
{
    /** The schema defining the content of the request, response, or parameter. */
    schema?: IReferenceObject;
}

/** The list of possible responses as they are returned from executing this operation. */
export interface IResponsesObject
{
    /** Describe the expected response from an HTTP status code. */
    [key: `${number}${number}${number}`]: IResponseObject;
}

/** Describes a single response from an API Operation, including design-time, static `links` to operations based on the response. [§](https://spec.openapis.org/oas/v3.1.0#response-object) */
export interface IResponseObject
{
    /** Maps a header name to its definition. */
    headers?: { [key: string]: IReferenceObject };
    /** The content of the response body by MIME type. */
    content?: { [key: MimeTypePatern]: IMediaTypeObject };
}

/** The Header Object follows the structure of the Parameter Object with no 'name' and 'in' attribute. [§](https://spec.openapis.org/oas/v3.1.0#header-object) */
export type IHeaderObject = Omit<IParameterObject<'header'>, ('name' | 'in')>;

/** Adds metadata used by an Operation Object. */
export interface ITagObject
{
    /** The name of the tag. */
    name: string;
    /** Additional external documentation for this tag. */
    externalDocs?: IExternalDocumentationObject;
}

/** A simple object to allow referencing other components. [§](https://spec.openapis.org/oas/v3.1.0#reference-object) */
export interface IReferenceObject
{
    /** The reference identifier. */
    $ref: `#/components/${'schemas' | 'parameters' | 'headers'}/${UuidPatern}`;
}

/** Definition of input and output data types [§](https://spec.openapis.org/oas/v3.1.0#schema-object) */
export interface ISchemaObject<
    Type extends ('boolean' | 'integer' | 'number' | 'string' | 'array' | 'object'),
    Format extends string | void = void,
>
{
    /** An instance validates successfully if its type matches the type represented by the value of the string. */
    type: Type;
    /** Allow schema authors to convey semantic information for a fixed subset of values which are accurately described by authoritative resources, be they RFCs or other external specifications. */
    format?: Type extends ('integer' | 'number' | 'string') ? Format : void;

    /** Specify that the instance may be null. */
    nullable?: boolean;
    /** Informs about the purpose of the instance described by this schema. */
    description?: string;
    /** Additional external documentation for this schema. */
    externalDocs?: IExternalDocumentationObject;
    /** This keyword can be used to supply a default JSON value associated with a particular schema. */
    default?: Type extends 'boolean' ? boolean : Type extends ('integer' | 'number') ? number : Type extends 'string' ? string : void;
    /** An instance validates successfully against this keyword if its value is equal to one of the elements in this keyword's array value. Elements in the array SHOULD be unique. */
    enum?: Type extends ('integer' | 'number') ? number[] : Type extends 'string' ? string[] : void;
    /** An instance validates successfully against this keyword if its value is equal to the value of the keyword. */
    const?: Type extends 'boolean' ? boolean : Type extends ('integer' | 'number') ? number : Type extends 'string' ? string : void;
    /** This keyword can be used to provide sample JSON values associated with a particular schema, for the purpose of illustrating usage. */
    examples?: Type extends 'string' ? string[] : void;
    /** An instance validates successfully against this keyword if it validates successfully against at least one schema defined by this keyword's value. */
    anyOf?: Type extends ('integer' | 'number' | 'string') ? IReferenceObject[] : void;

    /** A numeric instance is valid only if division by this keyword's value results in an integer. */
    multipleOf?: Type extends ('integer' | 'number') ? number : void;
    /** If the instance is a number, then this keyword validates only if the instance is less than or exactly equal to "maximum". */
    maximum?: Type extends ('integer' | 'number') ? number : void;
    /** If the instance is a number, then the instance is valid only if it has a value strictly less than (not equal to) "exclusiveMaximum". */
    exclusiveMaximum?: Type extends ('integer' | 'number') ? number : void;
    /** If the instance is a number, then this keyword validates only if the instance is greater than or exactly equal to "minimum". */
    minimum?: Type extends ('integer' | 'number') ? number : void;
    /** If the instance is a number, then the instance is valid only if it has a value strictly greater than (not equal to) "exclusiveMinimum". */
    exclusiveMinimum?: Type extends ('integer' | 'number') ? number : void;

    /** A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword. */
    maxLength?: Type extends ('string') ? number : void;
    /** A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword. */
    minLength?: Type extends ('string') ? number : void;
    /** A string instance is considered valid if the regular expression matches the instance successfully. Recall: regular expressions are not implicitly anchored. */
    pattern?: Type extends ('string') ? RegExp : void;
    /** Defines that the string SHOULD be interpreted as encoded binary data and decoded using the encoding named by this property. */
    contentEncoding?: Type extends ('string') ? string : void;
    /** Indicates the media type of the contents of the string. */
    contentMediaType?: Type extends ('string') ? MimeTypePatern : void;

    /** This keyword applies its subschema */
    items?: Type extends ('array') ? IReferenceObject : void;
    /** An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword. */
    maxItems?: Type extends ('array') ? number : void;
    /** An array instance is valid against "minItems" if its size is greater than, or equal to, the value of this keyword. */
    minItems?: Type extends ('array') ? number : void;
    /** If it has boolean value true, the instance validates successfully if all of its elements are unique. */
    uniqueItems?: Type extends ('array') ? boolean : void;

    /** Validation succeeds if, for each name that appears in both the instance and as a name within this keyword's value, the child instance for that name successfully validates against the corresponding schema. */
    properties?: Type extends ('object') ? { [key: string]: IReferenceObject } : void;
    /** An object instance is valid against this keyword if every item in the array is the name of a property in the instance. */
    required?: Type extends ('object') ? string[] : void;
}
