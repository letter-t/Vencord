# letter-t's Vencord Fork

A fork of Vencord for me to add some custom plugins.

Check out the original Vencord [here](https://github.com/Vendicated/Vencord)

Kept up-to-date every few days; contact me (@letter_t on Discord) if you're having problems even after updating + reinjecting this fork

<ins>Installation instructions for both Windows and Linux below

## Custom Plugins
-   **AutoHideMedia**: automatically hide images, gifs, videos, and stickers from certain users, or upon finding certain keywords in the link or file name
-   **AutoHideKeywords**: automatically hide message text upon finding certain keywords in it
-   **SoCute**: allows you to generate a gif of someone's profile picture being shaken around. added by request.
-   **AvatarHover**: shows an enlarged version of profile pictures, emojis, and more when holding Ctrl
-   **FixedTimestamps**: allows for editing the timestamp formats that Discord shows. Similar to the BetterDiscord plugin that allows you to change the timestamps shown on messages.
-   **oneuro**: oneko, but with a small neuro following the cursor instead of a cat. added by request.
-   **UndraggableIcons**: makes server icons undraggable
-   **\[NOT PRESENT IN FORK\] Project2**: hidden due to its potential to be modified and used for raiding. not present in this repo, but some changes here are made to support it on my end.

## Installation Guides
<details>
<summary>Windows (TLDR version)</summary>

---

open cmd or powershell window and enter these commands:
```powershell
winget install -e --id CoreyButler.NVMforWindows
winget install --id Git.Git -e
```
close and re-open cmd/powershell (without using "Run as administrator")
```powershell
nvm install 22.20.0
nvm use 22.20.0
npm install -g pnpm

git clone https://github.com/letter-t/Vencord
cd Vencord
pnpm install --no-frozen-lockfile
pnpm install --frozen-lockfile
pnpm build --dev
pnpm inject
```

You can see the new plugins in Discord by going to User Settings > Plugins.

### :warning: **DISCORD UPDATES WILL OCCASIONALLY REMOVE VENCORD!!** :warning: 
When your Discord reverts back to not having this Vencord fork:

- open new cmd/powershell window as non-admin, then enter these commands:
```powershell
cd Vencord
git pull origin main
pnpm build --dev
pnpm inject
```
###### Note: These commands can also fix an installation that isn't letting you get to the "update your vencord" button in Discord.

If updating and reinjecting the fork like this doesn't fix an issue you're seeing, contact me (@letter_t on discord)

---

</details>

<details>
<summary>Windows (full explanation)</summary>

---

You'll need some version of Node.js for this. I'd recommend using nvm-windows (Node Version Manager for Windows), but a standalone install works fine too.

For installing Node.js with **nvm-windows**:
- go to https://github.com/coreybutler/nvm-windows/releases and download nvm-setup.exe
- run the exe
- open a new cmd or powershell or terminal window (you may need to close other cmd/powershell/terminal windows you have open before this)
- do `nvm version` to check if nvm is installed and working
- do `nvm install 22.20.0` (or any version; `nvm install latest` also works)
- do `nvm use 22.20.0` (or whatever version you got)
- do `node -v` to check if node.js has been installed properly
- do `npm install -g pnpm` to install pnpm
- do `pnpm -v` to check if pnpm works

For installing **Node.js directly**:
- go to https://nodejs.org/en/download and click the green button that says "Windows Installer (.msi)"
- run the msi
- open a new cmd or powershell or terminal window (you may need to close other cmd/powershell/terminal windows you have open before this)
- do `node -v` to check if node.js has been installed properly
- do `npm install -g pnpm` to install pnpm
- do `pnpm -v` to check if pnpm works

You should now have node.js and pnpm installed on your system.

You'll also need to have some version of git on your system as well:
- go to https://git-scm.com/downloads/win
- either download and run the .exe, or open a cmd/powershell window and run the `winget install --id Git.Git -e --source winget` command they show
- close and reopen your cmd/powershell windows to make sure git applies
- do `git -v` to check if git was installed properly

Next, run these commands in a cmd/powershell window (without using "Run as administrator") to download this fork locally to your device at `C:\Users\[yourcurrentuser]\Vencord\` (any location works, but you'll have to change the `cd Vencord` line to match the new filepath)
```powershell
git clone https://github.com/letter-t/Vencord
cd Vencord
pnpm install --no-frozen-lockfile
pnpm install --frozen-lockfile
pnpm build --dev
pnpm inject
```
what each command does, in order:
- creates a new folder at C:\Users\[yourcurrentuser]\Vencord and installs the contents of this fork to it
- moves the terminal into the new Vencord folder
- installs dependencies
- installs more dependencies
- builds a usable version of this Vencord fork from the local files in the new Vencord folder
- injects that usable version into the Discord client

From there, you can see the new plugins in Discord by going to User Settings > Plugins.

### :warning: **DISCORD UPDATES WILL OCCASIONALLY REMOVE VENCORD!!** :warning: 
Discord updates automatically when restarted, and sometimes an update will make a change to Discord's core files, prompting it to reinstall those files and thus removing the injected Vencord installation.

Every time this happens, **you will need to re-inject the fork.**\
Instructions for this below:
- open new cmd/powershell window as non-admin
- enter these commands:
```powershell
cd Vencord
git pull origin main
pnpm build --dev
pnpm inject
```
###### Note: These commands can also fix an installation that isn't letting you get to the "update your vencord" button in Discord.

If updating and reinjecting the fork like this doesn't fix an issue you're seeing, contact me (@letter_t on discord)

---

</details>

<details>
<summary>Linux (TLDR version)</summary>

---

open terminal and run the following:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh
\. "$HOME/.nvm/nvm.sh"
nvm install 22
node -v
npm install -g pnpm
pnpm -v
```
go to https://git-scm.com/downloads/linux and follow instructions to install git

reopen terminal and run the following:
```
git clone https://github.com/letter-t/Vencord
cd Vencord
pnpm install --no-frozen-lockfile
pnpm install --frozen-lockfile
pnpm build --dev
sudo env "PATH=$PATH" pnpm inject
```

You can see the new plugins in Discord by going to User Settings > Plugins.

### :warning: **DISCORD UPDATES WILL OCCASIONALLY REMOVE VENCORD!!** :warning: 
When your Discord reverts back to not having this Vencord fork:

- open terminal and enter these commands:
```bash
cd Vencord
git pull origin main
pnpm build --dev
sudo env "PATH=$PATH" pnpm inject
```
###### Note: These commands can also fix an installation that isn't letting you get to the "update your vencord" button in Discord.

If updating and reinjecting the fork like this doesn't fix an issue you're seeing, contact me (@letter_t on discord)

---

</details>

<details>
<summary>Linux (full explanation)</summary>

---

You'll need some version of Node.js for this. Installation via nvm is shown here, but other methods should work too.
nvm-sh:
```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"
# Download and install Node.js:
nvm install 22
# Verify the Node.js version:
node -v # Should print "v22.20.0".
# Download and install pnpm:
npm install -g pnpm
# Verify the pnpm version: 
pnpm -v
```

You should now have node.js and pnpm installed on your system.

You'll also need to have some version of git on your system as well:
- go to https://git-scm.com/downloads/linux and follow instructions
- do `git -v` to check if git was installed properly

Next, run these commands in the terminal to download this repo locally to your device (any location works, but you'll have to change the `cd Vencord` line to match the new filepath)
```bash
git clone https://github.com/letter-t/Vencord
cd Vencord
pnpm install --no-frozen-lockfile
pnpm install --frozen-lockfile
pnpm build --dev
sudo env "PATH=$PATH" pnpm inject
```
what each command does, in order:
- creates a new folder at /Vencord and installs the contents of this github repo to it
- moves the terminal into the new Vencord folder
- installs dependencies
- installs more dependencies
- builds a usable version of this Vencord fork from the local files in the new Vencord folder
- injects that usable version into the Discord client

From there, you can see the new plugins in Discord by going to User Settings > Plugins.

### :warning: **DISCORD UPDATES WILL OCCASIONALLY REMOVE VENCORD!!** :warning: 
Discord updates automatically when restarted, and sometimes an update will make a change to Discord's core files, prompting it to reinstall those files and thus removing the injected Vencord installation.

Every time this happens, **you will need to re-inject the fork.**\
Instructions for this below:
- open terminal
- enter these commands:
```bash
cd Vencord
git pull origin main
pnpm build --dev
sudo env "PATH=$PATH" pnpm inject
```
###### Note: These commands can also fix an installation that isn't letting you get to the "update your vencord" button in Discord.

If updating and reinjecting the fork like this doesn't fix an issue you're seeing, contact me (@letter_t on discord)

---

</details>

## Editing the plugins on your own (advanced)

<details>
<summary>Show Contents</summary>

Useful links:

https://github.com/Vendicated/Vencord/blob/0fd094074941b8d9bb7c0349eec7efe80e196ae5/docs/1_INSTALLING.md (this file is from a past Vencord repo)

https://github.com/Vendicated/Vencord/blob/0fd094074941b8d9bb7c0349eec7efe80e196ae5/docs/2_PLUGINS.md (this file is from a past Vencord repo)

https://github.com/Vendicated/Vencord/blob/main/CONTRIBUTING.md

https://docs.vencord.dev/installing/custom-plugins/

https://docs.vencord.dev/plugins/

Good luck o7

</details>

## Disclaimer

Discord is trademark of Discord Inc. and solely mentioned for the sake of descriptivity.
Mention of it does not imply any affiliation with or endorsement by Discord Inc.

<details>
<summary>Using Vencord violates Discord's terms of service</summary>

Client modifications are against Discord’s Terms of Service.

However, Discord is pretty indifferent about them and there are no known cases of users getting banned for using client mods! So you should generally be fine as long as you don’t use any plugins that implement abusive behaviour. But no worries, all inbuilt plugins are safe to use!

Regardless, if your account is very important to you and it getting disabled would be a disaster for you, you should probably not use any client mods (not exclusive to Vencord), just to be safe

Additionally, make sure not to post screenshots with Vencord in a server where you might get banned for it

</details>
