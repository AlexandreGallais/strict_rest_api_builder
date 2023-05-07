type SchemaObjectType = 'boolean' | 'integer' | 'number' | 'string' | 'array' | 'object';
type SchemaObject = BooleanSchemaObject | IntegerSchemaObject | NumberSchemaObject | StringSchemaObject | ArraySchemaObject<SchemaObjectType> | ObjectSchemaObject | MixedSchemaObject;

import { SchemaObjectBase1, SchemaObjectBase2, SchemaObjectBase3 } from './schema_object_base.ts';

export class BooleanSchemaObject extends SchemaObjectBase2<'boolean'>
{
    public constructor()
    {
        super('boolean');
    }
}

export class IntegerSchemaObject extends SchemaObjectBase3<'integer', (string | undefined)>
{
    public multipleOf = undefined;
    public maximum = undefined;
    public exclusiveMaximum = undefined;
    public minimum = undefined;
    public exclusiveMinimum = undefined;

    public constructor(format?: string)
    {
        super('integer', format);
    }
}

export class NumberSchemaObject extends SchemaObjectBase3<'number', (string | undefined)>
{
    public multipleOf = undefined;
    public maximum = undefined;
    public exclusiveMaximum = undefined;
    public minimum = undefined;
    public exclusiveMinimum = undefined;

    public constructor(format?: string)
    {
        super('number', format);
    }
}

export class StringSchemaObject extends SchemaObjectBase3<'string', (string | undefined)>
{
    public examples = undefined;

    public maxLength = undefined;
    public minLength = undefined;
    public pattern = undefined;
    public contentEncoding = undefined;
    public contentMediaType = undefined;

    public constructor(format?: string)
    {
        super('string', format);
    }
}

export class ArraySchemaObject<Child extends SchemaObjectType> extends SchemaObjectBase1<'array'>
{
    /** Validation succeeds if all child instances successfully validates against this schema. */
    public items?: SchemaObject;
    /** Validation succeeds if the object length is less than, or equal to, this value. */
    public maxItems?: number;
    /** Validation succeeds if the object length is greater than, or equal to, this value. */
    public minItems?: number;
    /** Validation succeeds if all child instances are unique. */
    public uniqueItems?: Child extends Exclude<SchemaObjectType, ('array' | 'object')> ? boolean : false;

    public constructor()
    {
        super('array');
    }
}

export class ObjectSchemaObject extends SchemaObjectBase1<'object'>
{
    /** Validation succeeds if all child instances successfully validates against their corresponding schema. */
    public properties?: { [key: string]: SchemaObject };

    public constructor()
    {
        super('object');
    }
}

export class MixedSchemaObject extends SchemaObjectBase1<'object'>
{
    /** This`SchemaObject` validates successfully, if it validates successfully against at least one schema defined by this keyword's value. */
    public anyOf: SchemaObject[] = [];

    public constructor()
    {
        super('object');
    }
}
