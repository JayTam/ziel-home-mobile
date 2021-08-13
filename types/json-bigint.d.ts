declare module "json-bigint" {
  namespace JSONBigint {
    interface ParseFn {
      /**
       * Converts a JavaScript Object Notation (JSON) string into an object.
       * @param text A valid JSON string.
       * @param reviver A function that transforms the results. This function is called for each member of the object.
       * If a member contains nested objects, the nested objects are transformed before the parent object is.
       */
      (text: string, reviver?: (key: string, value: any) => any): any;
    }

    interface StringifyFn {
      /**
       * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
       * @param value A JavaScript value, usually an object or array, to be converted.
       */
      (value: any): string;
    }

    export const parse: ParseFn;

    export const stringify: StringifyFn;

    /**
     *
     * @param options Specifies the parsing should be "strict" towards reporting duplicate-keys in the parsed string. The default follows what is allowed in standard json and resembles the behavior of JSON.parse, but overwrites any previous values with the last one assigned to the duplicate-key.
     * @constructor
     */
  }

  /**
   * Setting options.strict = true will fail-fast on duplicate-key occurrence and thus warn you upfront of possible lost information.
   * @param options.strict default false
   */
  function JSONBigint(options?: { strict: boolean }): {
    parse: JSONBigint.ParseFn;
    stringify: JSONBigint.StringifyFn;
  };
  export = JSONBigint;
}
