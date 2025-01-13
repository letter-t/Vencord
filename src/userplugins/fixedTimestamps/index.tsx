/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors*
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, Settings } from "@api/Settings";
import { Flex } from "@components/Flex";
import { Grid } from "@components/Grid";
import { useForceUpdater } from "@utils/react";
import definePlugin, { OptionType } from "@utils/types";
import { Button, Forms, moment, React, Text, TextInput } from "@webpack/common";
interface TextReplaceProps {
    update: () => void;
}
type LongDateFormatKey = | "LTS" | "LT" | "L" | "LL" | "LLL" | "LLLL" | "lts" | "lt" | "l" | "ll" | "lll" | "llll";

const pluginName = "FixedTimestamps";

function getFormattedTime(timeFormat: string): string {
    return moment().format(timeFormat);
}

function TextReplace({ update }: TextReplaceProps) {
    function onClickReset(key: LongDateFormatKey) {
        Settings.plugins[pluginName][key] = moment.localeData().longDateFormat(key);
        update();
    }

    function onChange(e: string, key: string) {
        if (e.match(/[S]{10}|[hms]{3}/g)) return; // without this, the settings menu becomes just a little bit inaccessible and the settings have to be changed with console commands. oopsies
        // The console command in question: Vencord.Plugins.plugins.fixedTimestamps.LTS = "h:mm:ss A";
        Settings.plugins[pluginName][key] = e;
        update();
    }

    return (
        <>
            <Forms.FormTitle tag="h4">Timestamp Formats</Forms.FormTitle>
            <Flex flexDirection="column" style={{ gap: "0.5em" }}>
                <Flex flexDirection="row" style={{ gap: "0.5em", alignItems: "center", width: "100%" }}>
                    <Grid columns={2} style={{ gap: "0.5em", flexGrow: "1" }}>
                        <TextInput placeholder="LTS" value={Settings.plugins[pluginName].LTS} onChange={e => onChange(e, "LTS")} />
                        <TextInput placeholder="Formatted Timestamp" editable={false} value={getFormattedTime(Settings.plugins[pluginName].LTS)} width="100%" />
                    </Grid>
                    <Button size={Button.Sizes.SMALL} onClick={() => onClickReset("LTS")} width="100%" >RESET</Button>
                </Flex>
                <Flex flexDirection="row" style={{ gap: "0.5em", alignItems: "center", width: "100%" }}>
                    <Grid columns={2} style={{ gap: "0.5em", flexGrow: "1" }}>
                        <TextInput placeholder="LT" value={Settings.plugins[pluginName].LT} onChange={e => onChange(e, "LT")} />
                        <TextInput placeholder="Formatted Timestamp" editable={false} value={getFormattedTime(Settings.plugins[pluginName].LT)} width="100%" />
                    </Grid>
                    <Button size={Button.Sizes.SMALL} onClick={() => onClickReset("LT")} width="100%" >RESET</Button>
                </Flex>
                <Flex flexDirection="row" style={{ gap: "0.5em", alignItems: "center", width: "100%" }}>
                    <Grid columns={2} style={{ gap: "0.5em", flexGrow: "1" }}>
                        <TextInput placeholder="L" value={Settings.plugins[pluginName].L} onChange={e => onChange(e, "L")} />
                        <TextInput placeholder="Formatted Timestamp" editable={false} value={getFormattedTime(Settings.plugins[pluginName].L)} width="100%" />
                    </Grid>
                    <Button size={Button.Sizes.SMALL} onClick={() => onClickReset("L")} width="100%" >RESET</Button>
                </Flex>
                <Flex flexDirection="row" style={{ gap: "0.5em", alignItems: "center", width: "100%" }}>
                    <Grid columns={2} style={{ gap: "0.5em", flexGrow: "1" }}>
                        <TextInput placeholder="LL" value={Settings.plugins[pluginName].LL} onChange={e => onChange(e, "LL")} />
                        <TextInput placeholder="Formatted Timestamp" editable={false} value={getFormattedTime(Settings.plugins[pluginName].LL)} width="100%" />
                    </Grid>
                    <Button size={Button.Sizes.SMALL} onClick={() => onClickReset("LL")} width="100%" >RESET</Button>
                </Flex>
                <Flex flexDirection="row" style={{ gap: "0.5em", alignItems: "center", width: "100%" }}>
                    <Grid columns={2} style={{ gap: "0.5em", flexGrow: "1" }}>
                        <TextInput placeholder="LLL" value={Settings.plugins[pluginName].LLL} onChange={e => onChange(e, "LLL")} />
                        <TextInput placeholder="Formatted Timestamp" editable={false} value={getFormattedTime(Settings.plugins[pluginName].LLL)} width="100%" />
                    </Grid>
                    <Button size={Button.Sizes.SMALL} onClick={() => onClickReset("LLL")} width="100%" >RESET</Button>
                </Flex>
                <Flex flexDirection="row" style={{ gap: "0.5em", alignItems: "center", width: "100%" }}>
                    <Grid columns={2} style={{ gap: "0.5em", flexGrow: "1" }}>
                        <TextInput placeholder="LLLL" value={Settings.plugins[pluginName].LLLL} onChange={e => onChange(e, "LLLL")} />
                        <TextInput placeholder="Formatted Timestamp" editable={false} value={getFormattedTime(Settings.plugins[pluginName].LLLL)} width="100%" />
                    </Grid>
                    <Button size={Button.Sizes.SMALL} onClick={() => onClickReset("LLLL")} width="100%" >RESET</Button>
                </Flex>
            </Flex>
            <Text>Edit the formats to your liking. You can do HH:mm:ss for up to 23:59:59, h:mm:ss.SSS for up to 11:59:59.999 PM, hhmm for militiary time, etc. Pressing the RESET button will reset the format to its default.</Text>
            <Text></Text>
            <Text>NOTE: messing too much with the formats can cause errors, such as making the settings menu inaccessible. Known issues have been prevented from saving (such as having ss.SSSSSSSSSS), but be careful.</Text>
        </>
    );
}

const settings = definePluginSettings({
    timeFormat: {
        type: OptionType.COMPONENT,
        description: "",
        component: () => {
            const update = useForceUpdater();
            return (
                <>
                    <TextReplace
                        update={update}
                    />
                </>
            );
        }
    },
});

export default definePlugin({
    name: "FixedTimestamps",
    description: "Allows editing how timestamps appear",
    authors: [{
        id: 220369060452499456n,
        name: "letter_t",
    }],
    settings,
    async start() {
        Settings.plugins[pluginName].LTS = Settings.plugins[pluginName].LTS ?? "h:mm:ss.S A"; // moment.localeData().longDateFormat("LTS");
        Settings.plugins[pluginName].LT = Settings.plugins[pluginName].LT ?? "h:mm :ss.S A"; // moment.localeData().longDateFormat("LT");
        Settings.plugins[pluginName].L = Settings.plugins[pluginName].L ?? moment.localeData().longDateFormat("L");
        Settings.plugins[pluginName].LL = Settings.plugins[pluginName].LL ?? moment.localeData().longDateFormat("LL");
        Settings.plugins[pluginName].LLL = Settings.plugins[pluginName].LLL ?? moment.localeData().longDateFormat("LLL");
        Settings.plugins[pluginName].LLLL = Settings.plugins[pluginName].LLLL ?? moment.localeData().longDateFormat("LLLL");
    },
    patches: [{
        find: "eH={calendar:{sameDay:\"[Today at] LT\",",
        replacement: [
            // patch in module 913527
            // {
            //     // match: /longDateFormat:{[^}]+}/g,
            //     // replace: "longDateFormat:$self.getReplacementFormat()"
            //     // replace: "longDateFormat:{LTS:\"h:mm:ss.S A\",LT:\"h:mm :ss.S A\",L:Vencord.Api.Settings.Settings.plugins[\"FixedTimestamps\"][\"L\"],LL:Vencord.Api.Settings.Settings.plugins[\"FixedTimestamps\"][\"LL\"],LLL:Vencord.Api.Settings.Settings.plugins[\"FixedTimestamps\"][\"LLL\"],LLLL:Vencord.Api.Settings.Settings.plugins[\"FixedTimestamps\"][\"LLLL\"]}"
            //     // replace: `longDateFormat:{LTS:${Settings.plugins[pluginName].LTS},LT:${Settings.plugins[pluginName].LT},L:${Settings.plugins[pluginName].L},LL:${Settings.plugins[pluginName].LL},LLL:${Settings.plugins[pluginName].LLL},LLLL:${Settings.plugins[pluginName].L}}`
            //     // replace: "longDateFormat:{LTS:\"h:mm:ss.S A\",LT:\"h:mm :ss.S A\",L:\"MM/DD/YYYY\",LL:\"MMMM D, YYYY\",LLL:\"MMMM D, YYYY h:mm :ss.S A\",LLLL:\"dddd, MMMM D, YYYY h:mm :ss.S A\"}"
            // },
            {
                match: /this\._longDateFormat(?=\[)/g,
                replace: "$self.getReplacementFormat()"
            },
            {
                match: /\] LT"/g,
                replace: "] \"+$self.getReplacementFormat().LT"
            }
        ]
    },
    {
        find: "ordinal:\"string\"",
        replacement: [
            // patch longDateFormat in module 232551
            {
                match: /(?<!ordinal:[a-z],)longDateFormat:[a-z]/g,
                replace: "longDateFormat:$self.getReplacementFormat()"
            },
            {
                match: /[a-z]\.longDateFormat/g,
                replace: "$self.getReplacementFormat()"
            }
        ]
    },
    {
        find: "(_,\"LT\")",
        replacement: [
            {
                match: /"LTS"/g,
                replace: "$self.getReplacementFormat().LTS"
            },
            {
                match: /"LT"/g,
                replace: "$self.getReplacementFormat().LT"
            },
            {
                match: /"L"/g,
                replace: "$self.getReplacementFormat().L"
            },
            {
                match: /"LL"/g,
                replace: "$self.getReplacementFormat().LL"
            },
            {
                match: /"LLL"/g,
                replace: "$self.getReplacementFormat().LLL"
            },
            {
                match: /"LLLL"/g,
                replace: "$self.getReplacementFormat().LLLL"
            }
        ]
    },
    {
        find: ",\"L LT\"",
        replacement: [
            {
                match: /"LTS"/g,
                replace: "$self.getReplacementFormat().LTS"
            },
            {
                match: /"LT"/g,
                replace: "$self.getReplacementFormat().LT"
            },
            {
                match: /"L"/g,
                replace: "$self.getReplacementFormat().L"
            },
            {
                match: /"LL"/g,
                replace: "$self.getReplacementFormat().LL"
            },
            {
                match: /"LLL"/g,
                replace: "$self.getReplacementFormat().LLL"
            },
            {
                match: /"LLLL"/g,
                replace: "$self.getReplacementFormat().LLLL"
            },
            {
                match: /"L LT"/g,
                replace: "$self.getReplacementFormat().L+\" \"+$self.getReplacementFormat().LT"
            }
        ]
    }],
    getReplacementFormat() {
        return {
            LTS: Settings.plugins[pluginName].LTS,
            LT: Settings.plugins[pluginName].LT,
            L: Settings.plugins[pluginName].L,
            LL: Settings.plugins[pluginName].LL,
            LLL: Settings.plugins[pluginName].LLL,
            LLLL: Settings.plugins[pluginName].LLLL
        };
        // return `{LTS:${Settings.plugins[pluginName].LTS},LT:${Settings.plugins[pluginName].LT},L:${Settings.plugins[pluginName].L},LL:${Settings.plugins[pluginName].LL},LLL:${Settings.plugins[pluginName].LLL},LLLL:${Settings.plugins[pluginName].L}}`
    }
});

// var ej=eI("Hours",!0),eH={calendar:{sameDay:"[Today at] LT",


// "sdRx+P":[[1,"date"]," at ",[1,"time"]]

// 372013:

// 318713:
// I = i ? (0,o.vc)(_, "LT") : (0,o.Y4)(_)
// o.vc
// o = n(55935)

// 55935:
// vc: function() {return h}
// function h(e, t) {
//     let n = E(e).locale()
//       , r = o.hg.getSetting()
//       , i = "".concat(n, ":").concat(t, ":").concat(r)
//       , s = c[i];
//     return null == s && (s = c[i] = (0,
//     a.Z)(t)),
//     s(v(e))
// }
// return null == s && (s = c[i] = (0,a.Z)(t)),s(v(e))
// a.Z
// a = n(232551)

// 232551:




// longDateFormat: {
//     LTS:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LTS"],
//     LT:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LT"],
//     L:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["L"],
//     LL:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LL"],
//     LLL:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LLL"],
//     LLLL:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LLLL"]
// }

// longDateFormat:{LTS:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LTS"],LT:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LT"],L:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["L"],LL:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LL"],LLL:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LLL"],LLLL:Vencord.Api.Settings.Settings.plugins["FixedTimestamps"]["LLLL"]}

// [^a-zA-Z0-9]LT[^a-zA-Z0-9]
