import { declareLevels } from "../src/loglevel-mixin.mjs";

import test from "ava";

test("declareLevels", t => {
  t.deepEqual(declareLevels(["a", "b", "c"]), {
    a: { name: "a", priority: 3 },
    b: { name: "b", priority: 2 },
    c: { name: "c", priority: 1 }
  });
});
