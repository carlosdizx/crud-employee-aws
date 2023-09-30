export const flattenObject = (objectDynamodb: object): object => {
  const flattenedObject = {};

  for (const key in objectDynamodb) {
    const valueObject = objectDynamodb[key];
    const valueKey = Object.keys(valueObject)[0]; // Obtener la clave dentro del valor
    flattenedObject[key] = valueObject[valueKey];
  }
  return flattenedObject;
};

export default flattenObject;
