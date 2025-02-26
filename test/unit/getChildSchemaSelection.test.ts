import { expect } from "chai";
import { JsonEditor as Core } from "../../lib/jsoneditor";
import getChildSchemaSelection from "../../lib/getChildSchemaSelection";

describe("getChildSchemaSelection", () => {
    let core: Core;
    before(() => (core = new Core()));

    it("should return a single object-schema as list", () => {
        const result = getChildSchemaSelection(core, "b", {
            type: "object",
            properties: {
                a: { type: "string" },
                b: { type: "number" }
            }
        });

        expect(result).to.have.length(1);
        expect(result).to.deep.eq([{ type: "number" }]);
    });

    it("should return a single array-item as list", () => {
        const result = getChildSchemaSelection(core, 0, {
            type: "array",
            items: [{ type: "string" }, { type: "number" }]
        });

        expect(result).to.have.length(1);
        expect(result).to.deep.eq([{ type: "string" }]);
    });

    it("should return list of oneOf elements", () => {
        const result = getChildSchemaSelection(core, "b", {
            type: "array",
            items: {
                oneOf: [{ type: "string" }, { type: "number" }]
            }
        });

        expect(result).to.have.length(2);
        expect(result).to.deep.eq([{ type: "string" }, { type: "number" }]);
    });

    it("should resolve items from oneOf elements", () => {
        // @note: ref resolution requires a compiled schema
        core.setSchema({
            type: "array",
            items: {
                oneOf: [{ $ref: "#/definitions/string" }, { $ref: "#/definitions/number" }]
            },
            definitions: {
                number: { type: "number" },
                string: { type: "string" }
            }
        });

        const result = getChildSchemaSelection(core, "b", core.getSchema());

        expect(result).to.have.length(2);
        expect(result).to.deep.eq([{ type: "string" }, { type: "number" }]);
    });
});
