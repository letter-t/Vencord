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
// import { updateMessage } from "@api/MessageUpdater";
import { definePluginSettings } from "@api/Settings";
import { NotesIcon } from "@components/Icons";
// import { classes } from "@utils/misc";
import definePlugin, { OptionType } from "@utils/types";
import { Message } from "@vencord/discord-types";
import { ChannelStore } from "@webpack/common";

let style: HTMLStyleElement;

const KEY = "AutoHideKeywords_HiddenIds";

let hiddenMessages = new Set<string>();

async function getHiddenMessages() {
    hiddenMessages = await get(KEY) ?? new Set();
    return hiddenMessages;
}

// const saveHiddenMessages = (ids: Set<string>) => set(KEY, ids);
async function saveHiddenMessages(ids: Set<string>) {
    console.log(ids.size); // ///////////////////
    set(KEY, new Set(Array.from(ids).slice(-50))); // stores up to 50 ids
}

const hasMedia = (msg: Message) => msg.attachments.length > 0 || msg.embeds.length > 0 || msg.stickerItems.length > 0;
// const hasKeyword = (msg: Message) => msg.content.match(new RegExp(settings.store.hiddenKeywords.split(/[ ,]+/).join("|"), "giu"));
const hasKeyword = (msg: Message) => (msg.content.match(new RegExp(settings.store.hiddenKeywords, "giu"))
    || msg.attachments[0]?.filename?.match(new RegExp(settings.store.hiddenKeywords.split(/[ ,]+/).join("|"), "giu"))
    || msg?.stickerItems?.[0]?.name?.match(new RegExp(settings.store.hiddenKeywords.split(/[ ,]+/).join("|"), "giu")));

async function buildCss() {
    const elements1 = [...hiddenMessages].map(id => `#message-content-${id}`).join(",");
    const elements2 = [...hiddenMessages].map(id => `#message-accessories-${id}`).join(",");
    style.textContent = `
    :is(${elements1}) :not(after) {
        /* important is not necessary, but add it to make sure bad themes won't break it */
        display: none !important;
    }
    :is(${elements2}) {
        /* important is not necessary, but add it to make sure bad themes won't break it */
        display: none !important;
    }
    :is(${elements1})::after {
        content: "Text Hidden";
        color: var(--text-muted);
        font-size: 80%;
    }
    `;
}

interface IMessageCreate {
    type: "MESSAGE_CREATE";
    optimistic: boolean;
    isPushNotification: boolean;
    channelId: string;
    guildId: string;
    message: any;
}

const settings = definePluginSettings({
    hiddenKeywords: {
        description: "Keywords used to hide messages (this is in Regex)",
        type: OptionType.STRING,
        default: "word1|word2|word3"
    }
});

export default definePlugin({
    name: "AutoHideKeywords",
    description: "Automatically hide individual messages with keywords, manually hide/unhide via hover button",
    authors: [{
        id: 220369060452499456n,
        name: "letter_t",
    }],
    settings,
    dependencies: ["MessageUpdaterAPI"],

    // patches: [{
    //     find: "observePostVisibilityAnalytics:",
    //     replacement: [
    //         // {
    //         //     // match: /(?<=\i=)this\.render(?:Attachments|Embeds|StickersAccessories)\((\i)\)/g,
    //         //     match: /className:[a-z]+.messageContent,children:[^}]+(?=[a-z]\})/g,
    //         //     replace: "$&$self.shouldHideText($0?.id)?null:"
    //         // },
    //         {
    //             match: /(?<=className:)\i.messageContent/g,
    //             replace: "($&+\" vc-hideKeywords-text\")"
    //         }
    //     ]
    // }],
    flux: {
        async MESSAGE_CREATE({ optimistic, type, message, channelId, guildId }: IMessageCreate) {
            if (optimistic || type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if (!(message?.content) && !(message?.attachments?.length)) return;

            const userId: string = message.author.id;

            // filter out media from certain users
            // if ((settings.store.hiddenUsers.match(userId)) && (hasMedia(message))) {
            //     const ids = await getHiddenMessagesMedia();
            //     ids.add(message.id);
            //     await saveHiddenMessagesMedia(ids);
            //     updateMessage(channelId, message.id);
            // }

            // filter out messages with certain keywords
            if (hasKeyword(message)) {
                const ids = await getHiddenMessages();
                ids.add(message.id);
                await saveHiddenMessages(ids);
                // updateMessage(channelId, message.id);
                await buildCss();
            }
        }
    },

    renderMessagePopoverButton(msg) {
        if (!hasKeyword(msg)) return null;

        const isHidden = hiddenMessages.has(msg.id);

        return {
            label: isHidden ? "Show Text" : "Hide Text",
            icon: isHidden ? NotesIcon : NotesIcon,
            // style: "color: var(--text-danger);",
            message: msg,
            channel: ChannelStore.getChannel(msg.channel_id),
            onClick: () => this.toggleHide(msg.channel_id, msg.id)
        };
    },

    // renderMessageAccessory({ message }) {
    //     if (!this.shouldHideText(message.id)) return null;

    //     return (
    //         <span className={classes("vc-hideKeywords-accessory", !message.content && "vc-hideKeywords-no-content")}>
    //             Text Hidden
    //         </span>
    //     );
    // },

    async start() {
        // await getHiddenMessages();
        style = document.createElement("style");
        style.id = "VencordAutoHideKeywords";
        document.head.appendChild(style);

        await getHiddenMessages();
        await buildCss();

        // addButton("HideAttachments", msg => {
        //     if (!msg.attachments.length && !msg.embeds.length && !msg.stickerItems.length) return null;

        //     const isHidden = hiddenMessages.has(msg.id);

        //     return {
        //         label: isHidden ? "Show Attachments" : "Hide Attachments",
        //         icon: isHidden ? ImageVisible : ImageInvisible,
        //         message: msg,
        //         channel: ChannelStore.getChannel(msg.channel_id),
        //         onClick: () => this.toggleHide(msg.id)
        //     };
        // });
    },

    stop() {
        // hiddenMessages.clear();
        style.remove();
        hiddenMessages.clear();
        // removeButton("HideAttachments");
    },

    shouldHideText(messageId: string) {
        return hiddenMessages.has(messageId);
    },

    async toggleHide(channelId: string, messageId: string) {
        const ids = await getHiddenMessages();
        if (!ids.delete(messageId))
            ids.add(messageId);

        await saveHiddenMessages(ids);
        // updateMessage(channelId, messageId);
        await buildCss();
    }
});




