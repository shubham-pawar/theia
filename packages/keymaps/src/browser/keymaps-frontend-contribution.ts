/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { inject, injectable } from 'inversify';
import {
    CommandContribution,
    Command,
    CommandRegistry,
    MenuContribution,
    MenuModelRegistry
} from '@theia/core/lib/common';
import { Widget } from '@theia/core/lib/browser';
import { CommonMenus } from '@theia/core/lib/browser/common-frontend-contribution';
import { KeymapsService } from './keymaps-service';
import { KeybindingRegistry } from '@theia/core/lib/browser/keybinding';
import { AbstractViewContribution } from '@theia/core/lib/browser';
import { KeybindingWidget } from './keybindings-widget';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';

export namespace KeymapsCommands {
    export const OPEN_KEYMAPS: Command = {
        id: 'keymaps:open',
        category: 'Settings',
        label: 'Open Keyboard Shortcuts',
    };
    export const OPEN_KEYMAPS_JSON: Command = {
        id: 'keymaps:openJson',
        category: 'Settings',
        label: 'Open Keyboard Shortcuts (JSON)',
    };
    export const OPEN_KEYMAPS_JSON_TOOLBAR: Command = {
        id: 'keymaps:openJson.toolbar',
        iconClass: 'theia-open-json-icon'
    };
}

@injectable()
export class KeymapsFrontendContribution extends AbstractViewContribution<KeybindingWidget> implements CommandContribution, MenuContribution, TabBarToolbarContribution {

    @inject(KeymapsService)
    protected readonly keymaps: KeymapsService;

    constructor() {
        super({
            widgetId: KeybindingWidget.ID,
            widgetName: KeybindingWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main'
            },
        });
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(KeymapsCommands.OPEN_KEYMAPS, {
            isEnabled: () => true,
            execute: () => this.openView({ activate: true })
        });
        commands.registerCommand(KeymapsCommands.OPEN_KEYMAPS_JSON, {
            isEnabled: () => true,
            execute: () => this.keymaps.open()
        });
        commands.registerCommand(KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR, {
            isEnabled: widget => this.isKeybindingWidget(widget),
            isVisible: widget => this.isKeybindingWidget(widget),
            execute: () => this.keymaps.open()
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE_SETTINGS_SUBMENU_OPEN, {
            commandId: KeymapsCommands.OPEN_KEYMAPS.id,
            order: 'a20'
        });
    }

    registerKeybindings(keybidings: KeybindingRegistry): void {
        keybidings.registerKeybinding({
            command: KeymapsCommands.OPEN_KEYMAPS.id,
            keybinding: 'ctrl+alt+,'
        });
    }

    registerToolbarItems(toolbar: TabBarToolbarRegistry): void {
        toolbar.registerItem({
            id: KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR.id,
            command: KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR.id,
            tooltip: 'Open Keyboard Shortcuts in JSON'
        });
    }

    protected isKeybindingWidget(widget: Widget | undefined = this.tryGetWidget()): boolean {
        return widget instanceof KeybindingWidget && widget.id === KeybindingWidget.ID
            ? true
            : false;
    }
}
