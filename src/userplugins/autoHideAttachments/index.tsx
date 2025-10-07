/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./styles.css";

import { get, set } from "@api/DataStore";
import { updateMessage } from "@api/MessageUpdater";
import { definePluginSettings } from "@api/Settings";
import { ImageInvisible, ImageVisible } from "@components/Icons";
import { classes } from "@utils/misc";
import definePlugin, { OptionType } from "@utils/types";
import { Message } from "@vencord/discord-types";
import { ChannelStore } from "@webpack/common";

const KEY = "AutoHideAttachments_HiddenIds";

let hiddenMessages = new Set<string>();

async function getHiddenMessages() {
    hiddenMessages = await get(KEY) ?? new Set();
    return hiddenMessages;
}

// const saveHiddenMessages = (ids: Set<string>) => set(KEY, ids);
async function saveHiddenMessages(ids: Set<string>) {
    set(KEY, new Set(Array.from(ids).slice(-2000))); // stores up to 2000 ids
}

// migratePluginSettings("AutoHideMedia", "AutoHideAttachments");

const hasMedia = (msg: Message) => msg.attachments.length > 0 || msg.embeds.length > 0 || msg.stickerItems.length > 0;
const hasKeyword = (msg: Message) => (msg.content.match(new RegExp(("(?<!<)https:\\/\\/[^ ]*" + settings.store.hiddenKeywords.split(/[ ,]+/).join("|") + "[^ ]*\\b"), "giu"))
    || msg.attachments[0]?.filename?.match(new RegExp(settings.store.hiddenKeywords.split(/[ ,]+/).join("|"), "giu"))
    || msg?.stickerItems?.[0]?.name?.match(new RegExp(settings.store.hiddenKeywords.split(/[ ,]+/).join("|"), "giu")));

interface IMessageCreate {
    type: "MESSAGE_CREATE";
    optimistic: boolean;
    isPushNotification: boolean;
    channelId: string;
    guildId: string;
    message: any;
}

const settings = definePluginSettings({
    hiddenUsers: {
        description: "Users to hide attachments from",
        type: OptionType.STRING,
        default: "UserID1, UserID2, UserID3, etc"
    },
    hiddenKeywords: {
        description: "Gifs and files with these keywords will be auto-hidden",
        type: OptionType.STRING,
        default: "word1, word2, word3, etc"
    }
});

export default definePlugin({
    name: "AutoHideMedia",
    description: "Automatically hide attachments and embeds from certain users or with certain keywords. Manually hide/unhide with hover button. REPLACES HIDEMEDIA",
    authors: [{
        id: 220369060452499456n,
        name: "letter_t",
    }],
    settings,
    dependencies: ["MessageUpdaterAPI"],

    // TODO: add a button for users on their profiles to add or remove them without finding the ID

    patches: [{
        find: "this.renderAttachments(",
        replacement: {
            match: /(?<=\i=)this\.render(?:Attachments|Embeds|StickersAccessories)\((\i)\)/g,
            replace: "$self.shouldHideMedia($1?.id)?null:$&"
        }
    }],
    flux: {
        async MESSAGE_CREATE({ optimistic, type, message, channelId, guildId }: IMessageCreate) {
            if (optimistic || type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if (!(message?.content) && !(message?.attachments?.length) && !(message?.sticker_items?.length)) return;

            const userId: string = message.author.id;

            if (!(message?.attachments?.length > 0 || message?.embeds?.length > 0 || message?.sticker_items?.length > 0 || message?.content?.match(/(?<!<)https:\/\//g))) return;

            // filter out media from certain users
            if (settings.store.hiddenUsers.match(userId)) {
                const ids = await getHiddenMessages();
                ids.add(message.id);
                await saveHiddenMessages(ids);
                updateMessage(channelId, message.id);
                return;
            }

            // filter out media with certain keywords
            if (hasKeyword(message)) {
                const ids = await getHiddenMessages();
                ids.add(message.id);
                await saveHiddenMessages(ids);
                updateMessage(channelId, message.id);
                return;
            }
        }
    },

    renderMessagePopoverButton(msg) {
        if (!hasMedia(msg) && !msg.messageSnapshots.some(s => hasMedia(s.message))) return null;

        const isHidden = hiddenMessages.has(msg.id);

        return {
            label: isHidden ? "Show Media" : "Hide Media",
            icon: isHidden ? ImageVisible : ImageInvisible,
            message: msg,
            channel: ChannelStore.getChannel(msg.channel_id),
            onClick: () => this.toggleHide(msg.channel_id, msg.id)
        };
    },

    renderMessageAccessory({ message }) {
        if (!this.shouldHideMedia(message.id)) return null;

        return (
            <span className={classes("vc-hideAttachments-accessory", !message.content && "vc-hideAttachments-no-content")}>
                Media Hidden
            </span>
        );
    },

    async start() {
        await getHiddenMessages();
    },

    stop() {
        hiddenMessages.clear();
    },

    shouldHideMedia(messageId: string) {
        return hiddenMessages.has(messageId);
    },

    async toggleHide(channelId: string, messageId: string) {
        const ids = await getHiddenMessages();
        if (!ids.delete(messageId))
            ids.add(messageId);

        await saveHiddenMessages(ids);
        updateMessage(channelId, messageId);
    }
});
