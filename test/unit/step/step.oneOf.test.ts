import { expect } from "chai";
import step from "../../../lib/step";
import { Draft04 as Core } from "../../../lib/draft04";

describe("step.oneof", () => {
    let draft: Core;
    before(() => (draft = new Core()));

    it("should return matching schema", () => {
        const res = step(
            draft,
            "title",
            {
                type: "object",
                properties: {
                    title: {
                        oneOf: [
                            { type: "string", title: "Zeichenkette" },
                            { type: "number", title: "Zahl" }
                        ]
                    }
                }
            },
            { title: 111 }
        );

        // @special case: where a schema is selected and the original schema maintained.
        // Remove the original and its flag
        delete res.oneOfSchema;
        delete res.variableSchema;
        delete res.oneOfIndex;
        expect(res).to.deep.eq({ type: "number", title: "Zahl" });
    });

    it("should return index of matching schema", () => {
        const res = step(
            draft,
            "title",
            {
                type: "object",
                properties: {
                    title: {
                        oneOf: [
                            { type: "string", title: "Zeichenkette" },
                            { type: "number", title: "Zahl" }
                        ]
                    }
                }
            },
            { title: 111 }
        );

        expect(typeof res.getOneOfOrigin).to.eq("function");
        expect(res.getOneOfOrigin().index).to.eq(1);
    });
});
