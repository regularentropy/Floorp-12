/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { CPanelSidebar } from "./components/panel-sidebar.tsx";
import { PanelSidebarElem } from "./components/sidebar.tsx";
import { SidebarContextMenuElem } from "./components/sidebar-contextMenu.tsx";
import { migratePanelSidebarData } from "./data/migration.ts";
import { WebsitePanelWindowChild } from "./website-panel-window-child.ts";
import { PanelSidebarAddModal } from "./components/panel-sidebar-modal.tsx";
import { PanelSidebarFloating } from "./components/floating.tsx";
import { noraComponent, NoraComponentBase } from "../../utils/base.ts";

//TODO: refactor needed

@noraComponent(import.meta.hot)
export default class PanelSidebar extends NoraComponentBase {
  init(): void {
    migratePanelSidebarData()
    const ctx = new CPanelSidebar();
    WebsitePanelWindowChild.getInstance();
    new PanelSidebarElem(ctx)
    new SidebarContextMenuElem(ctx);
    PanelSidebarAddModal.getInstance();
    PanelSidebarFloating.getInstance();
  }
}