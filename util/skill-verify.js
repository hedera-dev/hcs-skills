const ajvModule = require('ajv/dist/2020.js');

const { addHash } = require('./objects.js');

const ajv = new ajvModule({
  allErrors: true,
});

const supportedSchemas = {
  'hcs-skill': 'hcs-skill--VERSION.schema.json'
};

const schemaPathPrefix = '../schemas/';

function skillVerify(obj) {
  const schemaName = obj.type;
  const [schemaType, schemaVersion] = schemaName.split('/');
  const schemaFile = (typeof supportedSchemas[schemaType] === 'string') &&
    supportedSchemas[schemaType].replace('VERSION', schemaVersion);
  if (!schemaFile) {
    return [{
      instancePath: '/type',
      message: `unsupported schema: ${schemaName}`,
    }];
  }
  let validator = ajv.getSchema(schemaName);
  if (!validator) {
    ajv.addSchema(require(`${schemaPathPrefix}${schemaFile}`), schemaName);
    validator = ajv.getSchema(schemaName);
  }

  // NOTE: Schema validation
  // Step (5) in the accompanying tutorial
  // const isValid = /* ... */;
  const isValid = validator(obj);
  if (!isValid) {
    return validator.errors;
  }

  // NOTE: Custom validation
  // Step (6) in the accompanying tutorial
  // const objWithUpdatedHash = /* ... */;
  // if (obj.hash !== /* ... */) {
  const objWithUpdatedHash = addHash(obj);
  if (obj.hash !== objWithUpdatedHash.hash) {
    return [{
      instancePath: '/hash',
      message: 'hash mismatch',
    }];
  }

  return undefined;
}

module.exports = {
  skillVerify,
};
