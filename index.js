/**
 *
 * All file related stuff
 *
 */
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
    [handle, granted] = await setRootDirectory()
    window.open("https://trilogy-group.github.io/ScreenRecorderDemo/tracker/index.html?folder=")
};

const createFileHandle = async (name, directoryHandle) => {
    return await directoryHandle.getFileHandle(name, { create: true })
}

const writeContentToFile = async (fileHandle, content) => {
    const writable = await (fileHandle).createWritable()
    await writable.write(content)
    await writable.close()
}

/**
 *
 * All screen capture code
 *
 */
