/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors*
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { copyWithToast } from "@utils/misc";
import definePlugin from "@utils/types";

var curKey: string | null = null,
    lastTarget: any = null,
    element: HTMLDivElement | null = null;
const size: number = 300;
const qualifier: string = [".wrapper__6e9f8", // <- guilds
    ".avatar__07f91", // <- voip, DM channels
    ".avatar__0a06e, .avatar__20a53", // <- friends list
    ".contents_c19a55 .avatar_c19a55, .replyAvatar_c19a55, .emojiContainer__75abc", // <- messages, embeds
    ".wrapper__44b0c, .avatar_c19a55", // <- channel users
    ".callAvatarWrapper-3Ax_xH, .userAvatar__55bab", // <- DM call, server VC
    ".avatar_c51b4e, .avatarHoverTarget_f89da9, .avatar_ec3b75", // <- modals, userpopout
    ".emojiContainer_bae8cb .emoji, .repliedTextPreview_c19a55", // <- emojis, name icons
    ".reaction_fef95b .emoji, .emoji_f2bfbb, .emoji", // <- reactions
    ".emojiItem_fc7141, .emojiItemMedium_fc7141", // <- emoji menu
    ".stickerAsset__31fc2", // <- stickers
    ".roleIcon__1e6f1", // <- role icons
    ".guildIcon__48112", // <- mini guild pic
    ".assetsLargeImageUserPopout__6fc87, .assetsLargeImageUserPopoutV2__01dc1, .assetsLargeImageStreamPreview_db91fd", // <- playing on profile part 1
    ".assetsLargeImageStreamPreviewXbox_c549ba, .assetsLargeImageUserPopoutXbox__908da, .assetsLargeImageUserPopoutV2Xbox__32def", // <- playing on profile part 2
    ".customStatus__90402 .customStatusEmoji_fd509e", // <- emoji in custom status on big profile view
    ".embedAuthorIcon__6b055" // <- profile icon in bot messages
].filter(function (s) {
    return s !== null;
}).join(", ");

function handleMouseOver({ type, target }: any) {
    if (!(target.matches(qualifier) || (target = target.closest(qualifier)))) {
        return;
    }
    return updateHoverCard((type === "mouseover") && target);
}
async function updateHoverCard(target: any) {
    const isShown = (curKey === "Control");
    lastTarget = target;

    if (!document.getElementById("AvatarHoverCard")) {
        makeDiv();
    }
    const hoverCard = document.getElementById("AvatarHoverCard");
    if (!(isShown && target) && hoverCard) {
        return hoverCard?.remove();
    }
    if (!hoverCard) return;

    var boundsTarget = target.getBoundingClientRect();
    const boundsWindow = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    var left = Math.max(0, boundsTarget.left + (boundsTarget.width - size) / 2);
    if (left + size > boundsWindow.width) {
        left = boundsWindow.width - size;
    }
    var top = (size > boundsWindow.height) ? (boundsWindow.height - size) / 2 : (boundsTarget.bottom + size > boundsWindow.height) ? boundsTarget.top - size : boundsTarget.bottom;

    const url = getImgUrl(target);
    if (!url) return hoverCard.remove();

    Object.assign(hoverCard.style, {
        backgroundColor: "rgba(18,18,18,0.7)",
        backgroundImage: `url(${url})`,
        border: "2px solid #651717",
        borderRadius: "4px",
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}px`,
        left: `${left}px`,
        position: "inherit",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
    });

    const avatarHover = document.getElementsByClassName("AvatarHover");
    return avatarHover[0].appendChild(hoverCard);
}
function getImgUrl(target: any): string | undefined {
    var url: string | null = null;
    if (target?.src) url = target?.src;
    if (!url) url = target.querySelector("img")?.src;
    if (!url && target?.style.backgroundImage !== "") url = target.style.backgroundImage.match(/(?<=url\(").*(?="\))/)?.[0] || null;
    if (!url) return;
    url = url.replace(/.*https\/(?=[^/])/, "https://")
        .replace("&quality=lossless", "")
        .replace(/(?<=\?size=)[0-9]+(?=\?|$)/, `${size * 2}`)
        .replace(/(?<!size=[0-9]+)$/, `?size=${size * 2}`)
        .replace(".webp", ".png")
        .replace(/\.png\?size=[0-9]+&animated=true/, ".gif")
        + "&quality=lossless";
    url = url.match(/(\/assets\/).*(\.svg)/)?.[0] || url;
    return url;
}
function makeDiv() {
    const avatarHover = document.getElementsByClassName("AvatarHover");
    const hoverCard = document.createElement("div");
    hoverCard.id = "AvatarHoverCard";
    avatarHover[0].appendChild(hoverCard);
}
async function copyUrl({ target }: any) {
    const isShown = (curKey === "Control");
    const url = getImgUrl(target);
    if (!(isShown && url)) return;
    copyWithToast(url, "Image copied to clipboard!");
    await new Promise(r => setTimeout(r, 5000));
}
function handleKeyDown({ key }: any) {
    curKey = key;
    if (key !== "Control" && key !== "Shift") {
        return;
    }
    return updateHoverCard(lastTarget);
}
function handleKeyUp() {
    curKey = null;
    return updateHoverCard(lastTarget);
}

export default definePlugin({
    name: "AvatarHover",
    description: "When hovering, resize server pictures, profile pictures, emojis, and stickers.",
    authors: [{
        id: 220369060452499456n,
        name: "letter_t",
    }],
    patches: [],
    start() {
        element = document.createElement("div");
        element.classList.add("AvatarHover");
        Object.assign(element.style, {
            backgroundSize: "cover",
            borderStyle: "solid",
            display: "block",
            pointerEvents: "none",
            position: "fixed",
            zIndex: "99999"
        });
        document.body.appendChild(element);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOver);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        document.addEventListener("mousedown", copyUrl);
    },
    stop() {
        element?.remove();
        document.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseout", handleMouseOver);
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
        document.removeEventListener("mousedown", copyUrl);
    },
});
