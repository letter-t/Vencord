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

import { ApplicationCommandInputType, ApplicationCommandOptionType, Argument, CommandContext, findOption, sendBotMessage } from "@api/Commands";
// import { Devs } from "@utils/constants";
import { makeLazy } from "@utils/lazy";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { DraftType, UploadHandler, UploadManager, UserUtils } from "@webpack/common";
import { applyPalette, GIFEncoder, quantize } from "gifenc";

const DEFAULT_DELAY = 20;
const DEFAULT_RESOLUTION = 128;
const FRAMES = 12;

const getFrames = makeLazy(() => Promise.all(
    Array.from(
        { length: FRAMES },
        (_, i) => loadImage(`https://raw.githubusercontent.com/letter-t/Vencord/main/src/userplugins/soCute/frames/socute${i}.gif`)
    ))
);

const UploadStore = findByPropsLazy("getUploads");

function loadImage(source: File | string) {
    const isFile = source instanceof File;
    const url = isFile ? URL.createObjectURL(source) : source;

    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            if (isFile)
                URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = (event, _source, _lineno, _colno, err) => reject(err || event);
        img.crossOrigin = "Anonymous";
        img.src = url;
    });
}

async function resolveImage(options: Argument[], ctx: CommandContext, noServerPfp: boolean): Promise<File | string | null> {
    for (const opt of options) {
        switch (opt.name) {
            case "image":
                const upload = UploadStore.getUpload(ctx.channel.id, opt.name, DraftType.SlashCommand);
                if (upload) {
                    if (!upload.isImage) {
                        UploadManager.clearAll(ctx.channel.id, DraftType.SlashCommand);
                        throw "Upload is not an image";
                    }
                    return upload.item.file;
                }
                break;
            case "url":
                return opt.value;
            case "user":
                try {
                    const user = await UserUtils.getUser(opt.value);
                    return user.getAvatarURL(noServerPfp ? void 0 : ctx.guild?.id, 2048).replace(/\?size=\d+$/, "?size=2048");
                } catch (err) {
                    console.error("[socute] Failed to fetch user\n", err);
                    UploadManager.clearAll(ctx.channel.id, DraftType.SlashCommand);
                    throw "Failed to fetch user. Check the console for more info.";
                }
        }
    }
    UploadManager.clearAll(ctx.channel.id, DraftType.SlashCommand);
    return null;
}

export default definePlugin({
    name: "soCute",
    description: "Adds a /socute slash command to create petting gifs from any image [petpet but the gif is different]",
    authors: [{
        id: 220369060452499456n,
        name: "letter_t",
    }],
    commands: [
        {
            inputType: ApplicationCommandInputType.BUILT_IN,
            name: "socute",
            description: "Create a socute gif. You can only specify one of the image options",
            options: [
                {
                    name: "delay",
                    description: "The delay between each frame. Defaults to 20.",
                    type: ApplicationCommandOptionType.INTEGER
                },
                {
                    name: "resolution",
                    description: "Resolution for the gif. Defaults to 120. If you enter an insane number and it freezes Discord that's your fault.",
                    type: ApplicationCommandOptionType.INTEGER
                },
                {
                    name: "image",
                    description: "Image attachment to use",
                    type: ApplicationCommandOptionType.ATTACHMENT
                },
                {
                    name: "url",
                    description: "URL to fetch image from",
                    type: ApplicationCommandOptionType.STRING
                },
                {
                    name: "user",
                    description: "User whose avatar to use as image",
                    type: ApplicationCommandOptionType.USER
                },
                {
                    name: "no-server-pfp",
                    description: "Use the normal avatar instead of the server specific one when using the 'user' option",
                    type: ApplicationCommandOptionType.BOOLEAN
                }
            ],
            execute: async (opts, cmdCtx) => {
                const frames = await getFrames();

                const noServerPfp = findOption(opts, "no-server-pfp", false);
                try {
                    var url = await resolveImage(opts, cmdCtx, noServerPfp);
                    if (!url) throw "No Image specified!";
                } catch (err) {
                    UploadManager.clearAll(cmdCtx.channel.id, DraftType.SlashCommand);
                    sendBotMessage(cmdCtx.channel.id, {
                        content: String(err),
                    });
                    return;
                }

                const avatar = await loadImage(url);

                const delay = findOption(opts, "delay", DEFAULT_DELAY);
                const resolution = findOption(opts, "resolution", DEFAULT_RESOLUTION);

                const gif = GIFEncoder();

                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = resolution;
                const ctx = canvas.getContext("2d")!;

                UploadManager.clearAll(cmdCtx.channel.id, DraftType.SlashCommand);

                for (let i = 0; i < FRAMES; i++) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    const width = [1.1, 1.32, 1.18, 0.80, 1.13, 0.90, 1.13, 1.13, 0.90, 1.10, 1.13, 1.13][i];
                    const height = [1.1, 1.05, 1.18, 1.1, 1.13, 1.14, 1.13, 0.85, 1.14, 1.10, 1.13, 0.85][i];
                    const offsetX = [-.22, -.08, -.05, -.21, -.06, -.06, -.09, 0, -.01, -.33, -.06, -0.08][i] + ((1 - width) * 0.5 + 0.1);
                    const offsetY = [0.22, 0.08, 0.15, 0.22, 0.09, 0.12, .12, .08, 0.12, 0.31, .10, .10][i] + (1 - height - 0.08);
                    const rotation = [-12, 0, 0, -14, 0, 0, 0, 0, 0, -22, 0, 0][i];

                    ctx.rotate((rotation / 180) * 3.14159);
                    ctx.drawImage(avatar, offsetX * resolution, offsetY * resolution, width * resolution, height * resolution);
                    ctx.rotate(-(rotation / 180) * 3.14159);
                    ctx.drawImage(frames[i], 0, 0, resolution, resolution);

                    const { data } = ctx.getImageData(0, 0, resolution, resolution);
                    const palette = quantize(data, 256);
                    const index = applyPalette(data, palette);

                    gif.writeFrame(index, resolution, resolution, {
                        transparent: true,
                        palette,
                        delay,
                    });
                }

                gif.finish();
                const file = new File([gif.bytesView()], "socute.gif", { type: "image/gif" });
                // Immediately after the command finishes, Discord clears all input, including pending attachments.
                // Thus, setTimeout is needed to make this execute after Discord cleared the input
                setTimeout(() => UploadHandler.promptToUpload([file], cmdCtx.channel, DraftType.ChannelMessage), 10);
            },
        },
    ]
});
