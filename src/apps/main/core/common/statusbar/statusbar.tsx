/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { manager } from "./index.ts";
import statusbarStyle from "@core/common/statusbar/statusbar.css?inline";
import { createComponent, Fragment } from "@nora/solid-xul";

export function StatusBarElem() {
  return createComponent(Fragment, {
    get children() {
      return [
        <xul:toolbar
          id="nora-statusbar"
          toolbarname="Status bar"
          customizable="true"
          style="border-top: 1px solid var(--chrome-content-separator-color)"
          class={`nora-statusbar browser-toolbar ${
            manager.showStatusBar() ? "" : "collapsed"
          }`}
          mode="icons"
          context="toolbar-context-menu"
          accesskey="A"
        >
          <xul:hbox
            id="status-text"
            align="center"
            flex="1"
            class="statusbar-padding"
          />
        </xul:toolbar>,
        <style class="nora-statusbar" jsx>
          {statusbarStyle}
        </style>,
      ];
    },
  });
}
