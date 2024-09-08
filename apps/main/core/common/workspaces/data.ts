/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { createEffect, createSignal } from "solid-js";
import { type workspaces, zworkspacesServicesStoreData } from "./utils/type";
import { workspacesServicesStaticNames } from "./utils/workspaces-static-names";

/** workspacesServices data */
export const [workspacesData, setworkspacesData] = createSignal<workspaces>(
  zworkspacesServicesStoreData.parse(
    getworkspacesServicesArrayData(
      Services.prefs.getStringPref(
        workspacesServicesStaticNames.workspaceDataPrefName,
        "{}",
      ),
    ),
  ),
);

createEffect(() => {
  Services.prefs.setStringPref(
    workspacesServicesStaticNames.workspaceDataPrefName,
    JSON.stringify({ workspaces: workspacesData() }),
  );
});

Services.prefs.addObserver("floorp.workspaces.v3.data", () =>
  setworkspacesData(
    zworkspacesServicesStoreData.parse(
      getworkspacesServicesArrayData(
        Services.prefs.getStringPref(
          workspacesServicesStaticNames.workspaceDataPrefName,
          "{}",
        ),
      ),
    ),
  ),
);

function getworkspacesServicesArrayData(stringData: string) {
  return JSON.parse(stringData).workspaces || [];
}
