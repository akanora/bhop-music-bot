# Modals
## Format
```js
// This format is for the modalForms file that you will create in `Src/Interactions/ModalForms`.
module.exports = {
    name: "modalName",
    run: async(client, interaction) => {
        // Code
    }
};
```
## Example Code
### Modal Creation Code
```js
const { ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const modal = new ModalBuilder()
.setCustomId('ExampleModal')
.setTitle('My Modal');

const favoriteColorInput = new TextInputBuilder()
.setCustomId('favoriteColorInput')
.setLabel("What's your favorite color?")
.setStyle(TextInputStyle.Short);

const hobbiesInput = new TextInputBuilder()
.setCustomId('hobbiesInput')
.setLabel("What's some of your favorite hobbies?")
.setStyle(TextInputStyle.Paragraph);

const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

modal.addComponents(firstActionRow, secondActionRow);
await interaction.showModal(modal);
```
### Modal Code
```js
// Code for the `Src/Interactions/ModalForms/ExampleModal.js
module.exports = {
    name: "ExampleModal",
    run: async(client, interaction) => {
        interaction.reply({
            content: "This modal is correctly functioning."
        });
    }
};
```