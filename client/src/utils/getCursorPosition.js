const getCursorPosition = (selection, defX, defY) => {
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const dummy = document.createElement("span");
        range.insertNode(dummy);
        let box = dummy.getBoundingClientRect();
        const {
            top,
            left
        } = box;
        dummy.parentNode.removeChild(dummy);


        const myRange2 = range.cloneRange();
        myRange2.collapse(false);
        myRange2.insertNode(dummy);

        box = dummy.getBoundingClientRect();
        dummy.parentNode.removeChild(dummy);

        const {
            bottom,
            right
        } = box;
        return {
            top,
            left,
            bottom,
            right
        };
    }

    return {
        defY,
        defX,
        defY,
        defX
    };
}

export default getCursorPosition;