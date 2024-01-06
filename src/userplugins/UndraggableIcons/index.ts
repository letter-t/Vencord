import definePlugin from "@utils/types";

const handler = (e): void => { e.preventDefault(); };

export default definePlugin({
    name: "UndraggableIcons",
    description: "Makes server icons undraggable",
    authors: [{
        id: 220369060452499456n,
        name: "letter_t",
    }],
    patches: [],
    start() {
        document.addEventListener('dragstart', handler, true);
        document.addEventListener('drop', handler, true);
    },
    stop() {
        document.removeEventListener('dragstart', handler, true);
        document.removeEventListener('drop', handler, true);
    },
});
