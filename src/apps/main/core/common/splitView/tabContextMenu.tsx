/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { render } from "@nora/solid-xul";
import { SplitView } from "./splitView";

export class SplitViewContextMenu {
  private static instance: SplitViewContextMenu;
  public static getInstance() {
    if (!SplitViewContextMenu.instance) {
      SplitViewContextMenu.instance = new SplitViewContextMenu();
    }
    return SplitViewContextMenu.instance;
  }

  private contextMenu() {
    const gSplitView = SplitView.getInstance();
    return (
      <>
        <xul:menuseparator />
        <xul:menuitem
          id="context_splittabs"
          data-l10n-id="floorp-split-view-open-menu"
          label="Split Tabs"
          onCommand={() => gSplitView.contextSplitTabs()}
        />
        <xul:menuitem
          id="context_split_fixedtab"
          data-l10n-id="floorp-split-view-fixed-menu"
          label="Split to Fixed Tab"
          onCommand={() => gSplitView.splitToFixedTab()}
        />
        <xul:menuseparator />
      </>
    );
  }

  constructor() {
    const parentElem = document?.getElementById("tabContextMenu");
    render(() => this.contextMenu(), parentElem, {
      marker: document?.getElementById(
        "context_closeDuplicateTabs",
      ) as XULElement,
      hotCtx: import.meta.hot,
    });
  }
}
