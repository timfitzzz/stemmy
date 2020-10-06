export function mapSchemaToProps<P>(
  newValues: [string, string][]
): (source: any) => P {
  return function (source) {
    return Object.assign(
      {},
      source.toObject(),
      ...newValues.map((newValue) => {
        return { [newValue[0]]: source.get(newValue[1]) };
      })
    );
  };
}
