type SchemaObjectType1 = 'boolean' | 'integer' | 'number' | 'string' | 'array' | 'object';
type SchemaObjectType2 = Exclude<SchemaObjectType1, ('array' | 'object' | 'mixed')>;
type SchemaObjectType3 = Exclude<SchemaObjectType2, ('boolean')>;
type SchemaObjectFormat = string | undefined;

export class SchemaObjectBase1<T extends SchemaObjectType1>
{
    #uuid = self.crypto.randomUUID();

    /** The UUID of this `SchemaObject`. */
    public get uuid(): string
    {
        return this.#uuid;
    }

    #type: T;

    /** This `SchemaObject` validates successfully if its type matches the type represented by the value of this keyword. [§](https://json-schema.org/draft/2020-12/json-schema-validation.html#name-type) */
    public get type(): T
    {
        return this.#type;
    }

    /** Specify that this `SchemaObject` may be null (`null | undefined`). [§](https://swagger.io/docs/specification/data-models/data-types/#null) */
    public nullable = false;
    /** Single-line information about the purpose of this `SchemaObject`. [§](https://json-schema.org/draft/2020-12/json-schema-validation.html#name-title-and-description) */
    public description?: string;
    /** The URL of additional external documentation for this `SchemaObject`. [§](https://spec.openapis.org/oas/v3.1.0#externalDocUrl) */
    public externalDocs?: string;

    public constructor(type: T)
    {
        this.#type = type;
    }
}

export class SchemaObjectBase2<T extends SchemaObjectType2> extends SchemaObjectBase1<T>
{
    /** Can be used to supply a default value for this `SchemaObject`. [§](https://json-schema.org/draft/2020-12/json-schema-validation.html#name-default) */
    public default = undefined;
    /** This`SchemaObject` validates successfully if its value is equal to the value of this keyword. [§](https://json-schema.org/draft/2020-12/json-schema-validation.html#name-const) */
    public const = undefined;

    public constructor(type: T)
    {
        super(type);
    }
}

export class SchemaObjectBase3<T extends SchemaObjectType3, F extends SchemaObjectFormat> extends SchemaObjectBase2<T>
{
    #format: F;

    /** The format of this `SchemaObject`. [§](https://json-schema.org/draft/2020-12/json-schema-validation.html#name-vocabularies-for-semantic-c) */
    public get format(): F
    {
        return this.#format;
    }

    /** This`SchemaObject` validates successfully if its value is equal to one of the elements in this keyword's array value. Elements in the array SHOULD be unique. [§](https://json-schema.org/draft/2020-12/json-schema-validation.html#name-enum) */
    public enum = undefined;

    public constructor(type: T, format: F)
    {
        super(type);

        this.#format = format;
    }
}
