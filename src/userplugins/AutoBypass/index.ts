/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors*
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    addPreEditListener,
    addPreSendListener,
    MessageObject,
    removePreEditListener,
    removePreSendListener
} from "@api/MessageEvents";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    badWords: {
        description: "Phrases to auto-bypass",
        type: OptionType.STRING,
        default: "heck,darn,crap"
    },
    addFiller: {
        description: "Toggle invisible filler characters between letters",
        type: OptionType.BOOLEAN,
        default: true
    },
    changeLetters: {
        description: "Toggle letter replacements",
        type: OptionType.BOOLEAN,
        default: true
    }
});

const alphabet: string = "acehijopsxyABCEHIKMNOPSTXYZ", // abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
    alphaspoof: string = "асеһіјорѕхуАВСЕНІΚМΝОРЅТХΥΖ", // аbсdеfgһіјkӏmnорqrѕtuvwхуzАВСDЕFGНІJΚLМΝОРQRЅТUVWХΥΖ
    filler: string = "‌";

export default definePlugin({
    name: "AutoBypass",
    description: "Auto-bypasses most chat filters.",
    settings,
    authors: [{
        id: 220369060452499456n,
        name: "letter_t",
    }],
    patches: [],
    onSend(msg: MessageObject) {
        const badWords: string[] = settings.store.badWords.split(",");
        msg.content = msg.content.replace(
            RegExp(badWords.join("|"), "gi"),
            match => this.replacer(match)
        );
    },
    replacer(word: string) {
        let idx: number;
        if (settings.store.changeLetters) {
            word = word.split("").map(t => ((idx = alphabet.indexOf(t)) === -1) ? t : alphaspoof[idx]).join(",");
        }
        return word.replace(/,/g, _ => (settings.store.addFiller) ? filler.repeat(Math.ceil(3 * Math.random())) : "");
    },
    start() {
        this.preSend = addPreSendListener((_, msg) => this.onSend(msg));
        this.preEdit = addPreEditListener((_cid, _mid, msg) =>
            this.onSend(msg)
        );
    },
    stop() {
        removePreSendListener(this.preSend);
        removePreEditListener(this.preEdit);
    },
});
