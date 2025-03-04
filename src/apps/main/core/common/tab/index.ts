/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { TabScroll } from "./scroll/index.ts";
import { TabOpenPosition } from "./openPosition/index.ts";
import { TabSizeSpecification } from "./sizeSpecification/index.tsx";
import { TabDoubleClickClose } from "./doubleClickClose/index.ts";
import { TabPinnedTabCustomization } from "./pinnedTabCustomization/index.tsx";
import { noraComponent, NoraComponentBase } from "../../utils/base.ts";

@noraComponent(import.meta.hot)
export default class Tab extends NoraComponentBase {
  init() {
    new TabScroll();
    new TabOpenPosition();
    new TabSizeSpecification();
    new TabDoubleClickClose();
    new TabPinnedTabCustomization();
  }
}
