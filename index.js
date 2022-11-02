/**
 *
 * All file related stuff
 *
 */
let folder = null
document.querySelector(".pick-dir").onclick = async () => {
    const readWriteOptions = { mode: 'readwrite' }
    const setRootDirectory = async () => {
        const handle = await (window).showDirectoryPicker()
        if (!handle) {
            return undefined
        }
        let granted = (await handle.queryPermission(readWriteOptions)) === 'granted'
        if (!granted) {
            granted = (await handle.requestPermission(readWriteOptions)) === 'granted'
        }
        return { handle, granted }
    }
    folder = await setRootDirectory()
    fileName = uuidv4() + ".txt"
    uuidFile = await createFileHandle(fileName, folder.handle)
    writeContentToFile(uuidFile, fileName)
    window.open("https://trilogy-group.github.io/ScreenRecorderDemo/tracker/index.html?folder=" + fileName)
};

const createFileHandle = async (name, directoryHandle) => {
    return await directoryHandle.getFileHandle(name, { create: true })
}

const writeContentToFile = async (fileHandle, content) => {
    const writable = await fileHandle.createWritable()
    await writable.write(content)
    await writable.close()
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

/**
 *
 * All screen capture code
 *
 */
