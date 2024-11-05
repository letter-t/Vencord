import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings, Settings } from "@api/Settings";
import { useForceUpdater } from "@utils/react";
import { Flex } from "@components/Flex";
import { Grid } from "@components/Grid";
import { Button, Forms, React, Text, TextInput, moment } from "@webpack/common";

interface TextReplaceProps {
    update: () => void;
}

const pluginName = "FixedTimestamps";

function getFormattedTime(timeFormat: string): string {
    return moment().format(timeFormat);
}

function TextReplace({ update }: TextReplaceProps) {
    function onClickReset(key: string) {
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
        Settings.plugins[pluginName].LTS = Settings.plugins[pluginName].LTS ?? moment.localeData().longDateFormat("LTS");
        Settings.plugins[pluginName].LT = Settings.plugins[pluginName].LT ?? moment.localeData().longDateFormat("LT");
        Settings.plugins[pluginName].L = Settings.plugins[pluginName].L ?? moment.localeData().longDateFormat("L");
        Settings.plugins[pluginName].LL = Settings.plugins[pluginName].LL ?? moment.localeData().longDateFormat("LL");
        Settings.plugins[pluginName].LLL = Settings.plugins[pluginName].LLL ?? moment.localeData().longDateFormat("LLL");
        Settings.plugins[pluginName].LLLL = Settings.plugins[pluginName].LLLL ?? moment.localeData().longDateFormat("LLLL");
    },
    patches: [{
        find: "n(757143),n(653041),n(411104);var r=n(913527),i=n.n(r);",
        replacement: [
            // patch longDateFormat in module 232551
            {
                match: /(?<!ordinal:[a-z],)longDateFormat:[a-z]/g,
                replace: "longDateFormat:$self.getReplacementFormat()"
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
    }
});
