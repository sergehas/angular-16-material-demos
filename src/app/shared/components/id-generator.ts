/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import { APP_ID, inject, Injectable } from "@angular/core";

/**
 * Keeps track of the ID count per prefix. This helps us make the IDs a bit more deterministic
 * like they were before the service was introduced. Note that ideally we wouldn't have to do
 * this, but there are some internal tests that rely on the IDs.
 */
const counters: Record<string, number> = {};

/** Service that generates unique IDs for DOM nodes. */
@Injectable({ providedIn: "root" })
export class IdGenerator {
  private readonly _appId = inject(APP_ID);

  /**
   * Generates a unique ID with a specific prefix.
   * @param prefix Prefix to add to the ID.
   */
  getId(prefix: string): string {
    prefix += this._appId;
    if (!counters[prefix]) {
      counters[prefix] = 0;
    }

    return `${prefix}${counters[prefix]++}`;
  }
}
