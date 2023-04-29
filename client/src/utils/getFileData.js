const getFileData = (file, onReadFile) => {
    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        const type = file.type.split('/')[1];
        fileReader.addEventListener("load", ev => {
            const src = ev.target.result;
            const name = file.name;
            onReadFile({
                file,
                src,
                type,
                name
            })
        });
    }
}

export default getFileData;